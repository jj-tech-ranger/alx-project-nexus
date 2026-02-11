'use client'

import { useUser } from '@/lib/user-context'
import { User, Mail, Phone, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfilePage() {
  const { user } = useUser()

  if (!user) return null

  return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-[#1E3A8A] mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-[#1E3A8A] text-3xl font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <Shield className="w-3 h-3" /> Verified Account
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input value={user.username} disabled className="pl-10 bg-gray-50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input value={user.email} disabled className="pl-10 bg-gray-50" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-[#1E3A8A] hover:bg-blue-800">
            Save Changes (Coming Soon)
          </Button>
        </div>
      </div>
  )
}