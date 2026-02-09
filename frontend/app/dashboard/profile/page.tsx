'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/lib/api-client'
import { useUser } from '@/lib/user-context'
import { useToast } from '@/hooks/use-toast'
import { Loader2, User as UserIcon } from 'lucide-react'

export default function ProfilePage() {
  const { user, refreshUser } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || ''
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiClient.updateProfile({
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name
      })
      await refreshUser()
      toast({ title: "Profile Updated", description: "Your details have been saved." })
    } catch (error) {
      toast({ title: "Update Failed", description: "Could not save changes.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Profile Settings</h1>
          <p className="text-gray-500">Manage your account information.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <UserIcon size={32} />
            </div>
            <div>
              <h2 className="font-bold text-lg">{user?.username}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50"
              />
              <p className="text-xs text-gray-400">Email cannot be changed directly.</p>
            </div>

            <Button type="submit" className="w-full bg-[#1E3A8A]" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </form>
        </div>
      </div>
  )
}