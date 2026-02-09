'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { day: 'Q1', revenue: 120000 },
  { day: 'Q2', revenue: 150000 },
  { day: 'Q3', revenue: 130000 },
  { day: 'Q4', revenue: 220000 },
]

const recentActivity = [
  { id: 1, event: 'Order #NM-7821 Placed', user: 'Sarah W.', time: '2 hours ago', type: 'order' },
  { id: 2, event: 'New User Registered', user: 'Jane Doe', time: '4 hours ago', type: 'user' },
  { id: 3, event: 'Stock Alert: MacBook Air M2', level: 'Low', time: '6 hours ago', type: 'alert' },
  { id: 4, event: 'Order #NM-7820 Delivered', user: 'James M.', time: '8 hours ago', type: 'delivery' },
]

type Period = 'weekly' | 'monthly' | 'yearly'

export default function AdminDashboard() {
  const [period, setPeriod] = useState<Period>('monthly')

  return (
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A8A]">Overview</h1>
          <div className="text-sm text-gray-500">Oct 25, 2023</div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard label="Total Revenue" value="KSh 4.2M" change="+12.5% from last month" icon="📊" />
          <MetricCard label="Orders" value="1,245" change="+4.3% from last month" icon="📦" />
          <MetricCard label="Customers" value="8,504" change="+2.1% from last month" icon="👥" />
          <MetricCard label="Low Stock" value="12 Items" change="Requires attention" alert icon="⚠️" />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Over Time</h2>
            <div className="flex gap-2">
              {(['Weekly', 'Monthly', 'Yearly'] as const).map(label => (
                  <button
                      key={label}
                      onClick={() => setPeriod(label.toLowerCase() as Period)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          period === label.toLowerCase()
                              ? 'bg-[#8B5CF6] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {label}
                  </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `KSh ${Number(value).toLocaleString()}`} />
              <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 6 }}
                  activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-3 h-3 rounded-full mt-2 flex-shrink-0" style={{
                    backgroundColor: activity.type === 'alert' ? '#EF4444' : '#10B981'
                  }} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.event}</p>
                    <p className="text-sm text-gray-500">{activity.user || activity.level} • {activity.time}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}

interface MetricCardProps {
  label: string
  value: string | number
  change: string
  alert?: boolean
  icon: string
}

function MetricCard({ label, value, change, alert, icon }: MetricCardProps) {
  return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <p className={`text-xs mt-2 ${alert ? 'text-red-600' : 'text-green-600'}`}>
              {change}
            </p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
  )
}