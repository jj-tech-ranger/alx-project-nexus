'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { apiClient } from '@/lib/api-client'
import { Loader2, Upload, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Category } from '@/lib/types'

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null as File | null
  })

  useEffect(() => {
    apiClient.getCategories().then(setCategories)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image) {
      toast({ title: "Image required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('stock', formData.stock)
      data.append('category', formData.category)
      data.append('image', formData.image)

      // Direct fetch call needed for FormData
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: data
      })

      if (!response.ok) throw new Error('Failed')

      toast({ title: "Product Created Successfully" })
      router.push('/admin/products')
    } catch (error) {
      toast({ title: "Failed to create product", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. iPhone 15 Pro"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Price (KSh)</Label>
                <Input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  required
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                  required
                  className="h-32"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Product details..."
              />
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})}
                />
                <div className="bg-blue-50 p-3 rounded-full mb-3">
                  <Upload className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formData.image ? formData.image.name : "Click to upload image"}
                </p>
                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF</p>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#1E3A8A] h-12 text-lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Publish Product"}
            </Button>
          </form>
        </div>
      </div>
  )
}