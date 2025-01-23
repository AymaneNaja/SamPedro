"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const { toast } = useToast()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the form data to your backend
        console.log({ name, email, message })
        toast({
            title: "Message Sent",
            description: "We'll get back to you as soon as possible.",
        })
        setName("")
        setEmail("")
        setMessage("")
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-4xl font-bold mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Contact Us
            </motion.h1>
            <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                    <p className="mb-4">
                        We'd love to hear from you. Please fill out this form and we will get in touch with you shortly.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <Input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Textarea
                            placeholder="Your Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <Button type="submit">Send Message</Button>
                    </form>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                    <div className="flex items-center space-x-4">
                        <Mail className="text-primary" />
                        <span>support@SamPedro.com</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Phone className="text-primary" />
                        <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <MapPin className="text-primary" />
                        <span>123 Cherry Lane, Fruitville, CA 90210</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

