const getCartModel = require('../models/Cart');
const getMenuItemModel = require('../models/MenuItem');

exports.getCart = async (req, res) => {
  try {
    const Cart = getCartModel();
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.item').lean();
    if (!cart) return res.json({ data: { items: [] } });
    res.json({ data: cart });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const Cart = getCartModel();
    const MenuItem = getMenuItemModel();
    const userId = req.user._id;
    const { itemId, quantity } = req.body;
    if (!itemId) return res.status(400).json({ message: 'ItemId required' });
    const qty = parseInt(quantity, 10) || 1;

    const menuItem = await MenuItem.findById(itemId).lean();
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [{ item: menuItem._id, quantity: qty }] });
    } else {
      const existing = cart.items.find(i => String(i.item) === String(itemId));
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.items.push({ item: menuItem._id, quantity: qty });
      }
      await cart.save();
    }
    const populated = await Cart.findById(cart._id).populate('items.item').lean();
    res.json({ data: populated });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const Cart = getCartModel();
    const userId = req.user._id;
    const { itemId, quantity } = req.body;
    if (!itemId) return res.status(400).json({ message: 'ItemId required' });
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) return res.status(400).json({ message: 'Invalid quantity' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const idx = cart.items.findIndex(i => String(i.item) === String(itemId));
    if (idx === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (qty === 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = qty;
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.item').lean();
    res.json({ data: populated });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const Cart = getCartModel();
    const userId = req.user._id;
    const { itemId } = req.params;
    if (!itemId) return res.status(400).json({ message: 'ItemId required' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => String(i.item) !== String(itemId));
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.item').lean();
    res.json({ data: populated });
  } catch (err) {
    console.error('Remove cart item error:', err);
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const Cart = getCartModel();
    const userId = req.user._id;
    const cart = await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } }, { new: true }).populate('items.item').lean();
    res.json({ data: cart || { items: [] } });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
};
