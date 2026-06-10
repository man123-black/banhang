export const truncate = (str, len = 50) => str?.length > len ? str.substring(0, len) + '...' : str;

export const calculateDiscount = (price, salePrice) => {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) => /^(0|\+84)[0-9]{9,10}$/.test(phone);
