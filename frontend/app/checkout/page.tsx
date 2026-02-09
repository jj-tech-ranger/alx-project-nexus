'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useUser } from '@/lib/user-context'
import { createOrder } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const { user, isLoading: userLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'mpesa'
  })

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login?redirect=/checkout')
    }
  }, [user, userLoading, router])

  if (items.length === 0) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push('/')}>Go Shopping</Button>
        </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) throw new Error('Not authenticated')

      const orderData = {
        total_amount: cartTotal,
        shipping_address: `${formData.address}, ${formData.city}`,
        phone_number: formData.phone,
        payment_method: formData.paymentMethod,
        items_data: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      }

      await createOrder(token, orderData)

      clearCart()
      router.push('/order-success')

    } catch (error) {
      console.error(error)
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
              <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>Full Name</Label>
                  <Input
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label>Phone Number (M-Pesa)</Label>
                  <Input
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="0712 345 678"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                        required
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        placeholder="Nairobi"
                    />
                  </div>
                  <div>
                    <Label>Address / Location</Label>
                    <Input
                        required
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        placeholder="Westlands, Mpaka Rd"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  <RadioGroup
                      defaultValue="mpesa"
                      onValueChange={val => setFormData({...formData, paymentMethod: val})}
                  >
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Label htmlFor="mpesa" className="cursor-pointer flex-1 font-semibold text-green-600">
                        M-Pesa (Mobile Money)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="cursor-pointer flex-1">
                        Credit / Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer flex-1">
                        Pay on Delivery
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#1E3A8A] hover:bg-blue-900 py-6 text-lg"
                    disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
                  Pay KSh {cartTotal.toLocaleString()}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-100 p-6 rounded-2xl h-fit">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                    <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-xl">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-sm">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <span className="text-[#1E3A8A]">KSh {cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}