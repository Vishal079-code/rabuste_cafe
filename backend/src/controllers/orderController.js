// backend/src/controllers/orderController.js
const getOrderModel = require('../models/Order');

// PUBLIC: Create new order
exports.createOrder = async (req, res) => {
  try {
    const Order = getOrderModel();
    const MenuItem = require('../models/MenuItem')();

    const { items, paymentMethod, pickupTime } = req.body;

    // Auth required
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Authentication required' });

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart cannot be empty' });
    }

    if (!pickupTime) {
      return res.status(400).json({ message: 'Pickup time is required' });
    }

    if (!paymentMethod || !['PAY_NOW', 'PAY_AT_COUNTER'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Validate pickup time is in the future
    const pickupDate = new Date(pickupTime);
    if (pickupDate <= new Date()) {
      return res.status(400).json({ message: 'Pickup time must be in the future' });
    }

    // items expected: [{ itemId, quantity }]
    const populatedItems = [];
    let totalAmount = 0;

    for (const it of items) {
      if (!it.itemId) return res.status(400).json({ message: 'Invalid item in payload' });
      const qty = parseInt(it.quantity, 10) || 0;
      if (qty <= 0) return res.status(400).json({ message: 'Invalid quantity' });

      const menuItem = await MenuItem.findById(it.itemId).lean();
      if (!menuItem) {
        // skip missing items but continue
        continue;
      }

      // derive price (take first price entry)
      const price = menuItem.prices && menuItem.prices[0] ? menuItem.prices[0].price : 0;
      const name = menuItem.name || 'Unknown Item';

      populatedItems.push({ item: menuItem._id, name, price, quantity: qty });
      totalAmount += price * qty;
    }

    if (populatedItems.length === 0) return res.status(400).json({ message: 'No valid items in cart' });

    // Determine payment status based on payment method
    const paymentStatus = paymentMethod === 'PAY_NOW' ? 'PAID' : 'PENDING';

    // Create order
    const order = new Order({
      user: user._id,
      items: populatedItems,
      totalAmount,
      paymentMethod,
      paymentStatus,
      pickupTime: pickupDate,
      status: 'PENDING',
    });

    await order.save();

    // Clear user's cart
    const getCartModel = require('../models/Cart');
    const Cart = getCartModel();
    await Cart.findOneAndUpdate({ user: user._id }, { $set: { items: [] } });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (err) {
    console.error('Create order error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Order ID conflict. Please try again.' });
    }
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

// ADMIN: Get all orders
exports.getOrders = async (req, res) => {
  try {
    const Order = getOrderModel();
    const { status, filter } = req.query;

    let query = {};

    // Filter by status - prioritize filter parameter
    if (filter === 'pending') {
      query.status = 'PENDING';
    } else if (filter === 'completed') {
      query.status = 'COMPLETED';
    } else if (status && ['PENDING', 'COMPLETED'].includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();

    res.json({ data: orders });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// ADMIN: Complete order
exports.completeOrder = async (req, res) => {
  try {
    const Order = getOrderModel();
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Order is already completed' });
    }

    order.status = 'COMPLETED';
    await order.save();

    res.json({
      message: 'Order completed successfully',
      order,
    });
  } catch (err) {
    console.error('Complete order error:', err);
    res.status(500).json({ message: 'Failed to complete order', error: err.message });
  }
};
