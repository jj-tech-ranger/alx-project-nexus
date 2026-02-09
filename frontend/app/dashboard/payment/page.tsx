'use client'

import DashboardSidebar from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

export default function PaymentMethodsPage() {
  const paymentMethods = [
    { id: '1', type: 'M-Pesa', value: '+254712345678', isDefault: true },
    { id: '2', type: 'Credit Card', value: '**** **** **** 4242', isDefault: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Payment Methods</h1>
            <p className="text-gray-600 mb-8">Manage your payment options.</p>

            {/* Add New Payment */}
            <Button className="mb-8 bg-[#8B5CF6] hover:bg-purple-700 text-white px-6 py-6 rounded-xl font-semibold flex items-center gap-2">
              <Plus size={20} />
              Add Payment Method
            </Button>

            {/* Payment Methods List */}
            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div key={method.id} className="bg-white rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{method.type}</h3>
                      {method.isDefault && (
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{method.value}</p>
                  </div>
                  <button className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
