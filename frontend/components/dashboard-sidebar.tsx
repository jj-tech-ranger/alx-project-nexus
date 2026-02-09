'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useUser } from '@/lib/user-context'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useUser()

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Orders', href: '/dashboard/orders', icon: '📦' },
    { label: 'Saved Items', href: '/dashboard/saved-items', icon: '❤️' },
    { label: 'Addresses', href: '/dashboard/addresses', icon: '📍' },
    { label: 'Profile Settings', href: '/dashboard/profile', icon: '⚙️' },
    { label: 'Payment Methods', href: '/dashboard/payment', icon: '💳' },
  ]

  const isActive = (href: string) => {
    return pathname === href || (href === '/dashboard' && pathname === '/dashboard')
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 h-full sticky top-20">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Image
          src="/logo.png"
          alt="NovaMart Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <span className="font-bold text-lg text-[#1E3A8A]">NovaMart</span>
      </Link>
      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(item.href)
                ? 'bg-blue-50 text-[#1E3A8A] font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </aside>
  )
}
