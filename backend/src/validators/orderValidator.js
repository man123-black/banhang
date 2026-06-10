const { body } = require('express-validator');

exports.orderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
  body('items.*.productId').isMongoId(),
  body('items.*.qty').isInt({ min: 1 }),
  body('shippingAddress.fullName').notEmpty(),
  body('shippingAddress.phone').isMobilePhone('vi-VN'),
  body('shippingAddress.address').notEmpty(),
  body('shippingAddress.city').notEmpty()
];
