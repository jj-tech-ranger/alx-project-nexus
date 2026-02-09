'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { Product } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      const data = await apiClient.getProducts()
      setProducts(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string | number) => {
    if(!confirm("Are you sure?")) return
    try {
      await apiClient.deleteProduct(id)
      toast({ title: "Product Deleted" })
      fetchProducts()
    } catch (error) {
      toast({ title: "Failed to delete", variant: "destructive" })
    }
  }

  if (loading) return <div className="p-8"><Loader2 className="animate-spin text-blue-600"/></div>

  return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A8A]">Products</h1>
            <p className="text-gray-500 mt-2">Manage your catalog</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-[#8B5CF6] hover:bg-purple-700 text-white gap-2">
              <Plus size={18} /> Add Product
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </td>
                  <td className="px-6 py-4 font-semibold">KSh {Number(product.price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {product.stock}
                  </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
          {products.length === 0 && (
              <div className="p-8 text-center text-gray-500">No products found.</div>
          )}
        </div>
      </div>
  )
}