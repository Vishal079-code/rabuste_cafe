import { useEffect, useState } from 'react';
import { createOrder } from '../services/api';
import '../styles/Order.css';

// Category ID mapping (matching MenuViewer)
const CATEGORY_ID_MAP = {
  "Robusta Speciality Coffee": "cat_robusta",
  "Blend Coffee": "cat_blend",
  "Manual Brew": "cat_manual",
  "Non Coffee Drinks": "cat_noncoffee",
  "Savoury": "cat_food"
};

// Helper functions from MenuViewer
function buildSubCategoryId(categoryId, subName) {
  const clean = subName.toLowerCase().replace(/\s+/g, "_");
  if (clean === "shake") return "sub_shake";
  if (clean === "cold_tea") return "sub_tea";
  if (clean === "food_items") return "sub_food";
  if (clean === "manual_brew") return "sub_manual";
  return `sub_${categoryId.replace("cat_", "")}_${clean}`;
}

function getFinalPrice(item) {
  const base = item.prices?.[0]?.price;
  if (!base || !item.discount) {
    return { final: base, strike: null, label: null };
  }
  if (item.discount.type === "PERCENT") {
    const d = Math.round(base - (base * item.discount.value) / 100);
    return {
      final: d,
      strike: base,
      label: item.discount.label || `${item.discount.value}% OFF`
    };
  }
  if (item.discount.type === "FLAT") {
    const d = base - item.discount.value;
    return {
      final: d,
      strike: base,
      label: item.discount.label || `₹${item.discount.value} OFF`
    };
  }
  return { final: base, strike: null, label: null };
}

