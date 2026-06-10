const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: 'text' },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, index: 'text' },
  price: { type: Number, required: true, min: 0, index: true },
  salePrice: { type: Number, min: 0 },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  brand: String,
  stock: { type: Number, default: 0, min: 0 },
  sold: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  specifications: { type: Map, of: String }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ sold: -1, rating: -1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
