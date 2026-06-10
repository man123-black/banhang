const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Vui lòng đăng nhập' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User không tồn tại' });
    if (req.user.isBlocked) return res.status(403).json({ message: 'Tài khoản bị khóa' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
};
