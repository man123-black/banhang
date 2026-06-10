const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, select: false, minlength: 6 },
  avatar: { type: String, default: '' },
  phone: String,
  address: {
    street: String, city: String, district: String, ward: String, country: { type: String, default: 'Vietnam' }
  },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  lastLogin: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function(entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.toPublic = function() {
  return { _id: this._id, name: this.name, email: this.email, isAdmin: this.isAdmin, avatar: this.avatar, phone: this.phone };
};

module.exports = mongoose.model('User', userSchema);
