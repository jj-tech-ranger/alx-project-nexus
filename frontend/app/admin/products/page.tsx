'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiClient } from '@/lib/api-client'
import { Product } from '@/lib/types'
import Link from 'next/link'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    apiClient.getProducts().then(setProducts)
  }, [])

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <Link href="/admin/products/new">
            <Button className="bg-[#8B5CF6] hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                  placeholder="Search products..."
                  className="pl-9 bg-gray-50 border-gray-200"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4">KSh {Number(product.price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock} in stock
                  </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4 text-blue-500" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  )
}