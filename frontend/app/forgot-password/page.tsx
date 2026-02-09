'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm">
        {!submitted ? (
          <>
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Reset your password</h1>
            <p className="text-gray-500 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  required
                />
              </div>

              <Button className="w-full bg-[#8B5CF6] hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold">
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href="/login" className="flex items-center gap-2 text-[#8B5CF6] hover:text-purple-700 font-semibold text-sm">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-500 mb-8">
              We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>
            </p>
            <p className="text-sm text-gray-600 mb-8">
              Didn't receive it? Check your spam folder or <button className="text-[#8B5CF6] hover:text-purple-700 font-semibold">try again</button>
            </p>

            <Link href="/login" className="block">
              <Button className="w-full bg-[#8B5CF6] hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold">
                Back to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
