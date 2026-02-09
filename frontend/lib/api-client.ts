import { Product, Order, User, DashboardStats, Category, Address, Review } from './types'

const API_BASE_URL = 'http://127.0.0.1:8000'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        headers.Authorization = `JWT ${token}`
      }
    }
    return headers
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const path = endpoint.endsWith('/') ? endpoint : `${endpoint}/`
    const url = new URL(`${API_BASE_URL}${path}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return url.toString()
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...requestInit } = options
    const url = this.buildUrl(endpoint, params)

    try {
      const response = await fetch(url, {
        ...requestInit,
        headers: {
          ...this.getHeaders(),
          ...(requestInit.headers || {}),
        },
      })

      if (response.status === 204) return {} as T

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.detail || (data.error ? data.error.message : 'API request failed')
        throw new Error(errorMsg)
      }

      return data.results ? data.results : data
    } catch (error) {
      console.error('[API Error]', endpoint, error)
      throw error
    }
  }

  async login(username: string, password: string): Promise<{ access: string; refresh: string; user: User }> {
    return this.request('/auth/jwt/create', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async register(userData: Partial<User>): Promise<User> {
    return this.request('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  async getProfile(): Promise<User> {
    return this.request('/auth/users/me')
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request('/auth/users/me/', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    })
  }

  async getCategories(): Promise<Category[]> {
    return this.request('/api/categories')
  }

  async getProducts(params?: Record<string, string | number | boolean>): Promise<Product[]> {
    return this.request('/api/products', { params })
  }

  async getProduct(id: string | number): Promise<Product> {
    return this.request(`/api/products/${id}`)
  }

  async createProduct(productData: FormData): Promise<Product> {
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${API_BASE_URL}/api/products/`, {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${token}`
      },
      body: productData
    })
    if (!res.ok) throw new Error('Failed to create product')
    return res.json()
  }

  async deleteProduct(id: string | number): Promise<void> {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    })
  }

  async getOrders(params?: Record<string, string | number | boolean>): Promise<Order[]> {
    return this.request('/api/orders', { params })
  }

  async getOrder(id: string | number): Promise<Order> {
    return this.request(`/api/orders/${id}`)
  }

  async updateOrderStatus(orderId: string | number, status: string): Promise<Order> {
    return this.request(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  async getAddresses(): Promise<Address[]> {
    return this.request('/api/addresses')
  }

  async addAddress(addressData: Partial<Address>): Promise<Address> {
    return this.request('/api/addresses/', {
      method: 'POST',
      body: JSON.stringify(addressData)
    })
  }

  async deleteAddress(id: string | number): Promise<void> {
    return this.request(`/api/addresses/${id}/`, {
      method: 'DELETE'
    })
  }

  async createReview(reviewData: { product: string | number, rating: number, comment: string }): Promise<Review> {
    return this.request('/api/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    })
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [orders, products] = await Promise.all([
      this.getOrders(),
      this.getProducts()
    ])

    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + Number(order.total_amount), 0)
    const activeOrders = orders.filter((o: Order) => ['pending', 'processing'].includes(o.status)).length
    const lowStock = products.filter((p: Product) => p.stock < 10).length

    return {
      revenue: totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      activeOrders,
      lowStock
    }
  }
}

export const apiClient = new ApiClient()