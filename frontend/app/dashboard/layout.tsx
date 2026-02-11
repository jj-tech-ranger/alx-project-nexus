"use client"

import React from 'react'
import DashboardSidebar from '@/components/dashboard-sidebar'

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50 border-r border-gray-200 bg-white">
                <DashboardSidebar />
            </aside>

            <main className="flex-1 md:pl-64 flex flex-col min-h-screen pt-20">
                <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}