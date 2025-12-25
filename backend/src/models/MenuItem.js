// backend/src/models/MenuItem.js
const mongoose = require('mongoose');
const { getMenuDB } = require('../config/db');

const priceSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
  isDiscount: { type: Number, default: 0 }, // 0 = no discount, otherwise % discount
  inStock: { type: Boolean, default: true },
});

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuGroup', required: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    prices: [priceSchema],
  },
  { timestamps: true }
);

let MenuItemModel;

function getMenuItemModel() {
  if (!MenuItemModel) {
    const db = getMenuDB();
    MenuItemModel = db.models.MenuItem || db.model('MenuItem', schema);
  }
  return MenuItemModel;
}

module.exports = getMenuItemModel;
