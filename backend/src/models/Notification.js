const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  type: { type: String, enum: ['order', 'promotion', 'system', 'review', 'stock'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String,
  image: String,
  isRead: { type: Boolean, default: false, index: true },
  readAt: Date
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
