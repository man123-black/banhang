const Order = require('../models/Order');
const Analytics = require('../models/Analytics');

exports.getOverview = async (req, res) => {
  try {
    const [revenue, topProducts, ordersByStatus] = await Promise.all([
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.product', sold: { $sum: '$items.qty' }, revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } },
        { $sort: { sold: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } }
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    ]);
    res.json({
      revenue: revenue[0] || { total: 0, count: 0 },
      topProducts,
      ordersByStatus
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getRevenueByDate = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const format = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';
    const data = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalPrice' }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.trackEvent = async (req, res) => {
  try {
    const { type, product, category, searchQuery, value, sessionId } = req.body;
    await Analytics.create({
      type, product, category, searchQuery, value, sessionId,
      user: req.user?._id, ip: req.ip, userAgent: req.get('user-agent')
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
