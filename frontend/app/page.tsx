import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getProducts } from '@/lib/api'
import ProductCard from '@/components/product-card'
import { Product } from '@/lib/types'

export default async function HomePage() {
  const products: Product[] = await getProducts('ordering=-created_at')
  const trendingProducts = products.slice(0, 4)

  return (
      <div className="bg-gray-50">
        <div className="relative h-96 bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] text-white overflow-hidden">
          <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=400&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="flex flex-col justify-center">
                <p className="text-[#8B5CF6] font-semibold text-sm mb-4 uppercase tracking-wide">
                  FLASH SALE
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                  Experience Sound Like Never Before
                </h1>
                <p className="text-blue-100 text-lg mb-8">
                  Premium noise-cancelling headphones now available at exclusive prices for a limited time.
                </p>
                <Link href="/search?category=Audio" className="w-fit">
                  <Button className="bg-[#8B5CF6] hover:bg-purple-700 text-white px-8 py-6 rounded-xl text-base font-semibold">
                    Shop Now
                  </Button>
                </Link>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
                    alt="Premium Headphones"
                    className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#1E3A8A]">Trending in Nairobi</h2>
            <Link href="/search" className="text-[#8B5CF6] hover:text-purple-700 font-semibold">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
  )
}