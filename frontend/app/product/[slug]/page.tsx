'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Star, Minus, Plus, Loader2, MessageSquare } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'
import { Product, Review } from '@/lib/types'
import { useUser } from '@/lib/user-context'
import { Textarea } from '@/components/ui/textarea'

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  const { addItem } = useCart()
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const fetchProduct = async () => {
    try {
      const data = await apiClient.getProduct(resolvedParams.slug)
      setProduct(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.slug])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      title: product.name,
      price: Number(product.price),
      image: product.image,
      quantity,
      slug: product.slug,
    })
    toast({
      title: 'Added to Cart',
      description: `${quantity} × ${product.name} added to your cart.`,
    })
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/login')
      return
    }
    setSubmittingReview(true)
    try {
      await apiClient.createReview({
        product: product!.id,
        rating: reviewRating,
        comment: reviewComment
      })
      toast({ title: "Review Submitted!" })
      setReviewComment('')
      fetchProduct()
    } catch (error) {
      toast({ title: "Failed to submit review", variant: "destructive" })
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E3A8A]" />
        </div>
    )
  }

  if (!product) return <div className="p-8 text-center">Product Not Found</div>

  return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/">Home</Link> /
            <span className="font-semibold text-gray-900">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-96 object-cover" />
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={20} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.rating || 0} ({product.reviewCount || 0} reviews)</span>
              </div>

              <p className="text-4xl font-bold text-[#1E3A8A]">KSh {Number(product.price).toLocaleString()}</p>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50"><Minus size={16}/></button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50"><Plus size={16}/></button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 py-6 bg-[#8B5CF6] hover:bg-purple-700 text-lg">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="text-[#8B5CF6]" /> Customer Reviews
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review: Review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex justify-between items-center mb-2">
                            {/* Note: Review interface should have user_name based on serializer */}
                            <span className="font-bold text-gray-900">{(review as any).user_name || 'User'}</span>
                            <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex text-yellow-400 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-xl h-fit">
                <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                {user ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className={`text-2xl ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                              >
                                ★
                              </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Comment</label>
                        <Textarea
                            required
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="bg-white"
                        />
                      </div>
                      <Button type="submit" disabled={submittingReview} className="w-full bg-[#1E3A8A]">
                        {submittingReview ? <Loader2 className="animate-spin" /> : 'Submit Review'}
                      </Button>
                    </form>
                ) : (
                    <div className="text-center py-6">
                      <p className="mb-4 text-gray-600">Please log in to write a review.</p>
                      <Link href="/login">
                        <Button variant="outline">Log In</Button>
                      </Link>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}