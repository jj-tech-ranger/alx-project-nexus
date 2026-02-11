'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
    rating: number
    setRating?: (rating: number) => void
    readOnly?: boolean
    size?: number
}

export default function StarRating({ rating, setRating, readOnly = false, size = 5 }: StarRatingProps) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => setRating && setRating(star)}
                    className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                >
                    <Star
                        className={`w-${size} h-${size} ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    )
}