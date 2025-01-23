'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentModalProps {
    isOpen: boolean
    onClose: () => void
    amount: number
}

const CheckoutForm = ({ amount, onClose }: { amount: number; onClose: () => void }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState<string | null>(null)
    const [processing, setProcessing] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setProcessing(true)

        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)!,
        })

        if (stripeError) {
            setError(stripeError.message || 'An error occurred')
            setProcessing(false)
        } else {
            // Here you would typically send the paymentMethod.id to your server
            // to complete the payment. For this example, we'll just simulate a successful payment.
            console.log('Payment successful:', paymentMethod)
            setProcessing(false)
            onClose()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 dark:text-wh">
            <div className="space-y-2">
                <Label htmlFor="card-element">Card Details</Label>
                <CardElement id="card-element" className="p-3 border rounded-md" />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" disabled={!stripe || processing} className="w-full">
                {processing ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.CreditCard className="mr-2 h-4 w-4" />
                )}
                Pay ${amount.toFixed(2)}
            </Button>
        </form>
    )
}

export function StripePaymentModal({ isOpen, onClose, amount }: StripePaymentModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DialogHeader>
                                <DialogTitle>Complete Your Payment</DialogTitle>
                                <DialogDescription>
                                    Enter your card details to process the payment securely.
                                </DialogDescription>
                            </DialogHeader>
                            <Elements stripe={stripePromise}>
                                <CheckoutForm amount={amount} onClose={onClose} />
                            </Elements>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}
