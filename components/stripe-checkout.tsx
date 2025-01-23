'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'

// Replace with your Stripe publishable key
const stripePromise = loadStripe('sk_test_51QgUFWAzruxThKXlBiZHlPZAI2HcIeHL1M9csEunlkNq9wI0w8CAYd9OnYKoBVhwYeRbnCN8P9qhznXBYB2hbD8j00GdaPQCRZ')

export function StripeCheckout({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const stripe = await stripePromise
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      })

      const session = await response.json()

      const result = await stripe!.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        console.error(result.error.message)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Processing...' : 'Proceed to Checkout'}
    </Button>
  )
}

