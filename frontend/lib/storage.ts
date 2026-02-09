/**
 * Safe localStorage wrapper with type safety and SSR compatibility
 */

class StorageManager {
  private isClient = typeof window !== 'undefined'

  private getStorage() {
    if (!this.isClient) return null
    return window.localStorage
  }

  set<T>(key: string, value: T): boolean {
    try {
      const storage = this.getStorage()
      if (!storage) return false
      storage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`[Storage] Error setting ${key}:`, error)
      return false
    }
  }

  get<T>(key: string, fallback?: T): T | null {
    try {
      const storage = this.getStorage()
      if (!storage) return fallback || null

      const item = storage.getItem(key)
      if (item === null) return fallback || null

      return JSON.parse(item) as T
    } catch (error) {
      console.error(`[Storage] Error getting ${key}:`, error)
      return fallback || null
    }
  }

  remove(key: string): boolean {
    try {
      const storage = this.getStorage()
      if (!storage) return false
      storage.removeItem(key)
      return true
    } catch (error) {
      console.error(`[Storage] Error removing ${key}:`, error)
      return false
    }
  }

  clear(): boolean {
    try {
      const storage = this.getStorage()
      if (!storage) return false
      storage.clear()
      return true
    } catch (error) {
      console.error('[Storage] Error clearing storage:', error)
      return false
    }
  }

  // Auth-specific helpers
  setAuthToken(token: string): boolean {
    return this.set('authToken', token)
  }

  getAuthToken(): string | null {
    return this.get<string>('authToken')
  }

  clearAuthToken(): boolean {
    return this.remove('authToken')
  }

  setRefreshToken(token: string): boolean {
    return this.set('refreshToken', token)
  }

  getRefreshToken(): string | null {
    return this.get<string>('refreshToken')
  }

  clearRefreshToken(): boolean {
    return this.remove('refreshToken')
  }

  setUser(user: any): boolean {
    return this.set('user', user)
  }

  getUser<T = any>(): T | null {
    return this.get<T>('user')
  }

  clearUser(): boolean {
    return this.remove('user')
  }

  clearAuth(): void {
    this.clearAuthToken()
    this.clearRefreshToken()
    this.clearUser()
  }

  // Cart-specific helpers
  setCart(cart: any): boolean {
    return this.set('cart', cart)
  }

  getCart<T = any>(): T | null {
    return this.get<T>('cart')
  }

  clearCart(): boolean {
    return this.remove('cart')
  }

  // Preferences
  setTheme(theme: 'light' | 'dark'): boolean {
    return this.set('theme', theme)
  }

  getTheme(): 'light' | 'dark' | null {
    return this.get<'light' | 'dark'>('theme')
  }

  setLanguage(language: string): boolean {
    return this.set('language', language)
  }

  getLanguage(): string | null {
    return this.get<string>('language')
  }
}

export const storage = new StorageManager()
