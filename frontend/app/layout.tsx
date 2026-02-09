import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { CartProvider } from '@/lib/cart-context'
import { UserProvider } from '@/lib/user-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
    themeColor: '#1E3A8A',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export const metadata: Metadata = {
    title: 'Nova Mart | Premium Electronics',
    description: 'Best electronics store in Nairobi',
    manifest: '/manifest.json',
    icons: {
        icon: '/icon-192x192.png',
        apple: '/icon-512x512.png',
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <UserProvider>
            <CartProvider>
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </div>
                <Toaster />
            </CartProvider>
        </UserProvider>
        </body>
        </html>
    )
}