"use client"

import { motion } from "framer-motion"
import { Truck, RefreshCw } from "lucide-react"

export default function ShippingAndReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-4xl font-bold mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Shipping & Returns
            </motion.h1>
            <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <Truck className="mr-2 text-primary" />
                        Shipping Policy
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Free standard shipping on orders over $50</li>
                        <li>Standard shipping (3-5 business days): $5.99</li>
                        <li>Express shipping (1-2 business days): $12.99</li>
                        <li>International shipping available to select countries</li>
                        <li>All orders are processed within 1-2 business days</li>
                    </ul>
                    <p className="mt-4">
                        Once your order has been shipped, you will receive a confirmation email with tracking information. Please
                        allow up to 24 hours for tracking information to update.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <RefreshCw className="mr-2 text-primary" />
                        Returns Policy
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>30-day return policy for all unused items</li>
                        <li>Free returns on all U.S. orders</li>
                        <li>Items must be in original packaging with tags attached</li>
                        <li>Refunds will be issued to the original payment method</li>
                        <li>Exchanges are available for different sizes or colors</li>
                    </ul>
                    <p className="mt-4">
                        To initiate a return, please log into your account and select the items you wish to return. Print the
                        prepaid return label and drop off your package at any authorized shipping location.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

