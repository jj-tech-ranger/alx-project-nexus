'use client'

import DashboardSidebar from '@/components/dashboard-sidebar' // Keep sidebar for layout
import { useUser } from '@/lib/user-context'
import { ChevronDown, Package } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function OrderHistoryPage() {
    const { orders: rawOrders } = useUser()
    const [expandedOrder, setExpandedOrder] = useState<string | number | null>(null)

    // DATA MAPPER: Adapts API data to your specific UI Design
    const orders = rawOrders.map(order => ({
        id: order.id,
        orderNumber: `#${order.id}`,
        date: new Date(order.created_at).toLocaleDateString(),
        total: Number(order.total_amount),
        status: order.status,
        items: order.items.map((item: any) => ({
            title: item.product_name,
            image: item.product_image,
            quantity: item.quantity,
            price: item.price
        }))
    }))

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'text-blue-600'
            case 'shipped': return 'text-orange-600' // Mapped 'on-way' to 'shipped'
            case 'delivered': return 'text-emerald-600'
            default: return 'text-gray-600'
        }
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">No Orders Yet</h2>
                <p className="text-gray-500 mb-6 max-w-sm">Looks like you haven&apos;t placed any orders yet.</p>
                <Link href="/" className="bg-[#1E3A8A] text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Order History</h1>
            <p className="text-gray-600 mb-8">View and track your past purchases.</p>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                        {/* Header */}
                        <div
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="p-6 cursor-pointer hover:bg-gray-50 transition"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
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
                                        <p className={`font-semibold capitalize ${getStatusColor(order.status)}`}>
                                            {order.status}
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
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="border-2 border-gray-300 rounded-2xl p-3 min-w-[120px] bg-white">
                                                <div className="w-20 h-20 relative mx-auto mb-2 bg-gray-100 rounded-lg overflow-hidden">
                                                    {/* Simple image fallback */}
                                                    <img
                                                        src={item.image || '/placeholder.jpg'}
                                                        alt={item.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.title}</p>
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
    )
}