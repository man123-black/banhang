export const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const formatNumber = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);
