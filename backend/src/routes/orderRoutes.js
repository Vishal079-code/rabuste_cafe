// backend/src/routes/orderRoutes.js (PUBLIC)
const express = require('express');
const { createOrder } = require('../controllers/orderController');

const router = express.Router();

// POST /api/orders - create new order (public)
router.post('/', createOrder);

module.exports = router;
