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

  CART:{
    GET_CART:'/cart',
    ADD_CART: '/cart/items',
    CART_GROUPED_BY_SHOP: '/cart/grouped-by-shop',
    CART_UPDATE_QUANTITY: (itemId: string) => `/cart/items/${itemId}`,
    CART_REMOVE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    CART_REFRESH: '/cart/refresh',
  },
  
  // Vendor
  VENDOR: {
    DASHBOARD: '/api/vendor/dashboard',
    PRODUCTS: '/api/vendor/products',
    ORDERS: '/api/vendor/orders',
    WITHDRAW: '/api/vendor/withdraw',
    CHOOSE_PLAN: '/shop/souscription/type/available',
    SHOP_TYPES: '/type'
  },
  BOUTIQUES: {
    SHOP_SOUSCRIPTION:  (shopId: string) => `/shop/user/subscriptions/${shopId}/subscribe`,
    SHOP_UNSOUSCRIPTION:  (shopId: string) => `/shop/user/subscriptions/${shopId}/unsubscribe`,
    SHOP_UNSOUSCRIPTION_VERIFICATION:  (shopId: string) => `/shop/user/subscriptions/${shopId}/me`,
  },
  // LOCALISATION
  LOCALISATION: {
    LOCALISATIONS_COUNTRIES: '/localisation/countries',
    COUNTRIES: '/localisation/countries',
    COUNTRY_BY_CODE: (code: string) => `/localisation/countries/${code}`,
    REGIONS_BY_COUNTRY: (countryCode: string) => `/localisation/countries/${countryCode}/regions`,
    REGION_BY_ID: (id: string) =>` /localisation/regions/${id}`,
    CITIES_BY_REGION: (regionId: string) => `/localisation/regions/${regionId}/cities`,
    CITIES_BY_COUNTRY: (countryCode: string) => `/localisation/countries/${countryCode}/cities`,
    CITY_BY_ID: (id: string) => `/localisation/cities/${id}`,
    CREATE_COUNTRY: '/localisation/countries',
    CREATE_REGION: '/localisation/regions',
    CREATE_CITY: '/localisation/cities',
    DELETE_COUNTRY: (id: string) => `/localisation/countries/${id}`,
    DELETE_REGION: (id: string) => `/localisation/regions/${id}`,
    DELETE_CITY: (id: string) => `/localisation/cities/${id}`,
  },
  // SETTINGS
  SETTING:{
    PHONE_OTP: '/user-settings/phone/sent-otp',
    PHONE_VERIFY_OTP: '/user-settings/phone',
  },
  // USER SETTINGS
  USER_SETTING:{
    SHIPPING_ADDRESS: '/user-settings/shipping-addresses',
  }
};