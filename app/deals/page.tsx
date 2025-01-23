"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Tag } from "lucide-react"

// Simulated API call for special deals
const fetchSpecialDeals = () => {
    return new Promise<any[]>((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: "Summer Dress",
                    description: "Beautiful summer dress perfect for any occasion.",
                    price: 39.99,
                    discountPercentage: 20,
                    rating: 4.5,
                    stock: 50,
                    brand: "SummerChic",
                    category: "Clothing",
                    thumbnail: "https://images.unsplash.com/photo-1520026582657-4daf5bb60adb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D",
                    tags: ["summer", "dress", "fashion"],
                },
                {
                    id: 2,
                    title: "Wireless Earbuds",
                    description: "High-quality wireless earbuds with noise cancellation.",
                    price: 79.99,
                    discountPercentage: 30,
                    rating: 4.8,
                    stock: 30,
                    brand: "AudioTech",
                    category: "Electronics",
                    thumbnail: "https://images.unsplash.com/photo-1520367194755-04464b9ce44b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWQlMjBoZWFkcGhvbmVzfGVufDB8fDB8fHww",
                    tags: ["audio", "wireless", "earbuds"],
                },
                {
                    id: 3,
                    title: "Smart Watch",
                    description: "Feature-packed smartwatch with health tracking capabilities.",
                    price: 129.99,
                    discountPercentage: 25,
                    rating: 4.6,
                    stock: 20,
                    brand: "TechWear",
                    category: "Electronics",
                    thumbnail: "https://images.unsplash.com/photo-1461141346587-763ab02bced9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
                    tags: ["smartwatch", "fitness", "tech"],
                },
                {
                    id: 4,
                    title: "Leather Bag",
                    description: "Stylish and durable leather bag for everyday use.",
                    price: 89.99,
                    discountPercentage: 15,
                    rating: 4.3,
                    stock: 40,
                    brand: "LuxeLeather",
                    category: "Accessories",
                    thumbnail: "https://plus.unsplash.com/premium_photo-1672829371769-bcff266023a4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGVhdGhlciUyMGJhZ3xlbnwwfHwwfHx8MA%3D%3D",
                    tags: ["bag", "leather", "fashion"],
                },
            ])
        }, 1000)
    })
}

export default function SpecialDealsPage() {
    const [deals, setDeals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState("")
    const { data: session } = useSession()
    const { toast } = useToast()

    useEffect(() => {
        fetchSpecialDeals().then((data) => {
            setDeals(data)
            setLoading(false)
        })
    }, [])

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the email to your backend
        toast({
            title: "Subscribed!",
            description: "You'll now receive our special deals newsletter.",
        })
        setEmail("")
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-4xl font-bold mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Special Deals
            </motion.h1>

            <motion.div
                className="bg-primary text-primary-foreground p-8 rounded-lg mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold mb-4">Limited Time Offers!</h2>
                <p className="mb-4">{`Don't miss out on these exclusive deals. Subscribe to our newsletter for more!`}</p>
                <form onSubmit={handleSubscribe} className="flex gap-4">
                    <div className="flex-grow">
                        <Label htmlFor="email" className="sr-only">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit">Subscribe</Button>
                </form>
            </motion.div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : deals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {deals.map((deal, index) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ProductCard {...deal} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground">No special deals available at the moment.</p>
            )}

            {session && (
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">Exclusive Member Offer</h2>
                    <div className="bg-secondary text-secondary-foreground p-6 rounded-lg inline-block">
                        <Tag className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-lg font-bold">Use code MEMBER20 for an extra 20% off!</p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

