'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart()
  const router = useRouter()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.16
  const total = subtotal + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Link href="/">
            <Button className="bg-[#8B5CF6] hover:bg-purple-700 text-white w-full py-6 text-lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="divide-y">
                {items.map(item => (
                  <div key={item.id} className="p-6 flex gap-6 hover:bg-gray-50 transition">
                    {/* Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-[#8B5CF6] transition mb-2">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold text-[#1E3A8A] mb-4">
                        KSh {item.price.toLocaleString()}
                      </p>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="border border-gray-300 rounded p-1 hover:bg-gray-100 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="border border-gray-300 rounded p-1 hover:bg-gray-100 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-lg font-bold text-gray-900">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 transition p-2 rounded hover:bg-red-50"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-4 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (16%)</span>
                  <span>KSh {tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold text-[#1E3A8A]">
                <span>Total</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>

              <Button
                onClick={() => router.push('/checkout')}
                className="w-full bg-[#8B5CF6] hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-xl"
              >
                Proceed to Checkout
              </Button>

              <p className="text-xs text-center text-gray-500">Secure Checkout</p>

              <Link href="/search">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
