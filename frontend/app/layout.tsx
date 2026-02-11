import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/lib/cart-context";
import { UserProvider } from "@/lib/user-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "NovaMart | Premium Electronics Store",
    description: "Shop the best electronics in Kenya. Fast delivery, secure payments, and premium products.",
    icons: {
        icon: "/favicon.png",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <UserProvider>
            <CartProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                    <Toaster />
                </ThemeProvider>
            </CartProvider>
        </UserProvider>
        </body>
        </html>
    );
}