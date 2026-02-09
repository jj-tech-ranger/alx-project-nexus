'use client'

import DashboardSidebar from '@/components/dashboard-sidebar'
import { useUser } from '@/lib/user-context'
import { getOrders } from '@/lib/api'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Order } from '@/lib/types'

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        const data = await getOrders(token)
        setOrders(data)
      }
    }
    if (user) fetchOrders()
  }, [user])

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E3A8A]" />
        </div>
    )
  }

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Please log in to view your dashboard</p>
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
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar />

          <main className="flex-1 p-8">
            <div className="bg-white rounded-3xl p-8 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <img
                    src={user.avatar || '/placeholder-user.jpg'}
                    alt={user.username}
                    className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Hello, {user.username}!</h1>
                  <p className="text-gray-600">It&apos;s good to see you again.</p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-full font-semibold bg-yellow-100 text-yellow-800">
                Gold Member
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-3xl p-6">
                <p className="text-gray-600 text-sm mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="bg-white rounded-3xl p-6">
                <p className="text-gray-600 text-sm mb-2">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-white rounded-3xl p-6">
                <p className="text-gray-600 text-sm mb-2">Wallet Balance</p>
                <p className="text-3xl font-bold text-gray-900">KSh 0.00</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                <Link href="/dashboard/orders" className="text-[#8B5CF6] hover:text-purple-700 font-semibold">
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="bg-[#8B5CF6] text-white">
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Action</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order: Order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">#{order.id}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">KSh {Number(order.total_amount).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <Link
                              href={`/dashboard/orders/${order.id}`}
                              className="text-[#8B5CF6] hover:text-purple-700 font-semibold"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}