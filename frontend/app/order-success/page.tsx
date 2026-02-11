'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CheckCircle, Bike } from 'lucide-react'

export default function OrderSuccessPage() {
  // In a real app, you might fetch the actual Order ID from params
  const orderId = '#' + Math.random().toString(36).substring(2, 8).toUpperCase()

  return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                  src="/logo.png"
                  alt="NovaMart Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
              />
              <span className="font-bold text-xl text-[#1E3A8A]">NovaMart</span>
            </Link>
          </div>
          <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-24 h-24 text-emerald-500" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2">Payment Received!</h1>
            <p className="text-gray-600 text-lg mb-8">
              Order <span className="font-bold text-gray-900">{orderId}</span> has been confirmed.<br />
              We&apos;ve sent a receipt to your email.
            </p>

            {/* Rider Dispatched Card */}
            <div className="bg-[#8B5CF6] text-white rounded-2xl p-6 mb-8 flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Bike className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Rider Dispatched</h3>
                <p className="text-purple-100">Expected arrival in 45 mins</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold">Order Number:</span> {orderId}</p>
                <p><span className="font-semibold">Estimated Delivery:</span> Today</p>
                <p><span className="font-semibold">Payment Status:</span> <span className="text-emerald-600 font-semibold">Completed</span></p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full py-6 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/dashboard/orders" className="flex-1">
                <Button className="w-full bg-[#8B5CF6] hover:bg-purple-700 text-white py-6 rounded-xl font-semibold">
                  Track Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
  )
}