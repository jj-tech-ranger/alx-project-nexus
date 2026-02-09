'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, LogOut } from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#1E3A8A] text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-blue-900">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="NovaMart Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-bold text-xl">NovaMart</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-blue-100 hover:bg-blue-900'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-blue-900">
        <div className="mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <span className="text-sm font-bold">DK</span>
          </div>
          <p className="text-sm font-semibold">David Kimani</p>
          <p className="text-xs text-blue-200">Super Admin</p>
        </div>
        <button className="flex items-center gap-2 text-blue-200 hover:text-white text-sm font-semibold w-full p-2">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
