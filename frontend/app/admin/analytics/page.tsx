'use client'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const salesData = [
  { month: 'Jan', sales: 120000, orders: 45 },
  { month: 'Feb', sales: 150000, orders: 62 },
  { month: 'Mar', sales: 130000, orders: 55 },
  { month: 'Apr', sales: 220000, orders: 89 },
  { month: 'May', sales: 180000, orders: 71 },
  { month: 'Jun', sales: 250000, orders: 102 },
]

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Laptops', value: 28 },
  { name: 'Phones', value: 22 },
  { name: 'Accessories', value: 15 },
]

const COLORS = ['#8B5CF6', '#1E3A8A', '#EC4899', '#F59E0B']

export default function Analytics() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-8">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => value ? `KSh ${Number(value).toLocaleString()}` : 'KSh 0'} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Orders by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Key Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">Total Revenue (6 months)</span>
              <span className="text-2xl font-bold text-gray-900">KSh 1.03M</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">Average Order Value</span>
              <span className="text-2xl font-bold text-gray-900">KSh 14,500</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="text-2xl font-bold text-green-600">3.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Retention</span>
              <span className="text-2xl font-bold text-green-600">67%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
