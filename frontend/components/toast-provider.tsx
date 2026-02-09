'use client'

import React, { createContext, useContext } from 'react'
import { useToastNotifications, type Toast, type ToastVariant } from '@/hooks/use-toast-notifications'

/**
 * Toast context for global notification management
 */
const ToastContext = createContext<ReturnType<typeof useToastNotifications> | undefined>(undefined)

/**
 * ToastProvider - Wraps the app to provide global toast notification functionality
 * Place this in your root layout to enable notifications throughout the app
 *
 * @example
 * ```tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ToastProvider>{children}</ToastProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastMethods = useToastNotifications()

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer toasts={toastMethods.toasts} onRemove={toastMethods.removeToast} />
    </ToastContext.Provider>
  )
}

/**
 * Hook to access toast functionality from anywhere in the app
 *
 * @returns Toast methods: showToast, removeToast, clearAllToasts
 * @throws Error if used outside ToastProvider
 *
 * @example
 * ```tsx
 * const { showToast } = useToast()
 * showToast({ message: 'Added to cart', variant: 'success' })
 * ```
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

/**
 * ToastContainer - Renders all active toast notifications
 * Positioned in the bottom-right corner of the screen
 */
function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[]
  onRemove: (id: string) => void
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

/**
 * Individual toast notification component
 */
function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: string) => void
}) {
  const bgColor: Record<string, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  }

  const icon: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ',
  }

  return (
    <div
      className={`${bgColor[toast.variant]} text-white px-4 py-3 rounded-lg shadow-lg pointer-events-auto animate-slideIn flex items-center justify-between gap-4`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{icon[toast.variant]}</span>
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <div className="flex items-center gap-2">
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick()
              onRemove(toast.id)
            }}
            className="text-xs font-semibold underline hover:opacity-80 transition-opacity"
          >
            {toast.action.label}
          </button>
        )}
        <button
          onClick={() => onRemove(toast.id)}
          className="text-lg hover:opacity-80 transition-opacity"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
