'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogOut, ShoppingBag, LayoutDashboard, Package, Heart, MapPin, User, CreditCard, MessageSquare, Settings } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { Button } from '@/components/ui/button'

export default function DashboardSidebar() {
    const pathname = usePathname()
    const { logout } = useUser()

    const navItems = [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Orders', href: '/dashboard/orders', icon: Package },
        { label: 'Saved Items', href: '/dashboard/saved-items', icon: Heart },
        { label: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
        { label: 'Reviews', href: '/dashboard/reviews', icon: MessageSquare },
        { label: 'Profile', href: '/dashboard/profile', icon: User },
        { label: 'Payment', href: '/dashboard/payment', icon: CreditCard },
        { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(href)
    }

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Image src="/logo.png" alt="NovaMart" width={32} height={32} className="w-8 h-8" />
                <span className="font-bold text-xl text-[#1E3A8A] tracking-tight">NovaMart</span>
            </div>

            <div className="flex-1 py-6 px-4 overflow-y-auto">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive(item.href)
                                    ? 'bg-blue-50 text-[#1E3A8A] shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-[#1E3A8A]' : 'text-gray-400'}`} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/30 space-y-3">
                <Link href="/">
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl text-gray-700 bg-white border-gray-200 hover:bg-gray-50 hover:text-[#1E3A8A] shadow-sm">
                        <ShoppingBag className="w-4 h-4" />
                        Back to Shop
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start gap-3 h-12 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}