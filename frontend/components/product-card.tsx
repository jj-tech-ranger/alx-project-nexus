'use client'

import React, { useState, useEffect } from "react"
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/cart-context'
import { useUser } from '@/lib/user-context'
import { useToast } from '@/components/ui/use-toast'
import { apiClient } from '@/lib/api-client'

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "/placeholder.jpg"
  if (path.startsWith('http')) return path

  // Remove trailing slash from base, ensure leading slash on path
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${cleanPath}`
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { user } = useUser()
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.jpg")
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)

  // Initialize image source on mount or change
  useEffect(() => {
    setImgSrc(getImageUrl(product.image))
  }, [product.image])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: String(product.id),
      title: product.name,
      price: Number(product.price),
      image: imgSrc,
      quantity: 1,
      slug: product.slug,
    })
    toast({
      title: 'Added to Cart',
      description: `${product.name} added.`,
    })
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({ title: "Login Required", description: "Please login to save items", variant: "destructive" })
      return
    }

    setIsWishlistLoading(true)
    try {
      await apiClient.addToWishlist(product.id)
      toast({ title: "Added to Wishlist" })
    } catch (error) {
      toast({ title: "Error", description: "Could not save item.", variant: "destructive" })
    } finally {
      setIsWishlistLoading(false)
    }
  }

  const categoryName = typeof product.category === 'string'
      ? product.category
      : product.category?.name || 'General'

  return (
      <Link href={`/product/${product.slug}`} className="group block h-full">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">

          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Image
                src={imgSrc}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized={true} // <--- CRITICAL FIX: Bypasses Next.js server optimization
                onError={() => {
                  console.log(`Failed to load: ${imgSrc}`);
                  setImgSrc('/placeholder.jpg')
                }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.is_featured && (
                  <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 shadow-sm">Hot</Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="destructive" className="shadow-sm">Low Stock</Badge>
              )}
              {product.stock === 0 && (
                  <Badge variant="secondary" className="bg-gray-200 text-gray-600 shadow-sm">Out of Stock</Badge>
              )}
            </div>

            {/* Fancy Quick Actions (Slide up on Hover) */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-2 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 z-10">
              <Button
                  size="icon"
                  onClick={handleAddToWishlist}
                  disabled={isWishlistLoading}
                  className="h-10 w-10 rounded-full bg-white text-gray-700 hover:text-red-500 hover:bg-red-50 shadow-lg border border-gray-100"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                  size="icon"
                  onClick={handleAddToCart}
                  className="h-10 w-10 rounded-full bg-[#1E3A8A] text-white hover:bg-blue-800 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="mb-2">
            <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider bg-purple-50 px-2 py-1 rounded-md">
                {categoryName}
            </span>
            </div>

            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#1E3A8A] transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-1 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                    />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium ml-1">
                ({product.reviewCount || 0} reviews)
            </span>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">Price</span>
                <p className="text-xl font-bold text-[#1E3A8A]">
                  KSh {Number(product.price).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
  )
}