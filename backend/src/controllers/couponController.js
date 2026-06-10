const Coupon = require('../models/Coupon');

exports.validate = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Mã không tồn tại' });
    if (coupon.startDate && coupon.startDate > new Date()) return res.status(400).json({ message: 'Mã chưa có hiệu lực' });
    if (coupon.endDate && coupon.endDate < new Date()) return res.status(400).json({ message: 'Mã đã hết hạn' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Mã đã hết lượt sử dụng' });
    }
    if (coupon.minOrder > orderTotal) {
      return res.status(400).json({ message: `Đơn hàng tối thiểu ${coupon.minOrder.toLocaleString()}đ` });
    }
    let discount = coupon.type === 'percentage' ? orderTotal * coupon.value / 100 : coupon.value;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    res.json({ valid: true, discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, description: coupon.description } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAll = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

exports.create = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
};

exports.update = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(coupon);
};

exports.remove = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Đã xóa' });
};
