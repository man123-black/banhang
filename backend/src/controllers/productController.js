const Product = require('../models/Product');
const Analytics = require('../models/Analytics');
const { getRedis } = require('../config/redis');

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, sort, minPrice, maxPrice, brand, isFeatured } = req.query;
    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (isFeatured) query.isFeatured = isFeatured === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = +minPrice;
      if (maxPrice) query.price.$lte = +maxPrice;
    }
    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'best_selling') sortObj = { sold: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortObj)
      .limit(+limit)
      .skip((+page - 1) * +limit);
    const total = await Product.countDocuments(query);
    res.json({ products, totalPages: Math.ceil(total / limit), currentPage: +page, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Không tìm thấy' });
    Analytics.create({ type: 'view', product: product._id, ip: req.ip, userAgent: req.get('user-agent') }).catch(() => {});
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getFeatured = async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true }).limit(10);
  res.json(products);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Đã xóa' });
};
