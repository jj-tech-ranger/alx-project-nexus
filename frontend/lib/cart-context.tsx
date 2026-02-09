'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export interface CartItem {
  id: string
  productId?: string
  title: string
  price: number
  image: string
  quantity: number
  slug?: string
  sku?: string
  category?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const STORAGE_KEY = 'novamart_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setItems(Array.isArray(parsedCart) ? parsedCart : [])
      }
    } catch (error) {
      console.error('[v0] Error loading cart from localStorage:', error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('[v0] Error saving cart to localStorage:', error)
      }
    }
  }, [items, isLoading])

  const addItem = useCallback((newItem: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id)
      if (existingItem) {
        return prevItems.map(item =>
            item.id === newItem.id
                ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                : item
        )
      }
      return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(prevItems =>
        prevItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isLoading,
  }

  return (
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}