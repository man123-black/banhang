export const ORDER_STATUS = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-700' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
  refunded: { label: 'Hoàn tiền', color: 'bg-gray-100 text-gray-700' }
};

export const PAYMENT_METHODS = {
  COD: { label: 'Thanh toán khi nhận hàng', icon: '💵' },
  VNPAY: { label: 'VNPay', icon: '💳' },
  MOMO: { label: 'MoMo', icon: '📱' },
  BANKING: { label: 'Chuyển khoản', icon: '🏦' }
};
