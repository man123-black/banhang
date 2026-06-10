const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number, qty: Number, image: String
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: String, ward: String, note: String
  },
  paymentMethod: { type: String, enum: ['COD', 'VNPAY', 'MOMO', 'BANKING'], default: 'COD' },
  paymentResult: { id: String, status: String, update_time: String },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, default: 30000 },
  discount: { type: Number, default: 0 },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  trackingNumber: String,
  cancelReason: String,
  note: String,
  statusHistory: [{
    status: String, updatedAt: Date, updatedBy: String, note: String
  }]
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
