const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: String,
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: Number,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true, index: true },
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
