'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Order } from '@/lib/types'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Note: Admin endpoint should be used here in reality
    apiClient.request<Order[]>('/api/admin/orders/').then(setOrders)
  }, [])

  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.user}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">KSh {Number(order.total_amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                    {order.status}
                  </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2"/> View</Button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  )
}