const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email đã tồn tại' });
    const user = await User.create({ name, email, password, phone });
    await Notification.create({ user: user._id, type: 'system', title: 'Chào mừng!', message: `Chào ${name}, cảm ơn bạn đã đăng ký MyShop!` });
    res.status(201).json({ token: signToken(user._id), user: user.toPublic() });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Sai thông tin đăng nhập' });
    }
    if (user.isBlocked) return res.status(403).json({ message: 'Tài khoản bị khóa' });
    user.lastLogin = Date.now();
    await user.save();
    res.json({ token: signToken(user._id), user: user.toPublic() });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProfile = async (req, res) => { res.json(req.user); };

exports.updateProfile = async (req, res) => {
  const { name, phone, address, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address, avatar }, { new: true });
  res.json(user.toPublic());
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(oldPassword))) {
    return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Đổi mật khẩu thành công' });
};

exports.forgotPassword = async (req, res) => {
  res.json({ message: 'Email khôi phục đã được gửi (demo)' });
};
