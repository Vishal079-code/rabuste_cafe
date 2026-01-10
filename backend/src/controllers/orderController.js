// backend/src/controllers/orderController.js
const getOrderModel = require('../models/Order');

// PUBLIC: Create new order
exports.createOrder = async (req, res) => {
  try {
    const Order = getOrderModel();
    
    const { items, paymentMethod, pickupTime } = req.body;

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

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Determine payment status based on payment method
    const paymentStatus = paymentMethod === 'PAY_NOW' ? 'PAID' : 'UNPAID';

    // Create order
    const order = new Order({
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      pickupTime: pickupDate,
      status: 'PENDING',
    });

    await order.save();

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