const Order = () => {
  const [menuData, setMenuData] = useState({
    categories: [],
    subCategories: [],
    items: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [pickupTime, setPickupTime] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('http://localhost:5000/debug/menu-full');
        const data = await res.json();
        setMenuData(data);
        // Set first active category's string ID (e.g., "cat_robusta")
        if (data.categories && data.categories.length > 0) {
          const firstCat = data.categories.find(c => c.isActive !== false) || data.categories[0];
          const categoryName = firstCat.name;
          const categoryStringId = CATEGORY_ID_MAP[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '_');
          setSelectedCategory(categoryStringId);
        }
      } catch (err) {
        setError('Failed to load menu. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubCategory('');
  }, [selectedCategory]);

  // Get available subcategories for selected category
  // Handle both ObjectId reference (categoryId) and string (category) formats
  // MenuViewer line 194 uses s.category === categoryId (string)
  // But backend model uses categoryId as ObjectId - menu-full may transform it
  const selectedCategoryObj = menuData.categories.find(cat => {
    const catName = cat.name;
    const catStringId = CATEGORY_ID_MAP[catName] || catName.toLowerCase().replace(/\s+/g, '_');
    return catStringId === selectedCategory;
  });

  const availableSubCategories = menuData.subCategories
    .filter((s) => {
      // Try string comparison first (MenuViewer style)
      if (s.category === selectedCategory) return true;
      // Try ObjectId comparison (backend model style)
      const subCatRef = s.categoryId?._id || s.categoryId || s.category?._id || s.category;
      const catRef = selectedCategoryObj?._id || selectedCategoryObj?.id;
      if (subCatRef && catRef) {
        return String(subCatRef) === String(catRef);
      }
      // Try category name match as fallback
      if (selectedCategoryObj && s.category?.name) {
        return s.category.name === selectedCategoryObj.name;
      }
      return false;
    })
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // Get items grouped by subcategory and section (EXACT MenuViewer structure)
  // MenuViewer lines 193-211: subcategory → section → items
  const itemsBySubCategory = availableSubCategories.map((sub) => {
    const subId = buildSubCategoryId(selectedCategory, sub.name);

    const items = menuData.items.filter(
      (i) =>
        i.categoryId === selectedCategory && // STRING comparison
        i.subCategoryId === subId // STRING comparison
    );

    if (!items.length) return null;

    // Group by section EXACTLY like MenuViewer lines 207-211
    const sections = items.reduce((acc, item) => {
      acc[item.section || "GENERAL"] ??= [];
      acc[item.section || "GENERAL"].push(item);
      return acc;
    }, {});

    return {
      subId,
      subName: sub.name,
      sections: Object.entries(sections).map(([section, sectionItems]) => ({
        section,
        items: sectionItems.filter(item => item.isActive !== false)
      })).filter(sec => sec.items.length > 0)
    };
  }).filter(Boolean);

  // Get category display name
  const getCategoryName = (categoryId) => {
    const cat = menuData.categories.find(c => (c._id || c.id) === categoryId);
    return cat?.name || 'Unknown';
  };

  // Get subcategory display name
  const getSubCategoryName = (subCategoryId) => {
    const sub = menuData.subCategories.find(s => (s._id || s.id) === subCategoryId);
    return sub?.name || 'Unknown';
  };

  // Add item to cart (create shallow copy - NEVER mutate menu items)
  const handleAddToCart = (item) => {
    const { final } = getFinalPrice(item);
    if (!final || final === null || final === undefined) {
      setError('Item price not available');
      return;
    }

    // EXACT MenuViewer stock check (line 244-246)
    const inStock = item.inStock !== false;
    
    if (!inStock) {
      setError('Item is out of stock');
      return;
    }

    // Use item.id (MenuViewer key) or fallback to _id
    const itemId = item.id || item._id;
    if (!itemId) {
      setError('Invalid item');
      return;
    }

    const existingItem = cart.find(c => {
      // Compare by ObjectId string representation or direct equality
      const cartItemId = String(c.itemId);
      const currentItemId = String(itemId);
      return cartItemId === currentItemId;
    });

    if (existingItem) {
      setCart(cart.map(c => {
        const cartItemId = String(c.itemId);
        const currentItemId = String(itemId);
        if (cartItemId === currentItemId) {
          return { ...c, quantity: c.quantity + 1 };
        }
        return c;
      }));
    } else {
      // Create shallow copy - NEVER mutate menu items
      setCart([
        ...cart,
        {
          itemId, // Store ObjectId as-is for backend
          name: item.name,
          price: final,
          quantity: 1,
        },
      ]);
    }
    setError('');
  };

  // Update cart item quantity
  const updateQuantity = (itemId, delta) => {
    setCart(cart.map(item => {
      const cartItemId = String(item.itemId);
      const targetId = String(itemId);
      if (cartItemId === targetId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const targetId = String(itemId);
    setCart(cart.filter(item => String(item.itemId) !== targetId));
  };

  // Calculate total
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle payment choice
  const handlePaymentChoice = async (paymentMethod) => {
    if (!pickupTime) {
      setError('Please select a pickup time');
      return;
    }

    // Validate pickup time is in the future
    const pickupDate = new Date(pickupTime);
    if (pickupDate <= new Date()) {
      setError('Pickup time must be in the future');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod,
        pickupTime: pickupDate.toISOString(),
      };

      const res = await createOrder(orderData);
      setOrderConfirmation(res.data.order);
      setOrderSubmitted(true);
      setShowPaymentModal(false);
      setCart([]);
      setPickupTime('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset order confirmation
  const handleNewOrder = () => {
    setOrderSubmitted(false);
    setOrderConfirmation(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="order-page">
        <div className="order-loading">Loading menu...</div>
      </div>
    );
  }

  if (orderSubmitted && orderConfirmation) {
    return (
      <div className="order-page">
        <div className="order-confirmation">
          <h2>Order Placed Successfully!</h2>
          <div className="confirmation-details">
            <p><strong>Order ID:</strong> {orderConfirmation.orderId}</p>
            <p><strong>Status:</strong> {orderConfirmation.status}</p>
            <p><strong>Payment Status:</strong> {orderConfirmation.paymentStatus}</p>
            <p><strong>Pickup Time:</strong> {new Date(orderConfirmation.pickupTime).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ₹{orderConfirmation.totalAmount.toFixed(2)}</p>
          </div>
          <button onClick={handleNewOrder} className="btn-primary">
            Place New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h1>Place Your Order</h1>
      {error && <div className="order-error">{error}</div>}

      <div className="order-container">
        {/* MENU SECTION */}
        <div className="order-menu-section">
          <h2>Menu</h2>
          
          {/* Category Dropdown */}
          <div className="order-filters">
            <div className="filter-group">
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="order-select"
              >
                <option value="">Select Category</option>
                {menuData.categories
                  .filter(cat => cat.isActive !== false)
                  .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                  .map((cat) => {
                    const catStringId = CATEGORY_ID_MAP[cat.name] || cat.name.toLowerCase().replace(/\s+/g, '_');
                    return (
                      <option key={cat._id || cat.id} value={catStringId}>
                        {cat.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* Subcategory Dropdown */}
            {selectedCategory && availableSubCategories.length > 0 && (
              <div className="filter-group">
                <label>Subcategory:</label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="order-select"
                >
                  <option value="">All Subcategories</option>
                  {availableSubCategories.map((sub) => {
                    const subId = buildSubCategoryId(selectedCategory, sub.name);
                    const subKey = sub._id || sub.id || subId;
                    return (
                      <option key={subKey} value={subId}>
                        {sub.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          {/* Items Display - EXACT MenuViewer structure: subcategory → section → items */}
          {selectedCategory && (
            <div className="order-items-container">
              {itemsBySubCategory.length === 0 ? (
                <p className="no-items">No items available. Select a category and subcategory.</p>
              ) : (
                itemsBySubCategory
                  .filter((subCatData) => {
                    // If subcategory is selected, filter to only that subcategory
                    // Otherwise show all subcategories for the category
                    return !selectedSubCategory || subCatData.subId === selectedSubCategory;
                  })
                  .map((subCatData) => {
                    const subCatKey = subCatData.subId || `${selectedCategory}-${subCatData.subName}`;
                    
                    return (
                      <div key={subCatKey} className="order-subcategory-group">
                        <h3 className="order-subcategory-title">{subCatData.subName.toUpperCase()}</h3>
                        
                        {subCatData.sections.map((sectionData) => {
                          const sectionKey = `${subCatKey}-${sectionData.section}`;
                          
                          return (
                            <div key={sectionKey} className="order-section-group">
                              <h4 className="order-section-title">{sectionData.section}</h4>
                              
                              <div className="order-items-grid">
                                {sectionData.items.map((item, itemIdx) => {
                                  const { final, strike, label } = getFinalPrice(item);
                                  // EXACT MenuViewer stock check (line 244-246)
                                  const inStock = item.inStock !== false;
                                  // EXACT MenuViewer key (line 229: item.id) - prefer item.id
                                  const itemId = item.id || item._id;
                                  if (!itemId) {
                                    console.warn('Item missing id:', item);
                                  }
                                  // Composite key as specified: categoryId|subId|section|itemId
                                  // Use item.id (MenuViewer style) or fallback to _id, then to index-based key
                                  const compositeKey = itemId 
                                    ? `${selectedCategory}|${subCatData.subId}|${sectionData.section}|${String(itemId)}`
                                    : `${selectedCategory}|${subCatData.subId}|${sectionData.section}|idx-${itemIdx}`;

                                  return (
                                    <div key={compositeKey} className="order-item-card">
                                      <div className="item-info">
                                        <h3>{item.name}</h3>
                                        <div className="item-price">
                                          {strike && (
                                            <span className="price-strike">₹{strike}</span>
                                          )}
                                          <span className="price-final">₹{final ?? "—"}</span>
                                          {label && <span className="price-discount">{label}</span>}
                                        </div>
                                        <div className="item-availability">
                                          <span className={inStock ? 'stock-in' : 'stock-out'}>
                                            {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                                          </span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => handleAddToCart(item)}
                                        disabled={!inStock || final === undefined || final === null || item.isActive === false}
                                        className="btn-add-cart"
                                        style={{
                                          opacity: item.isActive === false ? 0.4 : 1
                                        }}
                                      >
                                        Add to Cart
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>

        {/* CART SECTION */}
        <div className="order-cart-section">
          <h2>Cart</h2>
          
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <p className="cart-hint">Select items from the menu to add to cart</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, idx) => {
                  // Use composite key for cart items
                  const cartKey = item.itemId ? String(item.itemId) : `cart-${idx}`;
                  return (
                  <div key={cartKey} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="cart-item-price">₹{item.price.toFixed(2)} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <button
                        onClick={() => updateQuantity(item.itemId, -1)}
                        className="btn-quantity"
                      >
                        −
                      </button>
                      <span className="cart-quantity">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.itemId, 1)}
                        className="btn-quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.itemId)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="cart-summary">
                <div className="cart-total">
                  <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
                </div>

                <div className="cart-pickup-time">
                  <label>Pickup Time (Required):</label>
                  <input
                    type="datetime-local"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="order-input"
                    required
                  />
                </div>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={!pickupTime || submitting}
                  className="btn-pay"
                >
                  {submitting ? 'Processing...' : 'Pay & Place Order'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => !submitting && setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Choose Payment Method</h2>
            <div className="payment-options">
              <button
                onClick={() => handlePaymentChoice('PAY_NOW')}
                disabled={submitting}
                className="payment-option-btn"
              >
                <span className="payment-option-title">Pay Now</span>
                <p className="payment-option-desc">Scan QR code to pay online</p>
                {false && (
                  <img 
                    src="/dummy-qr.png" 
                    alt="QR Code" 
                    className="qr-code"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </button>
              <button
                onClick={() => handlePaymentChoice('PAY_AT_COUNTER')}
                disabled={submitting}
                className="payment-option-btn"
              >
                <span className="payment-option-title">Pay at Counter</span>
                <p className="payment-option-desc">Pay when you pickup your order</p>
              </button>
            </div>
            {submitting && (
              <div className="payment-loading">Processing your order...</div>
            )}
            <button
              onClick={() => setShowPaymentModal(false)}
              disabled={submitting}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
