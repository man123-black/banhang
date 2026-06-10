const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

exports.getDashboard = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);
    const lastMonth = new Date(thisMonth); lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [totalRev, todayRev, monthRev, lastMonthRev, totalOrders, todayOrders, customers, pending, lowStock] = await Promise.all([
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: thisMonth } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: lastMonth, $lt: thisMonth } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ isAdmin: false }),
      Order.countDocuments({ status: 'pending' }),
      Product.countDocuments({ stock: { $lt: 10 }, isActive: true })
    ]);

    const monthGrowth = lastMonthRev[0]?.total ? (((monthRev[0]?.total || 0) - lastMonthRev[0].total) / lastMonthRev[0].total * 100).toFixed(1) : 0;

    res.json({
      totalRevenue: totalRev[0]?.total || 0,
      todayRevenue: todayRev[0]?.total || 0,
      monthRevenue: monthRev[0]?.total || 0,
      monthGrowth,
      totalOrders, todayOrders,
      totalCustomers: customers,
      pendingOrders: pending,
      lowStockProducts: lowStock
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20, search } = req.query;
  const query = {};
  if (status && status !== 'all') query.status = status;
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
    ];
  }
  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(+limit)
    .skip((+page - 1) * +limit);
  const total = await Order.countDocuments(query);
  res.json({ orders, total, totalPages: Math.ceil(total / limit) });
};

exports.getOrderDetail = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json(order);
};

exports.updateOrderStatus = async (req, res) => {
  const { status, trackingNumber, note } = req.body;
  const order = await Order.findById(req.params.id).populate('user');
  if (!order) return res.status(404).json({ message: 'Không tìm thấy' });
  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') { order.isDelivered = true; order.deliveredAt = new Date(); }
  if (status === 'cancelled') { order.isDelivered = false; }
  order.statusHistory.push({ status, updatedAt: new Date(), updatedBy: 'admin', note });
  await order.save();
  if (order.user) {
    await Notification.create({
      user: order.user._id,
      type: 'order',
      title: 'Cập nhật đơn hàng',
      message: `Đơn hàng #${order.orderNumber} đã chuyển sang: ${status}`,
      link: `/orders/${order._id}`
    });
  }
  res.json(order);
};
