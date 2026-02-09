'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    addItem({
      id: product.id,
      title: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
      slug: product.slug,
    })
    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`
    })
  }

  // Safe Category Access: Handles both Object (New) and String (Old)
  const categoryName = typeof product.category === 'object' && product.category !== null
      ? product.category.name
      : String(product.category || 'Product')

  return (
      <Link href={`/product/${product.slug}`} className="group h-full">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            {product.image ? (
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
            )}

            {product.stock <= 5 && product.stock > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Low Stock
            </span>
            )}
          </div>

          <div className="p-4 flex flex-col flex-1">
            <div className="text-xs text-[#8B5CF6] font-semibold mb-1 uppercase tracking-wide">
              {categoryName}
            </div>

            <h3 className="font-bold text-gray-900 truncate mb-2 group-hover:text-[#1E3A8A] transition-colors">
              {product.name}
            </h3>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex flex-col">
              <span className="text-lg font-bold text-[#1E3A8A]">
                KSh {Number(product.price).toLocaleString()}
              </span>
                {product.discount_price && (
                    <span className="text-xs text-gray-400 line-through">
                  KSh {Number(product.discount_price).toLocaleString()}
                </span>
                )}
              </div>

              <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-8 w-8 bg-blue-50 text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors"
                  onClick={handleAddToCart}
              >
                <ShoppingCart size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Link>
  )
}