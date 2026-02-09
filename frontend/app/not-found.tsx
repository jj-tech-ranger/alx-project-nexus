import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="relative w-64 h-64 mb-8 opacity-50">
          <Image
              src="/placeholder.svg"
              alt="404 Illustration"
              fill
              className="object-contain"
              priority
          />
        </div>

        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className="flex gap-4">
          <Link href="/">
            <Button className="bg-[#1E3A8A] hover:bg-blue-900">
              Back to Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
  )
}