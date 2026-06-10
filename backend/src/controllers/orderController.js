const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, note } = req.body;
    let itemsPrice = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.qty) {
        return res.status(400).json({ message: `${product?.name || 'Sản phẩm'} không đủ hàng` });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        qty: item.qty,
        image: product.images?.[0]
      });
      itemsPrice += (product.salePrice || product.price) * item.qty;
      product.stock -= item.qty;
      product.sold += item.qty;
      await product.save();
    }
    const shippingPrice = itemsPrice > 500000 ? 0 : 30000;
    let totalPrice = itemsPrice + shippingPrice;
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      note,
      statusHistory: [{ status: 'pending', updatedAt: new Date(), updatedBy: 'system' }]
    });
    const io = req.app.get('io');
    if (io) io.to('admins').emit('new-order', order);
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json(order);
};

exports.cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Không có quyền' });
  }
  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({ message: 'Không thể hủy đơn hàng này' });
  }
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty, sold: -item.qty } });
  }
  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', updatedAt: new Date(), updatedBy: req.user._id, note: req.body.reason });
  await order.save();
  res.json(order);
};
