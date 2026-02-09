// Product Categories
export const PRODUCT_CATEGORIES = [
  { id: 'audio', label: 'Audio', icon: 'headphones' },
  { id: 'laptops', label: 'Laptops', icon: 'laptop' },
  { id: 'phones', label: 'Phones', icon: 'smartphone' },
  { id: 'accessories', label: 'Accessories', icon: 'zap' },
  { id: 'cameras', label: 'Cameras', icon: 'camera' },
  { id: 'wearables', label: 'Wearables', icon: 'watch' },
] as const

// Product Brands
export const PRODUCT_BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'Canon',
  'Nikon',
  'HP',
  'Dell',
  'Lenovo',
  'Microsoft',
  'Google',
  'OnePlus',
  'Xiaomi',
] as const

// Order Statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const ORDER_STATUS_LABELS = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
} as const

// Payment Methods
export const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
} as const

export const PAYMENT_METHOD_LABELS = {
  mpesa: { label: 'M-Pesa', icon: 'phone' },
  card: { label: 'Credit Card', icon: 'credit-card' },
  bank_transfer: { label: 'Bank Transfer', icon: 'bank' },
} as const

// Membership Tiers
export const MEMBERSHIP_TIERS = {
  STANDARD: 'standard',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const

// Shipping Options
export const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard (3-5 days)', price: 0, days: '3-5' },
  { id: 'express', label: 'Express (1-2 days)', price: 200, days: '1-2' },
  { id: 'overnight', label: 'Overnight', price: 500, days: '1' },
] as const

// Tax Rate (16%)
export const TAX_RATE = 0.16

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const ADMIN_PAGE_SIZE = 50

// Price Ranges for Filters
export const PRICE_RANGES = [
  { id: '0-10k', label: 'KSh 0 - 10,000', min: 0, max: 10000 },
  { id: '10k-50k', label: 'KSh 10,000 - 50,000', min: 10000, max: 50000 },
  { id: '50k-100k', label: 'KSh 50,000 - 100,000', min: 50000, max: 100000 },
  { id: '100k+', label: 'KSh 100,000+', min: 100000, max: Infinity },
] as const

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy'
export const DATETIME_FORMAT = 'MMM dd, yyyy hh:mm a'

// Validation Constants
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 128
export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 30

// Review Ratings
export const RATING_OPTIONS = [
  { value: 5, label: '5 Stars - Excellent' },
  { value: 4, label: '4 Stars - Good' },
  { value: 3, label: '3 Stars - Average' },
  { value: 2, label: '2 Stars - Poor' },
  { value: 1, label: '1 Star - Terrible' },
] as const

// Routes
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  PRODUCT: (slug: string) => `/product/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  TRACK_ORDER: '/track-order',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_ADDRESSES: '/dashboard/addresses',
  DASHBOARD_SAVED_ITEMS: '/dashboard/saved-items',
  DASHBOARD_PAYMENT: '/dashboard/payment',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ADD_PRODUCT: '/admin/products/new',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_ANALYTICS: '/admin/analytics',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  NETWORK_ERROR: 'Network error. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED: 'Product added to cart',
  PRODUCT_REMOVED: 'Product removed from cart',
  ORDER_PLACED: 'Order placed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  ADDRESS_SAVED: 'Address saved successfully',
} as const
