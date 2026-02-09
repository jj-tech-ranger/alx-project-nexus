'use client'

import DashboardSidebar from '@/components/dashboard-sidebar'
import { useUser } from '@/lib/user-context'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function OrderHistoryPage() {
  const { orders } = useUser()
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-blue-600'
      case 'on-way':
        return 'text-orange-600'
      case 'delivered':
        return 'text-emerald-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Order History</h1>
            <p className="text-gray-600 mb-8">View and track your past purchases.</p>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl overflow-hidden">
                  {/* Header */}
                  <div
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order Placed</p>
                        <p className="font-semibold text-gray-900">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order ID</p>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total</p>
                        <p className="font-semibold text-gray-900">KSh {order.total.toLocaleString()}</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className={`font-semibold ${getStatusColor(order.status)}`}>
                            {order.status === 'delivered'
                              ? 'Delivered'
                              : order.status === 'on-way'
                                ? 'On the Way'
                                : 'Processing'}
                          </p>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gray-600 transition-transform ${
                            expandedOrder === order.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Items</h4>
                        <div className="flex gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="border-2 border-gray-300 rounded-2xl p-3">
                              <img
                                src={item.image || '/placeholder.svg'}
                                alt={item.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <p className="text-sm font-semibold text-gray-900 mt-2">{item.title}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-6 border-t border-gray-300">
                        <button className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition">
                          View Invoice
                        </button>
                        <button className="flex-1 px-4 py-3 bg-[#8B5CF6] text-white rounded-xl font-semibold hover:bg-purple-700 transition">
                          Buy Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
