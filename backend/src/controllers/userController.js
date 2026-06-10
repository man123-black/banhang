const User = require('../models/User');
const Order = require('../models/Order');

exports.getAll = async (req, res) => {
  const users = await User.find({ isAdmin: false }).select('-password');
  res.json(users);
};

exports.getById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
  const orders = await Order.find({ user: user._id });
  const totalSpent = orders.reduce((sum, o) => sum + (o.isPaid ? o.totalPrice : 0), 0);
  res.json({ ...user.toObject(), totalSpent, orderCount: orders.length });
};

exports.update = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json(user);
};

exports.toggleBlock = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ message: user.isBlocked ? 'Đã khóa' : 'Đã mở khóa', user: user.toPublic() });
};

exports.remove = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Đã xóa' });
};
