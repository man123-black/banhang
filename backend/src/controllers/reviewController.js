const Review = require('../models/Review');
const Product = require('../models/Product');

exports.create = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user._id });
    const reviews = await Review.find({ product: req.body.product });
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.body.product, { rating: avgRating.toFixed(1), numReviews: reviews.length });
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này' });
    res.status(500).json({ message: err.message });
  }
};

exports.getByProduct = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(reviews);
};

exports.getAll = async (req, res) => {
  const reviews = await Review.find().populate('user', 'name').populate('product', 'name images').sort({ createdAt: -1 });
  res.json(reviews);
};

exports.remove = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Đã xóa' });
};
