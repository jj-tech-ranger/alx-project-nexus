export interface Category {
  id: string | number
  name: string
  slug: string
  image?: string
}

export interface User {
  id: string | number
  email: string
  username: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar?: string
  membershipTier?: 'standard' | 'gold' | 'platinum'
  walletBalance?: number
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

export interface Product {
  id: string | number
  name: string
  slug: string
  description: string
  price: number
  discount_price?: number
  category: Category | string
  brand?: string
  sku?: string
  stock: number
  image: string
  is_featured: boolean
  rating?: number
  reviewCount?: number
  reviews?: Review[]
  specs?: Record<string, string>
  created_at: string
  updated_at?: string
}

export interface CartItem {
  id: string | number
  productId?: string | number
  title: string
  price: number
  image: string
  quantity: number
  slug: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string | number
  product: string | number
  product_name: string
  product_image: string
  quantity: number
  price: number
}

export interface Order {
  id: string | number
  user: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: string
  phone_number: string
  payment_method: string
  items: OrderItem[]
  created_at: string
  updated_at?: string
}

export interface Address {
  id: string | number
  street: string
  city: string
  phone: string
  is_default: boolean
}

export interface Review {
  id: string | number
  user_name?: string
  rating: number
  comment: string
  created_at: string
  product?: string | number
}

export interface DashboardStats {
  revenue: number
  totalOrders: number
  totalProducts: number
  activeOrders: number
  lowStock: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
  }
  meta?: {
    timestamp: string
    version: string
  }
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}