const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  image: { type: String, required: true },
  mobileImage: String,
  link: String,
  buttonText: { type: String, default: 'Xem ngay' },
  position: { type: String, enum: ['home_top', 'home_mid', 'home_bottom', 'sidebar', 'popup'], default: 'home_top', index: true },
  order: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true, index: true },
  clicks: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
