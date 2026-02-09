'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import { Loader2, MapPin, Trash2, Plus } from 'lucide-react'
import { Address } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    phone: '',
    is_default: false
  })

  const fetchAddresses = async () => {
    try {
      const data = await apiClient.getAddresses()
      setAddresses(data)
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
    try {
      await apiClient.addAddress(newAddress)
      toast({ title: "Address Added" })
      setOpen(false)
      fetchAddresses()
      setNewAddress({ street: '', city: '', phone: '', is_default: false })
    } catch (error) {
      toast({ title: "Failed to add address", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string | number) => {
    if(!confirm("Delete this address?")) return
    try {
      await apiClient.deleteAddress(id)
      toast({ title: "Address Deleted" })
      fetchAddresses()
    } catch (error) {
      toast({ title: "Delete Failed", variant: "destructive" })
    }
  }

  if (loading) return <div className="p-8"><Loader2 className="animate-spin text-blue-600"/></div>

  return (
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">My Addresses</h1>
            <p className="text-gray-500">Manage your delivery locations.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3A8A]"><Plus size={16} className="mr-2"/> Add New</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Street / Location</Label>
                  <Input
                      value={newAddress.street}
                      onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                      placeholder="e.g. Westlands, Mpaka Rd"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                      value={newAddress.city}
                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                      placeholder="e.g. Nairobi"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                      value={newAddress.phone}
                      onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                      placeholder="0712 345 678"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                      type="checkbox"
                      id="default"
                      checked={newAddress.is_default}
                      onChange={e => setNewAddress({...newAddress, is_default: e.target.checked})}
                      className="rounded border-gray-300"
                  />
                  <Label htmlFor="default">Set as default address</Label>
                </div>
                <Button onClick={handleAddAddress} className="w-full mt-4">Save Address</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {addresses.map((addr) => (
              <Card key={addr.id} className="p-6 flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="mt-1 text-gray-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{addr.city}</h3>
                      {addr.is_default && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Default
                    </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{addr.street}</p>
                    <p className="text-gray-500 text-sm mt-1">{addr.phone}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(addr.id)}>
                  <Trash2 size={18} />
                </Button>
              </Card>
          ))}

          {addresses.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50 text-gray-500">
                <p>No addresses saved yet.</p>
              </div>
          )}
        </div>
      </div>
  )
}