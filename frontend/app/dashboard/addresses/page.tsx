'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Plus, Home, Briefcase, MapPin, Trash2, Phone, User } from 'lucide-react'
import { Address } from '@/lib/types'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    label: 'home',
    full_name: '',
    street: '',
    city: '',
    postal_code: '',
    country: 'Kenya',
    phone: '',
    is_default: false
  })

  const fetchAddresses = async () => {
    try {
      const data = await apiClient.getAddresses()
      setAddresses(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleAddAddress = async () => {
    setSaving(true)
    try {
      await apiClient.addAddress(newAddress)
      toast({ title: "Address Saved Successfully" })
      setOpen(false)
      fetchAddresses()
      // Reset form
      setNewAddress({
        label: 'home', full_name: '', street: '', city: '',
        postal_code: '', country: 'Kenya', phone: '', is_default: false
      })
    } catch (error) {
      toast({ title: "Failed to add address", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    if(!confirm("Are you sure you want to remove this address?")) return
    try {
      await apiClient.deleteAddress(id)
      toast({ title: "Address Removed" })
      fetchAddresses()
    } catch (error) {
      toast({ title: "Delete Failed", variant: "destructive" })
    }
  }

  const getIcon = (label: string) => {
    switch(label) {
      case 'home': return <Home className="w-4 h-4" />
      case 'work': return <Briefcase className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1E3A8A] w-8 h-8"/></div>

  return (
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">Address Book</h1>
            <p className="text-gray-500">Manage your shipping destinations.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3A8A] hover:bg-blue-800 shadow-md transition-all">
                <Plus className="w-4 h-4 mr-2"/> Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>Enter your delivery details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Select
                        value={newAddress.label}
                        onValueChange={(val: any) => setNewAddress({...newAddress, label: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                        placeholder="Recipient Name"
                        value={newAddress.full_name}
                        onChange={e => setNewAddress({...newAddress, full_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                      placeholder="+254 7..."
                      value={newAddress.phone}
                      onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input
                      placeholder="e.g. 4th Floor, Plaza Y"
                      value={newAddress.street}
                      onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                        placeholder="Nairobi"
                        value={newAddress.city}
                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input
                        placeholder="00100"
                        value={newAddress.postal_code}
                        onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                      type="checkbox"
                      id="default"
                      className="rounded border-gray-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                      checked={newAddress.is_default}
                      onChange={e => setNewAddress({...newAddress, is_default: e.target.checked})}
                  />
                  <Label htmlFor="default" className="font-normal cursor-pointer">Set as default shipping address</Label>
                </div>
              </div>
              <Button onClick={handleAddAddress} disabled={saving} className="w-full bg-[#1E3A8A] hover:bg-blue-800">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                Save Address
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
              <Card key={addr.id} className={`relative overflow-hidden transition-all duration-200 border-2 ${addr.is_default ? 'border-[#1E3A8A]/20 bg-blue-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                <CardHeader className="pb-3 pt-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${addr.label === 'work' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-[#1E3A8A]'}`}>
                        {getIcon(addr.label)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 capitalize">{addr.label}</h3>
                        {addr.is_default && (
                            <Badge variant="secondary" className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A] text-[10px] h-5 px-2">
                              Default
                            </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600" onClick={() => handleDelete(addr.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 text-sm space-y-2.5 text-gray-600">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{addr.full_name || 'No Name'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>
                  {addr.street}<br/>
                      {addr.city}, {addr.postal_code}<br/>
                      {addr.country}
                </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{addr.phone}</span>
                  </div>
                </CardContent>
              </Card>
          ))}

          {addresses.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No Addresses Yet</h3>
                <p className="text-gray-500 mb-6">Add an address to speed up checkout.</p>
                <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-blue-50"
                >
                  Add Your First Address
                </Button>
              </div>
          )}
        </div>
      </div>
  )
}