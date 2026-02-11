'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Search, Menu, User, LogOut, LayoutDashboard, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { useUser } from '@/lib/user-context'
import DashboardSidebar from '@/components/dashboard-sidebar'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { cartCount } = useCart()
  const { user, logout } = useUser()

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/admin')
  if (isAuthPage) return null

  return (
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <DashboardSidebar />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="NovaMart" width={32} height={32} className="w-8 h-8" />
              <span className="font-bold text-xl text-[#1E3A8A] tracking-tight">NovaMart</span>
            </Link>
          </div>

          {/* Center: Search (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/search?q=${e.currentTarget.value}`)
                    }
                  }}
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 text-gray-600 hover:text-[#1E3A8A]">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
                )}
              </Button>
            </Link>

            {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-gray-200 hover:border-[#8B5CF6]">
                      {/* Avatar Placeholder */}
                      <div className="h-8 w-8 bg-blue-100 flex items-center justify-center text-[#1E3A8A] font-bold text-xs">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> User Dashboard
                    </DropdownMenuItem>
                    {user.is_staff && (
                        <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
                          <Settings className="mr-2 h-4 w-4" /> Admin Dashboard
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link href="/login">
                  <Button className="bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-full px-6">
                    Sign In
                  </Button>
                </Link>
            )}
          </div>
        </div>
      </header>
  )
}