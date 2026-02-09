import { Product, Category, User } from './types'

const API_URL = 'http://127.0.0.1:8000'

export async function loginUser(credentials: any) {
    try {
        const res = await fetch(`${API_URL}/auth/jwt/create/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        })

        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.detail || 'Login failed')
        }

        return res.json()
    } catch (error) {
        throw error
    }
}

export async function registerUser(userData: any) {
    try {
        const res = await fetch(`${API_URL}/auth/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })

        if (!res.ok) {
            const errorData = await res.json()
            const firstErrorKey = Object.keys(errorData)[0]
            const firstErrorMsg = Array.isArray(errorData[firstErrorKey])
                ? errorData[firstErrorKey][0]
                : errorData[firstErrorKey]
            throw new Error(firstErrorMsg || 'Registration failed')
        }

        return res.json()
    } catch (error) {
        throw error
    }
}

export async function getCurrentUser(token: string): Promise<User | null> {
    try {
        const res = await fetch(`${API_URL}/auth/users/me/`, {
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) return null
        return res.json()
    } catch (error) {
        return null
    }
}

export async function createOrder(token: string, orderData: any) {
    try {
        const res = await fetch(`${API_URL}/api/orders/`, {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })

        if (!res.ok) {
            const errorData = await res.json()
            console.error('Order Error:', errorData)
            throw new Error('Failed to create order')
        }

        return res.json()
    } catch (error) {
        throw error
    }
}

export async function getOrders(token: string): Promise<any[]> {
    try {
        const res = await fetch(`${API_URL}/api/orders/`, {
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) return []
        const data = await res.json()
        return Array.isArray(data) ? data : (data.results || [])
    } catch (error) {
        return []
    }
}

export async function getProducts(searchParams?: string): Promise<Product[]> {
    try {
        const query = searchParams ? `?${searchParams}` : ''
        const res = await fetch(`${API_URL}/api/products/${query}`, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!res.ok) throw new Error('Failed to fetch products')

        const data = await res.json()
        if (data.results && Array.isArray(data.results)) return data.results
        if (Array.isArray(data)) return data
        return []
    } catch (error) {
        return []
    }
}

export async function getProduct(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/api/products/`, { cache: 'no-store' })
        if (!res.ok) return null

        const data = await res.json()
        const products = data.results || data

        if (Array.isArray(products)) {
            const product = products.find((p: any) => p.slug === slug || p.id.toString() === slug)
            return product || null
        }
        return null
    } catch (error) {
        return null
    }
}

export async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/api/categories/`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch categories')

        const data = await res.json()
        if (data.results && Array.isArray(data.results)) return data.results
        if (Array.isArray(data)) return data
        return []
    } catch (error) {
        return []
    }
}