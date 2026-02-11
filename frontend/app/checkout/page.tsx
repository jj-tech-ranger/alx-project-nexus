'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/lib/cart-context'
import { useUser } from '@/lib/user-context'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Check, CheckCircle2 } from 'lucide-react'
import { createOrder } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CheckoutPage() {
  const { items, clearCart, cartTotal } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (items.length === 0 && !showSuccessModal) router.push('/cart')
    if (!user && !localStorage.getItem('accessToken')) {
      toast({ title: "Login Required", description: "Please login to checkout" })
      router.push('/login?redirect=/checkout')
    }
  }, [items, user, router, toast, showSuccessModal])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: 'Nairobi',
    note: '',
    mpesaPhone: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const subtotal = cartTotal
  const tax = subtotal * 0.16
  const shippingFee = formData.city === 'Nairobi' ? 500 : 1500
  const total = subtotal + tax + shippingFee

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.street) {
      toast({ title: 'Please fill all shipping details', variant: 'destructive' })
      return
    }
    if (paymentMethod === 'mpesa' && !formData.mpesaPhone) {
      toast({ title: 'Please enter M-Pesa phone number', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const orderPayload = {
        total_amount: total,
        status: "pending",
        shipping_address: `${formData.street}, ${formData.city}. Phone: ${formData.phone}. Note: ${formData.note}`,
        payment_method: paymentMethod,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      }

      await createOrder(orderPayload)

      // Show success modal
      setShowSuccessModal(true)
      clearCart()

      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/orders')
      }, 3000)

    } catch (error) {
      console.error(error)
      toast({ title: "Order Failed", description: "Something went wrong.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !showSuccessModal) return null

  return (
      <div className="min-h-screen bg-gray-50 py-12">
        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={() => router.push('/dashboard/orders')}>
          <DialogContent className="sm:max-w-md text-center">
            <DialogHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <DialogTitle className="text-xl text-center text-[#1E3A8A]">Order Placed Successfully!</DialogTitle>
              <DialogDescription className="text-center">
                Thank you for your purchase. You are being redirected to your order history.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <Button onClick={() => router.push('/dashboard/orders')} className="bg-[#1E3A8A] w-full">
                View My Orders
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8" />
              <span className="font-bold text-xl text-[#1E3A8A]">NovaMart</span>
            </Link>
            <p className="text-blue-500 font-semibold">Secure Checkout</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Shipping Details */}
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold">1</div>
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Details</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="First Name" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} className="rounded-xl" />
                    <Input placeholder="Last Name" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} className="rounded-xl" />
                  </div>
                  <Input placeholder="Address Location" value={formData.street} onChange={e => handleInputChange('street', e.target.value)} className="rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Phone Number" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="rounded-xl" />
                    <select value={formData.city} onChange={e => handleInputChange('city', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]">
                      {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Naivasha'].map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                  <textarea placeholder="Note to Rider (optional)" value={formData.note} onChange={e => handleInputChange('note', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" rows={3} />
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold">2</div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  <div onClick={() => setPaymentMethod('mpesa')} className={`p-4 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'mpesa' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">M-Pesa</h3>
                        <p className="text-sm text-gray-600">Pay instantly via your phone.</p>
                      </div>
                      {paymentMethod === 'mpesa' && <Check className="w-5 h-5 text-green-500" />}
                    </div>
                    {paymentMethod === 'mpesa' && <Input placeholder="M-Pesa Phone Number" value={formData.mpesaPhone} onChange={e => handleInputChange('mpesaPhone', e.target.value)} className="rounded-xl" />}
                  </div>

                  <div onClick={() => setPaymentMethod('card')} className={`p-4 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'card' ? 'border-[#8B5CF6] bg-purple-50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">Credit Card</h3>
                        <p className="text-sm text-gray-600">Visa, Mastercard, Amex.</p>
                      </div>
                      {paymentMethod === 'card' && <Check className="w-5 h-5 text-[#8B5CF6]" />}
                    </div>
                    {paymentMethod === 'card' && (
                        <div className="space-y-3">
                          <Input placeholder="Card Number" value={formData.cardNumber} onChange={e => handleInputChange('cardNumber', e.target.value)} className="rounded-xl" />
                          <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="MM/YY" value={formData.expiry} onChange={e => handleInputChange('expiry', e.target.value)} className="rounded-xl" />
                            <Input placeholder="CVV" value={formData.cvv} onChange={e => handleInputChange('cvv', e.target.value)} className="rounded-xl" />
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#8B5CF6] text-white rounded-3xl p-8 sticky top-24">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6 pb-6 border-b border-purple-400 max-h-60 overflow-y-auto">
                  {items.map(item => (
                      <div key={item.id} className="flex items-start gap-3">
                        <img src={item.image || '/placeholder.jpg'} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-white p-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-purple-200 text-sm">KSh {item.price} × {item.quantity}</p>
                        </div>
                      </div>
                  ))}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-purple-100"><span>Subtotal</span><span>KSh {subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-purple-100"><span>Tax (16%)</span><span>KSh {tax.toLocaleString()}</span></div>
                  <div className="flex justify-between text-purple-100"><span>Shipping</span><span>KSh {shippingFee.toLocaleString()}</span></div>
                  <div className="border-t border-purple-400 pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>KSh {total.toLocaleString()}</span></div>
                </div>
                <Button onClick={handlePayment} disabled={loading} className="w-full bg-white text-[#8B5CF6] hover:bg-gray-100 font-bold py-6 rounded-xl">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : `Pay KSh ${total.toLocaleString()}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}