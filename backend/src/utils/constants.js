exports.ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

exports.PAYMENT_METHODS = ['COD', 'VNPAY', 'MOMO', 'BANKING'];

exports.SHIPPING = {
  FREE_THRESHOLD: 500000,
  DEFAULT_FEE: 30000
};

exports.PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};
