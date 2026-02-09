'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiClient } from '@/lib/api-client'
import { Loader2, Upload, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  })

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await apiClient.getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories")
      }
    }
    fetchCats()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!imageFile) {
      toast({ title: "Image Required", description: "Please upload a product image", variant: "destructive" })
      setLoading(false)
      return
    }

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('stock', formData.stock)
      data.append('category_id', formData.category_id)
      data.append('image', imageFile)

      await apiClient.createProduct(data)

      toast({ title: "Success", description: "Product created successfully" })
      router.push('/admin/products')

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
          <h1 className="text-3xl font-bold text-[#1E3A8A]">Add New Product</h1>
          <p className="text-gray-500">Fill in the details to create a new product.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., MacBook Pro M3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Product details, features, and specs..."
                    className="h-32"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KSh)</Label>
              <Input
                  id="price"
                  type="number"
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                  id="stock"
                  type="number"
                  required
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  placeholder="0"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Category</Label>
              <Select onValueChange={(val) => setFormData({...formData, category_id: val})} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Product Image</h2>

            <div className="flex items-center gap-6">
              <div className={`w-32 h-32 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50
              ${imagePreview ? 'border-purple-500' : 'border-gray-300'}`}>
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <Upload className="text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <Label htmlFor="image" className="cursor-pointer">
                  <div className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg w-fit transition">
                    <Upload size={16} />
                    <span>Choose Image</span>
                  </div>
                  <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: JPG, PNG, WEBP. Max size: 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
                type="submit"
                className="w-full bg-[#1E3A8A] hover:bg-blue-900 py-6 text-lg"
                disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Create Product
            </Button>
          </div>

        </form>
      </div>
  )
}