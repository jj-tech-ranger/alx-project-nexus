'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, Lock } from 'lucide-react'

const customers = [
  { id: 1, name: 'Sarah Wanjiku', email: 'sarah.w@example.com', joined: 'Oct 2023', spend: 'KSh 45,000', orders: 12 },
  { id: 2, name: 'James Miller', email: 'james.m@example.com', joined: 'Sep 2023', spend: 'KSh 125,000', orders: 28 },
  { id: 3, name: 'Priya Patel', email: 'priya.p@example.com', joined: 'Aug 2023', spend: 'KSh 8,500', orders: 3 },
  { id: 4, name: 'Kevin Otieno', email: 'kevin.o@example.com', joined: 'Jul 2023', spend: 'KSh 320,000', orders: 45 },
  { id: 5, name: 'Maria Garcia', email: 'maria.g@example.com', joined: 'Jun 2023', spend: 'KSh 67,200', orders: 18 },
]

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Customers</h1>
        <p className="text-gray-500 mt-2">Manage and view customer profiles.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search by email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {customer.name.charAt(0)}
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Shield size={20} />
              </button>
            </div>

            <h3 className="font-bold text-gray-900 mb-1">{customer.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{customer.email}</p>

            <div className="space-y-2 mb-6 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lifetime Spend</span>
                <span className="font-semibold text-gray-900">{customer.spend}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold text-gray-900">{customer.orders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900">{customer.joined}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-semibold">
                <Lock size={16} />
                Reset Password
              </Button>
              <Button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-semibold">
                Ban User
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
