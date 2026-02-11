'use client'

import { useUser } from '@/lib/user-context'
import { getOrders } from '@/lib/api'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Package } from 'lucide-react'
import { Order } from '@/lib/types'

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user) {
      getOrders().then((data) => setOrders(Array.isArray(data) ? data : []))
    }
  }, [user])

  if (isLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E3A8A]" />
        </div>
    )
  }

  if (!user) {
    return (
        <div className="flex h-96 items-center justify-center flex-col gap-4">
          <p className="text-gray-500">Please log in to view your dashboard</p>
          <Link href="/login" className="text-[#1E3A8A] underline">Go to Login</Link>
        </div>
    )
  }

  const recentOrders = orders.slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-700'
      case 'shipped': return 'bg-orange-100 text-orange-700'
      case 'delivered': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hello, {user.username}!</h1>
              <p className="text-gray-500">Welcome to your dashboard.</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full font-semibold bg-yellow-100 text-yellow-800 text-sm">
            Gold Member
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm mb-2">Saved Items</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm mb-2">Wallet Balance</p>
            <p className="text-3xl font-bold text-gray-900">KSh 0.00</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm font-medium text-[#1E3A8A] hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                  recentOrders.map((order: Order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(order.created_at || Date.now()).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">KSh {Number(order.total_amount).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/orders/${order.id}`} className="text-[#1E3A8A] hover:underline text-sm font-medium">
                            View
                          </Link>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p>No orders found yet.</p>
                      <Link href="/" className="text-[#1E3A8A] hover:underline mt-2 inline-block">Start Shopping</Link>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}