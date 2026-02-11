'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/product-card'
import { apiClient } from '@/lib/api-client' // Use the new client
import { Product, Category } from '@/lib/types'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          apiClient.getProducts(),
          apiClient.getCategories()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4)
  const recentProducts = products.slice(0, 8)

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
        </div>
    )
  }

  return (
      <div className="flex flex-col gap-16 pb-16">
        {/* Hero Section */}
        <section className="relative bg-[#1E3A8A] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Upgrade Your Tech Game Today
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-8">
                Discover the latest gadgets, accessories, and premium electronics at unbeatable prices.
              </p>
              <div className="flex gap-4">
                <Link href="/search">
                  <Button size="lg" className="bg-white text-[#1E3A8A] hover:bg-blue-50 font-semibold rounded-full px-8">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/search?category=Offers">
                  <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10 rounded-full px-8 bg-transparent">
                    View Offers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="p-3 bg-blue-100 rounded-full text-[#1E3A8A]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Countrywide shipping available</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-green-50 border border-green-100">
              <div className="p-3 bg-green-100 rounded-full text-green-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure payment processing</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="p-3 bg-purple-100 rounded-full text-purple-700">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">24/7 Support</h3>
                <p className="text-sm text-gray-600">We are here to help anytime</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/search?sort=featured" className="text-[#1E3A8A] font-semibold hover:underline flex items-center gap-1">
              See All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                  <Link
                      key={category.id}
                      href={`/search?category=${category.name}`}
                      className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#1E3A8A] hover:shadow-md transition text-center group"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-blue-50 transition">
                      <ShoppingBag className="w-6 h-6 text-gray-400 group-hover:text-[#1E3A8A]" />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-[#1E3A8A]">{category.name}</h3>
                  </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
  )
}