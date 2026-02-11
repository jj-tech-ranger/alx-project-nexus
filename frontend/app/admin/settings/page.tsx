'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminSettingsPage() {
    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Store Settings</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="payment">Payment & Shipping</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Store Name</Label>
                                <Input defaultValue="NovaMart" />
                            </div>
                            <div className="space-y-2">
                                <Label>Support Phone</Label>
                                <Input defaultValue="+254 700 000 000" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Support Email</Label>
                            <Input defaultValue="support@novamart.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Store Address</Label>
                            <Textarea defaultValue="Nairobi, Kenya" />
                        </div>
                        <div className="space-y-2">
                            <Label>Social Media Links</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <Input placeholder="Facebook URL" />
                                <Input placeholder="Twitter URL" />
                                <Input placeholder="Instagram URL" />
                            </div>
                        </div>
                        <Button className="bg-[#8B5CF6] hover:bg-purple-700">Save Changes</Button>
                    </div>
                </TabsContent>

                <TabsContent value="payment">
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Currency & Tax</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Currency Symbol</Label>
                                    <Input defaultValue="KSh" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax Rate (%)</Label>
                                    <Input type="number" defaultValue="16" />
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Shipping</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Standard Shipping Fee</Label>
                                    <Input type="number" defaultValue="500" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Free Shipping Threshold</Label>
                                    <Input type="number" defaultValue="10000" />
                                </div>
                            </div>
                        </div>
                        <Button className="bg-[#8B5CF6] hover:bg-purple-700">Update Settings</Button>
                    </div>
                </TabsContent>

                <TabsContent value="notifications">
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">New Order Alert</p>
                                <p className="text-sm text-gray-500">Get notified via email when a new order is placed</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Low Stock Warning</p>
                                <p className="text-sm text-gray-500">Notify when product stock falls below 5 items</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">New Review Alert</p>
                                <p className="text-sm text-gray-500">Get notified when a customer writes a review</p>
                            </div>
                            <Switch />
                        </div>
                        <Button className="bg-[#8B5CF6] hover:bg-purple-700">Save Preferences</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}