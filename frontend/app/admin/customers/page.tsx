'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { User } from '@/lib/types'
import { Mail, Shield } from 'lucide-react'

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<User[]>([])

    useEffect(() => {
        apiClient.request<User[]>('/api/admin/customers/').then(setCustomers)
    }, [])

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                    <div key={customer.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                            {customer.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900">{customer.first_name} {customer.last_name}</h3>
                                {customer.is_staff && <Shield className="w-4 h-4 text-blue-500" />}
                            </div>
                            <p className="text-sm text-gray-500">@{customer.username}</p>

                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                {customer.email}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}