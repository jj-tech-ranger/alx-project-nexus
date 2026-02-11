'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUser } from '@/lib/user-context'

export default function SettingsPage() {
    const { user } = useUser()

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-[#1E3A8A] mb-8">Settings</h1>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Account Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input value={user?.username} disabled className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={user?.email} disabled className="bg-gray-50" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Notifications</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-gray-500">Receive emails about your order status.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Promotions</p>
                            <p className="text-sm text-gray-500">Receive emails about new products and deals.</p>
                        </div>
                        <Switch />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Security</h2>
                    <Button variant="outline" className="w-full">Change Password</Button>
                </div>
            </div>
        </div>
    )
}