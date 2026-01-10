// backend/src/models/Order.js
const mongoose = require('mongoose');
const { getMenuDB } = require('../config/db');

const itemSchema = new mongoose.Schema({
  item: { type: String, required: true }, // String to handle custom string IDs like 'itm_robusta_iced_americano'
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
    orderToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true
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
      enum: ['PENDING', 'PAID_UNVERIFIED', 'PAID'],
      required: true,
      default: 'PENDING'
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
      
      // Try to count documents with the same day
      let count = 0;
      try {
        count = await this.constructor.countDocuments({
          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        });
      } catch (countErr) {
        console.error('Count error:', countErr.message);
        count = 0; // Default to 0 if count fails
      }
      
      this.orderId = `ORD-${date}-${String(count + 1).padStart(3, '0')}`;
      console.log(`✅ Generated orderId: ${this.orderId}`);
    } catch (err) {
      // Fallback order ID if generation fails
      console.error('OrderId generation error:', err.message);
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
