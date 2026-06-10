const Category = require('../models/Category');

exports.getAll = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
  res.json(categories);
};

exports.getById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json(category);
};

exports.create = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

exports.update = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(category);
};

exports.remove = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Đã xóa' });
};
