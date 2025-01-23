'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
        </motion.div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-5xl">Oops! Something went wrong</h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">We apologize for the inconvenience. Our team has been notified and is working on a fix.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <a href="/">Go back home</a>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

