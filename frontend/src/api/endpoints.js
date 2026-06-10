export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT: '/auth/forgot-password'
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    FEATURED: '/products/featured'
  },
  ORDERS: {
    CREATE: '/orders',
    MY: '/orders/my',
    DETAIL: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`
  },
  CATEGORIES: { LIST: '/categories' },
  REVIEWS: { BY_PRODUCT: (id) => `/reviews/product/${id}`, CREATE: '/reviews' },
  COUPONS: { VALIDATE: '/coupons/validate' },
  CART: { GET: '/cart', ADD: '/cart/add', UPDATE: '/cart/update', REMOVE: '/cart/remove' },
  NOTIFICATIONS: { LIST: '/notifications', READ: '/notifications/read' },
  BANNERS: { LIST: '/banners' },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ORDERS: '/admin/orders',
    ORDER_DETAIL: (id) => `/admin/orders/${id}`,
    ORDER_STATUS: (id) => `/admin/orders/${id}/status`
  },
  ANALYTICS: { OVERVIEW: '/analytics/overview', REVENUE: '/analytics/revenue', TRACK: '/analytics/track' },
  PAYMENT: { VNPAY: '/payment/vnpay' },
  UPLOAD: { IMAGE: '/upload/image' }
};
