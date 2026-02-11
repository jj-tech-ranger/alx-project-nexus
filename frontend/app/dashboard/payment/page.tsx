'use client'

import { Button } from '@/components/ui/button'
import { Plus, Trash2, CreditCard } from 'lucide-react'

export default function PaymentMethodsPage() {
  // Mock data - replace with API call later if needed
  const paymentMethods = [
    { id: '1', type: 'M-Pesa', value: '+254 712 *** 678', isDefault: true },
    { id: '2', type: 'Visa', value: '**** **** **** 4242', isDefault: false },
  ]

  return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-[#1E3A8A] mb-2">Payment Methods</h1>
        <p className="text-gray-500 mb-8">Manage your saved payment options for faster checkout.</p>

        {/* Add New Payment Button */}
        <Button className="mb-8 bg-[#1E3A8A] hover:bg-blue-800 text-white px-6 py-6 rounded-xl font-semibold flex items-center gap-2">
          <Plus size={20} />
          Add Payment Method
        </Button>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map(method => (
              <div key={method.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1E3A8A]">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-900">{method.type}</h3>
                      {method.isDefault && (
                          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      Default
                    </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{method.value}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={20} />
                </button>
              </div>
          ))}
        </div>
      </div>
  )
}
