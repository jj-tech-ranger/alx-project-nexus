'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    BarChart3,
    Package,
    ShoppingCart,
    Users,
    LogOut,
    MessageSquare,
    Settings
} from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { Button } from '@/components/ui/button'

export default function AdminSidebar() {
    const pathname = usePathname()
    const { logout } = useUser()

    const navItems = [
        { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { label: 'Customers', href: '/admin/customers', icon: Users },
        { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    const isActive = (href: string) => pathname.startsWith(href)

    return (
        <div className="flex flex-col h-full bg-[#1E1E2E] text-gray-300 border-r border-gray-800">
            <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm">
                    <Image src="/logo.png" alt="Admin" width={24} height={24} className="w-6 h-6" />
                </div>
                <div>
                    <span className="font-bold text-white tracking-wide block leading-none">NovaMart</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8B5CF6] font-bold">Admin Portal</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Management</p>
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                isActive(item.href)
                                    ? 'bg-[#8B5CF6] text-white shadow-lg shadow-purple-900/20'
                                    : 'hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${
                                isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-white'
                            }`} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-800 bg-black/20">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start gap-3 h-10 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}