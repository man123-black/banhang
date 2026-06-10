const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: { type: String, enum: ['view', 'purchase', 'add_cart', 'search', 'checkout', 'login', 'register'], required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  searchQuery: String,
  value: Number,
  ip: String,
  userAgent: String,
  referrer: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

analyticsSchema.index({ type: 1, createdAt: -1 });
analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // TTL 90 days

module.exports = mongoose.model('Analytics', analyticsSchema);
