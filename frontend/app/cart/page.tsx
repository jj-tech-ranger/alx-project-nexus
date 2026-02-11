'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { useUser } from '@/lib/user-context'
import { useToast } from '@/components/ui/use-toast'

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal } = useCart()
    const router = useRouter()
    const { user } = useUser()
    const { toast } = useToast()

    const handleCheckout = () => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to proceed to checkout.",
                variant: "destructive"
            })
            router.push('/login?redirect=/checkout')
            return
        }
        router.push('/checkout')
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link href="/">
                    <Button className="bg-[#1E3A8A] hover:bg-blue-800 h-12 px-8 rounded-xl text-lg">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-8">
                    <div className="space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                                    <Image
                                        src={item.image || '/placeholder.jpg'}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        unoptimized={true} // <--- CRITICAL FIX for cart crash
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                            <p className="text-[#1E3A8A] font-bold mt-1">
                                                KSh {item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 p-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="p-2 hover:bg-gray-100 rounded-l-lg transition"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-100 rounded-r-lg transition"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 mt-8 lg:mt-0">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>KSh {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Calculated at Checkout</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>KSh {cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            className="w-full bg-[#1E3A8A] hover:bg-blue-800 h-14 rounded-xl text-lg font-semibold shadow-lg shadow-blue-900/20"
                        >
                            Checkout <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}