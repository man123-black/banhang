const Product = require('../models/Product');

exports.search = async (query, options = {}) => {
  const { page = 1, limit = 20, category, sort } = options;
  const filter = { isActive: true };
  if (query) filter.$text = { $search: query };
  if (category) filter.category = category;
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .limit(+limit)
    .skip((+page - 1) * +limit)
    .sort(sort || { score: { $meta: 'textScore' } });
  return products;
};
