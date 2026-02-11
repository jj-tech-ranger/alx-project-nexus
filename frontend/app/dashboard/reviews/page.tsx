'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { apiClient } from '@/lib/api-client'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import StarRating from '@/components/star-rating'
import { useToast } from '@/components/ui/use-toast'
import { MessageSquare, Package } from 'lucide-react'

export default function MyReviewsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const { toast } = useToast()

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [open, setOpen] = useState(false)

    useEffect(() => {
        apiClient.getPurchasedProducts().then(setProducts)
    }, [])

    const handleSubmit = async () => {
        if (!selectedProduct) return
        try {
            await apiClient.createReview(selectedProduct.id, rating, comment)
            toast({ title: "Review Submitted", description: "Thanks for your feedback!" })
            setOpen(false)
            setComment('')
            setRating(5)
        } catch (error) {
            toast({ title: "Failed to submit", variant: "destructive" })
        }
    }

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-[#1E3A8A] mb-2">Review Items</h1>
            <p className="text-gray-500 mb-8">Rate products you have purchased.</p>

            <div className="space-y-4">
                {products.map(product => (
                    <div key={product.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-6 shadow-sm">
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={product.image || '/placeholder.jpg'} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">Purchased recently</p>
                        </div>

                        <Dialog open={open && selectedProduct?.id === product.id} onOpenChange={(isOpen) => {
                            setOpen(isOpen)
                            if(isOpen) setSelectedProduct(product)
                        }}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <MessageSquare className="w-4 h-4" /> Write Review
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Review {product.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-sm font-medium">Click to Rate</span>
                                        <StarRating rating={rating} setRating={setRating} size={8} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Review (Optional)</label>
                                        <Textarea
                                            placeholder="Tell us what you liked or didn't like..."
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                            className="h-32"
                                        />
                                    </div>
                                    <Button onClick={handleSubmit} className="w-full bg-[#1E3A8A]">Submit Review</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No purchased items found to review.</p>
                    </div>
                )}
            </div>
        </div>
    )
}