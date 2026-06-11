const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res) => {
  try {
    // 1. Thêm 'username' vào danh sách lấy từ req.body
    const { name, username, email, password, phone } = req.body;

    // 2. Kiểm tra xem username đã tồn tại chưa để tránh lỗi duplicate key
    const existUser = await User.findOne({ username });
    if (existUser) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });

    const existEmail = await User.findOne({ email });
    if (existEmail) return res.status(400).json({ message: 'Email đã tồn tại' });

    // 3. Thêm username vào quá trình tạo user
    const user = await User.create({ name, username, email, password, phone });
    
    await Notification.create({ 
      user: user._id, 
      type: 'system', 
      title: 'Chào mừng!', 
      message: `Chào ${name}, cảm ơn bạn đã đăng ký MyShop!` 
    });
    
    res.status(201).json({ token: signToken(user._id), user: user.toPublic() });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

// ... các hàm login, getProfile, ... giữ nguyên

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
