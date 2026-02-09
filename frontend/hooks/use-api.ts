'use client';

import { useState, useEffect, useCallback } from 'react'

interface UseApiOptions<T> {
  skip?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useApi<T>(
    url: string | null,
    options: UseApiOptions<T> = {},
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const { skip = false, onSuccess, onError } = options

  const fetchData = useCallback(async () => {
    if (!url || skip) {
      setState({ data: null, loading: false, error: null })
      return
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      const data = result.data || result

      setState({ data, loading: false, error: null })
      onSuccess?.(data)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
      onError?.(err)
    }
  }, [url, skip, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

export function useApiMutation<T>(
    url: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
    options: UseApiOptions<T> = {},
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const { onSuccess, onError } = options

  const execute = useCallback(
      async (payload?: unknown) => {
        try {
          setState({ data: null, loading: true, error: null })

          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: payload ? JSON.stringify(payload) : undefined,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error?.message || `API error: ${response.status}`)
          }

          const result = await response.json()
          const data = result.data || result

          setState({ data, loading: false, error: null })
          onSuccess?.(data)
          return data
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Unknown error')
          setState({ data: null, loading: false, error: err })
          onError?.(err)
          throw err
        }
      },
      [url, method, onSuccess, onError],
  )

  return {
    ...state,
    execute,
  }
}