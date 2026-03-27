export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/signup',
    SEND_OTP: '/send-otp',
    VERIFY_OTP: '/verify-otp',
    RESET_PASSWORD: '/reset-password',
    USER_INFOS: '/user-infos',
    REFRESH: '/api/auth/refresh',
    LOGIN_GOOGLE: '/login/oauth2-client',
    UPDATE_PROFILE: '/update-profile',
  },
  // Caroussel
  CAROUSSEL: {
    FEATURE_ZONE: (zone: string) => `/featured/zone/${zone}`,
  },
  
  // Products
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    SCORED: '/api/products/scored',
    BY_CATEGORY: (cat: string) => `/api/products/category/${cat}`,
    BY_SHOP: (shopId: string) => `/api/shops/${shopId}/products`,
  },
  
  // Orders
  ORDERS: {
    CREATE: '/api/orders',
    LIST: '/api/orders/user',
    DETAIL: (id: string) => `/api/orders/${id}`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
  },
  
  // Vendor
  VENDOR: {
    DASHBOARD: '/api/vendor/dashboard',
    PRODUCTS: '/api/vendor/products',
    ORDERS: '/api/vendor/orders',
    WITHDRAW: '/api/vendor/withdraw',
  },
};