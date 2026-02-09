'use client'

import { useState, useCallback } from 'react'

/**
 * Toast notification type variants
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

/**
 * Toast notification object
 * @property id - Unique identifier for the toast
 * @property message - Main notification message (e.g., "Added to Cart")
 * @property variant - Type of notification affecting styling and behavior
 * @property duration - How long to display in milliseconds (default 3000)
 * @property action - Optional callback button on the toast
 */
export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Custom hook for managing toast notifications throughout the app
 * Provides methods to show notifications with automatic cleanup
 *
 * @returns Object with showToast, removeToast, and clearAllToasts methods
 *
 * @example
 * ```tsx
 * const { showToast } = useToastNotifications()
 * 
 * const handleAddToCart = () => {
 *   showToast({
 *     message: 'Added to cart successfully',
 *     variant: 'success'
 *   })
 * }
 * ```
 */
export function useToastNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([])

  /**
   * Display a toast notification
   * Automatically removes after duration expires
   *
   * @param message - Notification message text
   * @param variant - Type of toast (success, error, warning, info)
   * @param duration - Time to display in ms (default 3000)
   * @param action - Optional action button
   */
  const showToast = useCallback(
    ({
      message,
      variant = 'info',
      duration = 3000,
      action,
    }: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random()}`

      setToasts(prev => [...prev, { id, message, variant, duration, action }])

      // Auto-remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    []
  )

  /**
   * Remove a specific toast by ID
   * @param id - Toast ID to remove
   */
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  /**
   * Remove all toasts from the queue
   */
  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return { toasts, showToast, removeToast, clearAllToasts }
}

/**
 * Preset toast messages for common app events
 * Use these to maintain consistency across the app
 */
export const toastMessages = {
  // Cart notifications
  addedToCart: 'Added to cart',
  removedFromCart: 'Removed from cart',
  cartCleared: 'Cart cleared',
  cartUpdated: 'Cart updated',

  // Authentication
  loginSuccess: 'Login successful',
  loginError: 'Login failed. Please try again',
  logoutSuccess: 'Logged out successfully',
  registerSuccess: 'Account created successfully',
  registerError: 'Registration failed. Please try again',

  // Order notifications
  orderPlaced: 'Order placed successfully',
  orderError: 'Failed to place order',
  orderCancelled: 'Order cancelled',
  orderShipped: 'Your order has been shipped',
  orderDelivered: 'Order delivered',

  // Form notifications
  formSubmitted: 'Changes saved successfully',
  formError: 'Please fill in all required fields',
  validationError: 'Please check the highlighted fields',

  // General
  success: 'Operation completed successfully',
  error: 'Something went wrong. Please try again',
  loading: 'Loading...',
  networkError: 'Network error. Please check your connection',
  copiedToClipboard: 'Copied to clipboard',
}
