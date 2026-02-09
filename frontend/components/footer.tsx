'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
      <footer className="bg-[#1F2937] text-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image
                    src="/logo.png"
                    alt="NovaMart Logo"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                />
                <h3 className="text-white font-bold text-lg">NovaMart</h3>
              </div>
              <p className="text-sm">
                Your premium destination for the latest electronics and gadgets in Nairobi. Quality guaranteed, fast delivery.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">SHOP</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/search?category=laptops" className="hover:text-white transition">Laptops</Link></li>
                <li><Link href="/search?category=smartphones" className="hover:text-white transition">Smartphones</Link></li>
                <li><Link href="/search?category=accessories" className="hover:text-white transition">Accessories</Link></li>
                <li><Link href="/search?category=deals" className="hover:text-white transition">Deals</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">SUPPORT</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition">Order Status</Link></li>
                <li><Link href="#" className="hover:text-white transition">Returns</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">LEGAL</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 NovaMart Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}