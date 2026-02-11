import { Product, Order, User, Category, Address } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

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
        headers.Authorization = `Bearer ${token}`
      }
    }
    return headers
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    // Ensure endpoint doesn't start with / if we are appending to base
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    // intelligently add trailing slash only if no query params exist in the string yet
    let path = cleanEndpoint
    if (!path.includes('?') && !path.endsWith('/')) {
      path = `${path}/`
    }

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

      // Handle non-JSON responses (like 404/500 HTML pages)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        if (!response.ok) throw new Error(`Server Error: ${response.status}`)
        // If it's 200 but not JSON? Rare, but handle gracefully
        return {} as T
      }

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
    return this.request('/api/auth/token', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async register(userData: Partial<User>): Promise<User> {
    return this.request('/api/auth/register', {
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
    return this.request('/api/auth/users/me')
  }

  async getCategories(): Promise<Category[]> {
    return this.request('/api/categories')
  }

  async getProducts(params?: Record<string, string | number | boolean>): Promise<Product[]> {
    return this.request('/api/products', { params })
  }

  async getProduct(slug: string): Promise<Product> {
    return this.request(`/api/products/${slug}`)
  }

  async getOrders(params?: Record<string, string | number | boolean>): Promise<Order[]> {
    return this.request('/api/orders', { params })
  }

  async getOrder(id: string | number): Promise<Order> {
    return this.request(`/api/orders/${id}`)
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
    return this.request(`/api/addresses/${id}`, { method: 'DELETE' })
  }

  async getSavedItems(): Promise<any[]> {
    return this.request('/api/saved-items')
  }

  async addToWishlist(productId: string | number): Promise<any> {
    return this.request('/api/saved-items/', {
      method: 'POST',
      body: JSON.stringify({ product: productId })
    })
  }

  async removeFromWishlist(id: string | number): Promise<void> {
    return this.request(`/api/saved-items/${id}`, { method: 'DELETE' })
  }

  // FIX: Pass product ID as a param, not part of the string
  async getReviews(productId: string | number): Promise<any[]> {
    return this.request('/api/reviews', {
      params: { product: productId }
    })
  }

  async getAllReviews(): Promise<any[]> {
    return this.request('/api/reviews')
  }

  async createReview(productId: string | number, rating: number, comment: string): Promise<any> {
    return this.request('/api/reviews/', {
      method: 'POST',
      body: JSON.stringify({ product: productId, rating, comment })
    })
  }

  async getPurchasedProducts(): Promise<Product[]> {
    return this.request('/api/purchased-products')
  }
}

export const apiClient = new ApiClient()