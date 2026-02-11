'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Star, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([])

    useEffect(() => {
        apiClient.getAllReviews().then(setReviews)
    }, [])

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Rating</th>
                        <th className="px-6 py-3">Comment</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {reviews.map((review) => (
                        <tr key={review.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">Product #{review.product}</td>
                            <td className="px-6 py-4 flex items-center gap-2">
                                {review.user_avatar && <img src={review.user_avatar} className="w-6 h-6 rounded-full" />}
                                {review.user_name || 'Anonymous'}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-0.5">
                                    {Array.from({length: review.rating}).map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{review.comment}</td>
                            <td className="px-6 py-4 text-gray-400">{new Date(review.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right">
                                <Link href={`/product/view-product-${review.product}`} target="_blank">
                                    <Button variant="ghost" size="sm" className="h-8">
                                        <ExternalLink className="w-4 h-4 mr-1" /> View Product
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}