"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Product, CartItem } from '@/lib/types'
import { toast } from '@/components/ui/use-toast'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  addToCart: (product: Product, quantity?: number) => void // Helper for Product Pages
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart", e)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === newItem.id)
      if (existingItem) {
        return prevItems.map((i) =>
            i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        )
      }
      return [...prevItems, newItem]
    })
  }

  // Helper to adapt Product -> CartItem
  const addToCart = (product: Product, quantity = 1) => {
    addItem({
      id: product.id,
      title: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: quantity,
      slug: product.slug
    })
  }

  const removeItem = (id: string | number) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id))
    toast({ title: "Item removed from cart" })
  }

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    setItems((prevItems) =>
        prevItems.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
  }

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
      <CartContext.Provider
          value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            addToCart
          }}
      >
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