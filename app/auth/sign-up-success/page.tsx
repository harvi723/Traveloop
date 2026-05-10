'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mail, Plane, ArrowLeft } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <Link href="/" className="inline-flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Plane className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Traveloop</span>
        </Link>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Mail className="w-10 h-10 text-primary" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-muted-foreground mb-8">
          {"We've sent you a confirmation link to verify your email address. Please check your inbox and click the link to complete your registration."}
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full h-12">
            <Link href="/auth/login">Back to sign in</Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          {"Didn't receive the email? Check your spam folder or"}{' '}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            try again
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
