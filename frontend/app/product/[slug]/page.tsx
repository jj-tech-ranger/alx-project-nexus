'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/ui/use-toast'
import { Product } from '@/lib/types'
import { Loader2, Minus, Plus, ShoppingCart, Heart, User } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import StarRating from '@/components/star-rating'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "/placeholder.jpg"
  if (path.startsWith('http')) return path
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

export default function ProductPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { user } = useUser()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isSaved, setIsSaved] = useState(false)
  const [savedItemId, setSavedItemId] = useState<number | string | null>(null)
  const [imgSrc, setImgSrc] = useState("/placeholder.jpg")

  useEffect(() => {
    async function loadData() {
      if (!slug) return
      try {
        const productData = await apiClient.getProduct(slug as string)
        setProduct(productData)
        setImgSrc(getImageUrl(productData.image))

        const reviewData = await apiClient.getReviews(productData.id)
        setReviews(reviewData)

        if (user) {
          const savedItems = await apiClient.getSavedItems()
          const saved = savedItems.find((item: any) => item.product === productData.id)
          if (saved) {
            setIsSaved(true)
            setSavedItemId(saved.id)
          }
        }
      } catch (error) {
        console.error("Failed to load product", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug, user])

  const checkAuth = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to proceed.",
        variant: "destructive"
      })
      router.push('/login')
      return false
    }
    return true
  }

  const handleToggleWishlist = async () => {
    if (!checkAuth()) return
    if (!product) return

    try {
      if (isSaved && savedItemId) {
        await apiClient.removeFromWishlist(savedItemId)
        setIsSaved(false)
        setSavedItemId(null)
        toast({ title: "Removed from wishlist" })
      } else {
        const res = await apiClient.addToWishlist(product.id)
        setIsSaved(true)
        setSavedItemId(res.id)
        toast({ title: "Added to wishlist" })
      }
    } catch (error) {
      toast({ title: "Action failed", variant: "destructive" })
    }
  }

  const handleAddToCart = () => {
    if (!checkAuth()) return
    if (!product) return
    addItem({
      id: String(product.id),
      title: product.name,
      price: Number(product.price),
      image: imgSrc,
      quantity: quantity,
      slug: product.slug
    })
    toast({ title: "Added to Cart" })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-[#1E3A8A]"/></div>
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>

  return (
      <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">

            <div className="p-8 flex items-center justify-center bg-gray-50">
              <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-sm">
                <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized={true} // Safe image loading
                />
              </div>
            </div>

            <div className="p-8 lg:pr-12 flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-[#8B5CF6] font-semibold tracking-wide uppercase text-xs bg-purple-50 px-3 py-1 rounded-full">
                    {typeof product.category === 'string' ? product.category : product.category?.name || 'Electronics'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <StarRating rating={product.rating || 0} readOnly />
                  <span className="text-gray-900 font-bold ml-2">{Number(product.rating).toFixed(1)}</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-[#1E3A8A] underline text-sm hover:text-blue-700">
                      See {product.reviewCount || 0} Reviews
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Reviews for {product.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      {reviews.length > 0 ? (
                          reviews.map((review: any) => (
                              <div key={review.id} className="border-b border-gray-100 pb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                      <User className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span className="font-semibold text-sm">{review.user_name}</span>
                                  </div>
                                  <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <StarRating rating={review.rating} readOnly size={4} />
                                <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                              </div>
                          ))
                      ) : (
                          <p className="text-gray-500 text-center py-4">No reviews yet.</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-4xl font-bold text-[#1E3A8A]">KSh {Number(product.price).toLocaleString()}</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-xl">
                    <button
                        className="p-3 hover:text-[#1E3A8A]"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                        className="p-3 hover:text-[#1E3A8A]"
                        onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>

                <div className="flex gap-4">
                  <Button
                      className="flex-1 bg-[#1E3A8A] hover:bg-blue-800 text-white h-14 rounded-xl text-lg gap-2"
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Button>
                  <Button
                      variant="outline"
                      className={`h-14 w-14 rounded-xl border-gray-200 ${isSaved ? 'text-red-500 bg-red-50 border-red-200' : 'text-gray-400'}`}
                      onClick={handleToggleWishlist}
                  >
                    <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}