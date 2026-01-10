// backend/src/routes/order.admin.routes.js (ADMIN)
const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { getOrders, completeOrder } = require('../controllers/orderController');

const router = express.Router();

// All admin routes require authenticated admin
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/orders - get all orders
router.get('/', getOrders);

// PUT /api/admin/orders/:id/complete - complete order
router.put('/:id/complete', completeOrder);

module.exports = router;
