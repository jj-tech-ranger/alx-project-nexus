'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Star, Upload } from 'lucide-react'

interface ReviewModalProps {
  isOpen: boolean
  productName: string
  onClose: () => void
}

export default function ReviewModal({ isOpen, productName, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
      setRating(0)
      setReview('')
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">Write a Review</h2>

        {!submitted ? (
          <>
            {/* Product Info */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{productName}</p>
                <p className="text-sm text-gray-500">Purchased on Oct 24, 2023</p>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-8">
              <p className="font-semibold text-gray-900 mb-4">How was your experience?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Your Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us what you liked or didn't like about this product..."
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-sans text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Photo Upload */}
            <div className="mb-8">
              <p className="font-semibold text-gray-900 mb-4">Add Photos or Video</p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-semibold text-gray-900">Click to upload</p>
                <p className="text-xs text-gray-500">or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button onClick={onClose} className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-xl font-semibold">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-[#8B5CF6] hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold">
                Submit Review
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-xl font-bold text-gray-900">Thank you for your review!</p>
            <p className="text-gray-500 mt-2">Your review has been submitted successfully.</p>
          </div>
        )}
      </div>
    </div>
  )
}
