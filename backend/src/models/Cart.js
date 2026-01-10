const mongoose = require('mongoose');
const { getMenuDB } = require('../config/db');

const itemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [itemSchema],
  },
  { timestamps: true }
);

schema.index({ user: 1 });

let CartModel;
function getCartModel() {
  if (!CartModel) {
    const db = getMenuDB();
    CartModel = db.models.Cart || db.model('Cart', schema);
  }
  return CartModel;
}

module.exports = getCartModel;
