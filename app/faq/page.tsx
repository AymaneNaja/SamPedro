"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"

const faqs = [
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and Apple Pay.",
    },
    {
        question: "How long does shipping take?",
        answer:
            "Shipping typically takes 3-5 business days for domestic orders and 7-14 business days for international orders.",
    },
    {
        question: "Do you offer free returns?",
        answer: "Yes, we offer free returns within 30 days of purchase for all items in their original condition.",
    },
    {
        question: "Are your products cruelty-free?",
        answer: "Yes, all of our products are cruelty-free and we never test on animals.",
    },
    {
        question: "Do you ship internationally?",
        answer:
            "Yes, we ship to most countries worldwide. Shipping costs and delivery times may vary depending on the destination.",
    },
    {
        question: "How can I track my order?",
        answer:
            "Once your order has been shipped, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier's website.",
    },
]

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-4xl font-bold mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Frequently Asked Questions
            </motion.h1>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
            >
                <Input
                    type="search"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md mx-auto"
                />
            </motion.div>
            <Accordion type="single" collapsible className="max-w-2xl mx-auto">
                {filteredFaqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                    </motion.div>
                ))}
            </Accordion>
        </div>
    )
}

