'use client'

import { useEffect, useState } from 'react'
import { Users, ShoppingBag, DollarSign, Package, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api-client'
import { useUser } from '@/lib/user-context'

export default function AdminDashboard() {
  const { user } = useUser()
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_customers: 0,
    recent_orders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only fetch if user is logged in (prevents 401 error)
    if (!user) return

    async function loadStats() {
      try {
        const data = await apiClient.request<any>('/api/admin/analytics/')
        setStats(data)
      } catch (error) {
        console.error("Failed to load admin stats", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [user])

  if (loading) return <div className="p-8">Loading Dashboard...</div>

  return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh {stats.total_revenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_orders}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_customers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recent_orders.map((order: any) => (
                <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      #{order.id}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize 
                  ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                  {order.status}
                </span>
                    <span className="font-bold text-gray-900">KSh {Number(order.total_amount).toLocaleString()}</span>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}