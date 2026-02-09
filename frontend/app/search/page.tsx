'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Loader2 } from 'lucide-react'
import { getProducts, getCategories } from '@/lib/api'
import ProductCard from '@/components/product-card'
import { Product, Category } from '@/lib/types'

interface FilterContentProps {
  priceRange: number[]
  setPriceRange: (val: number[]) => void
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onReset: () => void
}

function FilterContent({
                         priceRange,
                         setPriceRange,
                         categories,
                         selectedCategory,
                         onCategoryChange,
                         onReset
                       }: FilterContentProps) {
  return (
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
          <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={250000}
              step={5000}
              className="mb-3"
          />
          <div className="flex gap-2 text-sm text-gray-600">
            <span>KSh {priceRange[0].toLocaleString()}</span>
            <span>-</span>
            <span>KSh {priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat: Category) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <Checkbox
                      id={cat.name}
                      checked={selectedCategory === cat.name}
                      onCheckedChange={() => onCategoryChange(cat.name)}
                  />
                  <label htmlFor={cat.name} className="text-sm cursor-pointer">
                    {cat.name}
                  </label>
                </div>
            ))}
          </div>
        </div>

        <Button
            onClick={onReset}
            variant="outline"
            className="w-full bg-transparent"
        >
          Reset Filters
        </Button>
      </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [priceRange, setPriceRange] = useState([0, 250000])
  const [sortBy, setSortBy] = useState('relevance')

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (query) params.append('search', query)
      if (category) params.append('search', category)

      const data = await getProducts(params.toString())
      setProducts(data)
      setLoading(false)
    }
    fetchResults()
  }, [query, category])

  const filteredProducts = products.filter(p => {
    const price = Number(p.price)
    return price >= priceRange[0] && price <= priceRange[1]
  }).sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price)
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price)
    return 0
  })

  const handleResetFilters = () => {
    setPriceRange([0, 250000])
    setSortBy('relevance')
    router.push('/search')
  }

  const handleCategoryChange = (catName: string) => {
    router.push(`/search?category=${catName}`)
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">
              {query ? `Search Results for "${query}"` : category ? `${category}` : 'All Products'}
            </h1>
            <p className="text-gray-600">{filteredProducts.length} products found</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="hidden lg:block">
              <FilterContent
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  categories={categories}
                  selectedCategory={category}
                  onCategoryChange={handleCategoryChange}
                  onReset={handleResetFilters}
              />
            </aside>

            <div className="lg:hidden mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Menu size={20} /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <FilterContent
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      categories={categories}
                      selectedCategory={category}
                      onCategoryChange={handleCategoryChange}
                      onReset={handleResetFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>

            <main className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredProducts.length} results
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Sort By:</label>
                  <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {loading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-[#1E3A8A]" size={40} />
                  </div>
              ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">No products found</p>
                    <Button className="bg-[#8B5CF6] hover:bg-purple-700 text-white" onClick={handleResetFilters}>
                      View All Products
                    </Button>
                  </div>
              )}
            </main>
          </div>
        </div>
      </div>
  )
}