"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useUser } from '@/lib/user-context'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login')
            } else if (!user.is_staff) {
                router.push('/dashboard')
            }
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-[#1E1E2E]" />
            </div>
        )
    }

    if (!user || !user.is_staff) return null

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50 bg-[#1E1E2E]">
                <AdminSidebar />
            </aside>
            <main className="flex-1 md:pl-64 min-h-screen transition-all duration-300">
                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}