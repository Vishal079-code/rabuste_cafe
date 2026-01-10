// backend/src/models/Order.js
const mongoose = require('mongoose');
const { getMenuDB } = require('../config/db');

const itemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const schema = new mongoose.Schema(
  {
    orderId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [itemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { 
      type: String, 
      enum: ['PAY_NOW', 'PAY_AT_COUNTER'], 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ['PAID', 'UNPAID'], 
      required: true,
      default: 'UNPAID'
    },
    pickupTime: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'COMPLETED'], 
      default: 'PENDING',
      index: true
    },
  },
  { timestamps: true }
);

// Generate readable order ID (e.g., ORD-20240115-001)
schema.pre('save', async function(next) {
  if (!this.orderId) {
    try {
      const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const count = await this.constructor.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
      this.orderId = `ORD-${date}-${String(count + 1).padStart(3, '0')}`;
    } catch (err) {
      // Fallback order ID if count fails
      this.orderId = `ORD-${Date.now()}`;
    }
  }
  next();
});

schema.index({ status: 1, createdAt: -1 });
schema.index({ orderId: 1 });


let OrderModel;

function getOrderModel() {
  if (!OrderModel) {
    const db = getMenuDB();
    OrderModel = db.models.Order || db.model('Order', schema);
  }
  return OrderModel;
}

module.exports = getOrderModel;
