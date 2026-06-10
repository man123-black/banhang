const Notification = require('../models/Notification');

exports.notifyUser = async (userId, type, title, message, link = null) => {
  return await Notification.create({ user: userId, type, title, message, link });
};

exports.notifyNewOrder = async (order, user) => {
  return await Notification.create({
    user: user._id,
    type: 'order',
    title: 'Đặt hàng thành công',
    message: `Đơn hàng #${order.orderNumber} đã được tiếp nhận`,
    link: `/orders/${order._id}`
  });
};

exports.broadcast = async (title, message, type = 'promotion') => {
  const User = require('../models/User');
  const users = await User.find({ isAdmin: false }, '_id');
  const notifications = users.map(u => ({ user: u._id, type, title, message }));
  return await Notification.insertMany(notifications);
};
