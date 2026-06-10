const Notification = require('../models/Notification');

exports.getMy = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.json({ notifications, unreadCount });
};

exports.markAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  res.json({ message: 'Đã đánh dấu đọc' });
};

exports.markOneAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true, readAt: new Date() });
  res.json({ message: 'Đã đánh dấu đọc' });
};

exports.create = async (req, res) => {
  const notif = await Notification.create(req.body);
  res.status(201).json(notif);
};

exports.broadcast = async (req, res) => {
  const { title, message, type } = req.body;
  const users = await require('../models/User').find({ isAdmin: false }, '_id');
  const notifications = users.map(u => ({ user: u._id, type, title, message }));
  await Notification.insertMany(notifications);
  res.json({ message: `Đã gửi tới ${users.length} người dùng` });
};
