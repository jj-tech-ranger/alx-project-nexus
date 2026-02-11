"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, User as UserIcon, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { useUser } from '@/lib/user-context'

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { register: registerUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await registerUser(values.username, values.email, values.password)
      toast({
        title: "Account created!",
        description: "Welcome to NovaMart.",
      })
      router.push('/')
    } catch (error: unknown) {
      console.error("Registration error:", error)
      let errorMessage = "Something went wrong."
      if (error instanceof Error) errorMessage = error.message

      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="w-full min-h-screen flex items-center justify-center lg:grid lg:grid-cols-2">

        {/* LEFT SIDE: Image & Branding */}
        <div className="hidden lg:flex relative h-full flex-col justify-between p-10 text-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                alt="Shopping Experience"
                fill
                className="object-cover opacity-20 bg-[#1E3A8A]"
                priority
            />
            <div className="absolute inset-0 bg-[#1E3A8A]/80 mix-blend-multiply" />
          </div>

          {/* Content on top of image */}
          <div className="relative z-10 flex items-center gap-2">
            {/* LOGO HERE */}
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="NovaMart Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl font-bold">NovaMart</span>
          </div>

          <div className="relative z-10 space-y-4 max-w-md">
            <h1 className="text-4xl font-bold tracking-tight">Join the future of shopping.</h1>
            <p className="text-blue-100 text-lg">
              Create an account to track orders, save items to your wishlist, and get personalized recommendations.
            </p>
          </div>

          <div className="relative z-10 text-sm text-blue-200">
            © 2026 NovaMart Inc. All rights reserved.
          </div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="flex items-center justify-center p-8 bg-white">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-[#1E3A8A]">Create an account</h1>
              <p className="text-gray-500">Enter your details below to start shopping</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input placeholder="johndoe" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input placeholder="m@example.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#1E3A8A] hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
  )
}