'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { Elements } from '@stripe/react-stripe-js'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard } from 'lucide-react'
import { FaPaypal, FaApplePay, FaGooglePay } from "react-icons/fa";


// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
}

const PaymentForm = ({ amount }: { amount: number }) => {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-confirmation`,
      },
    })

    if (error) {
      console.error(error)
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
        <div>
          <RadioGroupItem value="card" id="card" className="peer sr-only" />
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <CreditCard className="mb-3 h-6 w-6" />
            Card
          </Label>
        </div>
        <div>
          <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
          <Label
            htmlFor="paypal"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <FaPaypal className="mb-3 h-6 w-6" />
            PayPal
          </Label>
        </div>
        <div>
          <RadioGroupItem value="apple-pay" id="apple-pay" className="peer sr-only" />
          <Label
            htmlFor="apple-pay"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <FaApplePay className="mb-3 h-6 w-6 scale-[2]" />
            Apple Pay
          </Label>
        </div>
        <div>
          <RadioGroupItem value="google-pay" id="google-pay" className="peer sr-only" />
          <Label
            htmlFor="google-pay"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <FaGooglePay className="mb-3 h-6 w-6 scale-[2]" />
            Google Pay
          </Label>
        </div>
      </RadioGroup>

      {paymentMethod === 'card' && (
        <div className="space-y-2 ">
          <Label htmlFor="card-element">Card Details</Label>
          <CardElement id="card-element" className="p-3 border rounded-md" />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  )
}

export function CheckoutModal({ isOpen, onClose, amount }: CheckoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
              <DialogDescription>
                Complete your purchase securely.
              </DialogDescription>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Elements stripe={stripePromise}>
                <PaymentForm amount={amount} />
              </Elements>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
