'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/components/ui/use-toast'

export default function SavedItemsPage() {
    const [savedItems, setSavedItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    // FIXED: Destructure 'addItem' correctly
    const { addItem } = useCart()
    const { toast } = useToast()

    const fetchItems = async () => {
        try {
            const data = await apiClient.getSavedItems()
            setSavedItems(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchItems()
    }, [])

    const handleRemove = async (id: number) => {
        try {
            await apiClient.removeFromWishlist(id)
            setSavedItems(prev => prev.filter(item => item.id !== id))
            toast({ title: "Item removed" })
        } catch (error) {
            toast({ title: "Failed to remove", variant: "destructive" })
        }
    }

    // FIXED: Handler for adding wishlist item to cart
    const handleMoveToCart = (item: any) => {
        addItem({
            id: String(item.product_details.id),
            title: item.product_details.name,
            price: Number(item.product_details.price),
            image: item.product_details.image,
            quantity: 1,
            slug: item.product_details.slug
        })
        toast({ title: "Moved to Cart" })
    }

    if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1E3A8A]" /></div>

    return (
        <div className="max-w-5xl">
            <h1 className="text-2xl font-bold text-[#1E3A8A] mb-2">Saved Items</h1>
            <p className="text-gray-500 mb-8">Your collection of items to buy later.</p>

            {savedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="relative h-48 bg-gray-100">
                                <Image
                                    src={item.product_details.image || '/placeholder.jpg'}
                                    alt={item.product_details.name}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="absolute top-3 right-3 bg-white/80 p-2 rounded-full text-gray-400 hover:text-red-500 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.product_details.name}</h3>
                                <p className="text-[#1E3A8A] font-bold mb-4">KSh {Number(item.product_details.price).toLocaleString()}</p>
                                {/* FIXED: Using correct handler */}
                                <Button
                                    className="w-full bg-[#1E3A8A] hover:bg-blue-800"
                                    onClick={() => handleMoveToCart(item)}
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Saved Items Yet</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        You haven't saved any products yet. Browse our store and click the heart icon to save items for later!
                    </p>
                    <Link href="/">
                        <Button className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-8 py-6 rounded-xl font-semibold gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}