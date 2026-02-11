import axios, { InternalAxiosRequestConfig } from 'axios'
import { Product, Category, OrderPayload, LoginCredentials, RegisterData } from '@/lib/types'

// 1. Setup Axios Instance
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// 2. Add Interceptor (Safe Version)
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken')
            if (token) {
                if (!config.headers) {
                    config.headers = {} as any
                }
                (config.headers as any)['Authorization'] = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 3. API Methods

export const getProducts = async (params?: { category?: string; search?: string }): Promise<Product[]> => {
    try {
        const response = await api.get('/products/', { params })
        return response.data
    } catch (error) {
        console.error('Error fetching products:', error)
        return []
    }
}

export const getProduct = async (slug: string): Promise<Product | null> => {
    try {
        const response = await api.get(`/products/${slug}/`)
        return response.data
    } catch (error) {
        console.error(`Error fetching product ${slug}:`, error)
        return null
    }
}

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/categories/')
        return response.data
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export const getOrders = async (): Promise<any[]> => {
    try {
        // Axios interceptor automatically adds the token
        const response = await api.get('/orders/')
        return response.data
    } catch (error) {
        console.error('Error fetching orders:', error)
        return []
    }
}

export const createOrder = async (orderData: OrderPayload) => {
    const response = await api.post('/orders/', orderData)
    return response.data
}

export const loginUser = async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/token/', credentials)
    return response.data
}

export const registerUser = async (userData: RegisterData) => {
    const response = await api.post('/auth/register/', userData)
    return response.data
}

export default api