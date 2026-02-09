'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api-client'
import { Loader2, Package, Search, CheckCircle, Clock } from 'lucide-react'
import { Order } from '@/lib/types'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      // Assuming you might need logged in permissions depending on backend setup,
      // but if the user has the ID, they can try to fetch it.
      // If your backend blocks this for others' orders, this will only work for your own orders.
      const data = await apiClient.getOrder(orderId)
      setOrder(data)
    } catch (err) {
      setError('Order not found or access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1E3A8A]">Track Your Order</h1>
            <p className="text-gray-500 mt-2">Enter your Order ID to check its status.</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Order ID (e.g., 12)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pl-10"
                />
              </div>
              <Button type="submit" className="w-full bg-[#1E3A8A]" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Track Order
              </Button>
            </form>
          </Card>

          {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center text-sm">
                {error}
              </div>
          )}

          {order && (
              <Card className="p-6 space-y-4 border-t-4 border-t-[#8B5CF6]">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Order #{order.id}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize
                ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                {order.status}
              </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-900">Items:</p>
                  {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span className="font-medium">KSh {item.price}</span>
                      </div>
                  ))}
                </div>

                <div className="pt-4 border-t flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#1E3A8A]">KSh {Number(order.total_amount).toLocaleString()}</span>
                </div>
              </Card>
          )}
        </div>
      </div>
  )
}