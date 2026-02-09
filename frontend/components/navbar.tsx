'use client'

import React, { useState } from "react"
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Search, LogOut, LayoutDashboard, Menu } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useUser } from '@/lib/user-context'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { cartCount } = useCart()
  const { user, logout } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
      <nav className="sticky top-0 z-50 bg-[#1E3A8A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 whitespace-nowrap min-w-fit">
              <div className="relative w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                {/* Use a text fallback if image fails, or use your logo file */}
                <span className="text-[#1E3A8A] font-bold">N</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">NovaMart</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full">
                <Input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-blue-900/50 border-blue-700 text-white placeholder:text-blue-300 focus-visible:ring-blue-400 rounded-full pl-4 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-blue-200 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4">

              {/* User Menu */}
              {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-blue-800 text-white rounded-full">
                        <User className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span>{user.username}</span>
                          <span className="text-xs font-normal text-gray-500">{user.email}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" /> Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                  <Link href="/login">
                    <Button variant="ghost" className="hover:bg-blue-800 text-white hidden sm:flex">
                      Login
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-blue-800 text-white sm:hidden">
                      <User className="w-5 h-5" />
                    </Button>
                  </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="hover:bg-blue-800 text-white rounded-full">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-[#8B5CF6] text-white text-[10px] px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-[#1E3A8A]">
                        {cartCount}
                      </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar (Visible only on small screens) */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-blue-900/50 border-blue-700 text-white placeholder:text-blue-300 rounded-lg h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-blue-300" />
            </form>
          </div>
        </div>
      </nav>
  )
}