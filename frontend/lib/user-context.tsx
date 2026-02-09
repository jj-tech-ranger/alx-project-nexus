'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from './api'
import { User } from './types'

interface UserContextType {
  user: User | null
  isLoading: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const userData = await getCurrentUser(token)
      if (userData) {
        setUser(userData)
      } else {
        // Token invalid or expired
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
      }
    } catch (error) {
      console.error('Auth Check Error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    router.push('/login')
    router.refresh()
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  return (
      <UserContext.Provider value={{ user, isLoading, logout, refreshUser }}>
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