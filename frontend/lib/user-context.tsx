"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { apiClient } from '@/lib/api-client'

interface UserContextType {
  user: User | null
  orders: any[]
  isLoading: boolean
  login: (username: string, password: string) => Promise<User>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async () => {
    try {
      // If no token, don't even try
      if (!localStorage.getItem('accessToken')) {
        return null
      }

      const userData = await apiClient.getProfile()
      setUser(userData)

      try {
        const orderData = await apiClient.getOrders()
        setOrders(Array.isArray(orderData) ? orderData : [])
      } catch (e) {
        console.warn("Could not fetch orders")
      }

      return userData
    } catch (error) {
      // Silent fail for auth check - usually means token expired
      // console.warn("Session expired or invalid")
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      return null
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchUserData()
      setIsLoading(false)
    }
    initializeAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login(username, password)
      localStorage.setItem('accessToken', response.access)
      localStorage.setItem('refreshToken', response.refresh)

      const userData = await fetchUserData()
      if (!userData) throw new Error("Failed to load profile")
      return userData
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      await apiClient.register({ username, email, password })
      await login(username, password)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
    setOrders([])
    window.location.href = '/'
  }

  return (
      <UserContext.Provider value={{ user, orders, isLoading, login, register, logout }}>
        {children}
      </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}