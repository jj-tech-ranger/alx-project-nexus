'use client'

import DashboardSidebar from '@/components/dashboard-sidebar'
import { useUser } from '@/lib/user-context'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default function SavedItemsPage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Saved Items</h1>
            <p className="text-gray-600 mb-8">Your collection of items to buy later.</p>

            <div className="bg-white rounded-3xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Saved Items Yet</h2>
              <p className="text-gray-600 mb-8">Start saving your favorite products to buy later!</p>
              <Button className="bg-[#8B5CF6] hover:bg-purple-700 text-white px-8 py-6 rounded-xl font-semibold">
                Start Shopping
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
