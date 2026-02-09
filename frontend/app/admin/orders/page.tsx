'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Eye } from 'lucide-react'

interface OrderItem {
  id: string
  customer: string
  date: string
  total: string
  payment: string
  status: string
}

const orders: OrderItem[] = [
  { id: '#ORD-7821', customer: 'Sarah Wanjiku', date: 'Oct 24, 2024', total: 'KSh 15,400', payment: 'Paid', status: 'Pending' },
  { id: '#ORD-7820', customer: 'James Miller', date: 'Oct 24, 2024', total: 'KSh 45,000', payment: 'Paid', status: 'Ready to Ship' },
  { id: '#ORD-7819', customer: 'Priya Patel', date: 'Oct 23, 2024', total: 'KSh 8,500', payment: 'Unpaid', status: 'Processing' },
  { id: '#ORD-7818', customer: 'Kevin Otieno', date: 'Oct 23, 2024', total: 'KSh 120,000', payment: 'Paid', status: 'Delivered' },
  { id: '#ORD-7817', customer: 'Maria Garcia', date: 'Oct 22, 2024', total: 'KSh 22,900', payment: 'Paid', status: 'Delivered' },
]

type TabId = 'all' | 'pending' | 'ready' | 'delivered' | 'returns'

interface Tab {
  id: TabId
  label: string
  count: string
}

export default function AdminOrders() {
  const [selectedTab, setSelectedTab] = useState<TabId>('all')

  const tabs: Tab[] = [
    { id: 'all', label: 'All Orders', count: '128' },
    { id: 'pending', label: 'Pending', count: '12' },
    { id: 'ready', label: 'Ready to Ship', count: '8' },
    { id: 'delivered', label: 'Delivered', count: '98' },
    { id: 'returns', label: 'Returns', count: '2' },
  ]

  return (
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A8A]">Orders</h1>
            <p className="text-gray-500 mt-2">Manage and track customer orders.</p>
          </div>
          <Button className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg">
            <Download size={18} />
            Export CSV
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map(tab => (
              <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                      selectedTab === tab.id
                          ? 'border-[#8B5CF6] text-[#8B5CF6]'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
              <tr className="bg-[#8B5CF6] text-white">
                <th className="px-6 py-4 text-left font-semibold">ORDER ID</th>
                <th className="px-6 py-4 text-left font-semibold">CUSTOMER</th>
                <th className="px-6 py-4 text-left font-semibold">DATE</th>
                <th className="px-6 py-4 text-left font-semibold">TOTAL</th>
                <th className="px-6 py-4 text-left font-semibold">PAYMENT</th>
                <th className="px-6 py-4 text-left font-semibold">STATUS</th>
                <th className="px-6 py-4 text-left font-semibold">ACTION</th>
              </tr>
              </thead>
              <tbody>
              {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-blue-600">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">
                          {order.customer[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.customer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{order.total}</td>
                    <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        order.payment === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.payment}
                    </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                          className="text-sm font-semibold border border-gray-300 rounded-lg px-2 py-1 bg-white cursor-pointer hover:border-purple-400"
                          defaultValue={order.status}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready to Ship">Ready to Ship</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                        <Eye size={16} />
                        View Details
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
            Showing 1-5 of 128 orders
          </div>
        </div>
      </div>
  )
}