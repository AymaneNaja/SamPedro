"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useFetchProductsQuery } from "@/redux/productsApi"
import { useFetchCategoryQuery } from "@/redux/productsApi"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
    Star,
    ArrowRight,
    ShoppingBag,
    Truck,
    RefreshCcw,
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    Gift,
    Clock,
    Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/autoplay"

const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

const Dashboard = () => {
    const router = useRouter()
    const { data: newArrivals, isLoading: isLoadingNewArrivals } = useFetchProductsQuery({ limit: 8 })
    const { data: popularCategory, isLoading: isLoadingPopularCategory } = useFetchCategoryQuery("laptops")
    const [heroImages, setHeroImages] = useState<string[]>([])
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        fetch(
            `https://api.unsplash.com/photos/random?query=fashion&count=3&orientation=landscape&client_id=${UNSPLASH_KEY}`,
        )
            .then((res) => res.json())
            .then((data) => setHeroImages(data.map((img: any) => img.urls.regular)))
    }, [])

    useEffect(() => {
        // Function to add one month to a given date
        const addOneMonth = (date) => {
            const newDate = new Date(date); // Copy the date to avoid modifying the original
            newDate.setMonth(newDate.getMonth() + 1);

            // Handle edge cases for months with fewer days
            if (newDate.getDate() < date.getDate()) {
                newDate.setDate(0); // Set to the last day of the previous month
            }

            return newDate;
        };

        // Set the end date (1 month from today)
        const today = new Date();
        const endDate = addOneMonth(today);

        const endTime = endDate.getTime(); // Get the end date in milliseconds

        const timer = setInterval(() => {
            const now = new Date().getTime(); // Get the current time in milliseconds
            const distance = endTime - now; // Calculate the remaining time

            // Stop the timer if the countdown is over
            if (distance <= 0) {
                clearInterval(timer);
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            // Update the countdown state
            setCountdown({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(timer);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    }

    return (
        <div className="container mx-auto  py-8 space-y-12">
            {/* Hero Section */}
            <section className="relative rounded-xl overflow-hidden shadow-lg">
                <Swiper
                    modules={[Autoplay, Navigation]}

                    autoplay={{ delay: 5000 }}
                    loop={true}
                    className="h-[50vh] md:h-[70vh]"
                >
                    {heroImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative h-full w-full">
                                <Image src={image || "/placeholder.svg"} alt={`Hero ${index + 1}`} layout="fill" objectFit="cover" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent flex flex-col justify-center items-start p-6 md:p-12">
                                    <motion.h1
                                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        Discover Your Style
                                    </motion.h1>
                                    <motion.p
                                        className="text-lg md:text-xl text-white mb-6 md:mb-8 max-w-md"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        Explore our latest collection and find the perfect look for you.
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                    >
                                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                                            Shop Now
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
                    { icon: RefreshCcw, title: "Easy Returns", description: "30-day return policy" },
                    { icon: ShieldCheck, title: "Secure Payments", description: "Shop with confidence" },
                ].map((feature, index) => (
                    <motion.div key={index} {...fadeInUp} transition={{ delay: index * 0.1 }}>
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="flex items-center p-6">
                                <feature.icon className="h-10 w-10 text-primary mr-4 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </section>

            {/* New Arrivals Section */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">New Arrivals</h2>
                    <Button variant="ghost" onClick={() => router.push("/products")} className="text-primary">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {isLoadingNewArrivals
                        ? Array(4)
                            .fill(0)
                            .map((_, i) => <Skeleton key={i} className="h-[300px]" />)
                        : newArrivals?.products?.slice(0, 4).map((product: any) => (
                            <motion.div key={product.id} {...fadeInUp}>
                                <ProductCard {...product} />
                            </motion.div>
                        ))}
                </div>
            </section>

            {/* Flash Sale Section */}
            <section className="bg-muted text-gray-900 dark:text-white rounded-xl p-6 md:p-8 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-4">Flash Sale!</h2>
                        <p className="text-xl mb-4">Up to 70% off on selected items</p>
                        <div className="flex justify-center md:justify-start space-x-4 mb-6">
                            {Object.entries(countdown).map(([unit, value]) => (
                                <div
                                    key={unit}
                                    className="text-center bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-20 rounded-lg p-2 shadow-sm"
                                >
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {value}
                                    </div>
                                    <div className="text-xs uppercase text-gray-600 dark:text-gray-300">
                                        {unit}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full md:w-auto bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Shop Flash Sale
                            <Zap className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="w-full md:w-1/2 h-64 relative rounded-lg overflow-hidden shadow-xl">
                        <Image
                            src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                            alt="Flash Sale"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>
            </section>

            {/* Popular Category Section */}
            <section className="bg-muted rounded-xl p-6 md:p-8 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Popular in Electronics</h2>
                    <Button variant="ghost" onClick={() => router.push("/categories/laptops")} className="text-primary">
                        Explore More <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoadingPopularCategory
                        ? Array(3)
                            .fill(0)
                            .map((_, i) => <Skeleton key={i} className="h-[300px]" />)
                        : popularCategory?.products?.slice(0, 3).map((product: any) => (
                            <motion.div key={product.id} {...fadeInUp}>
                                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-4 flex flex-col h-full">
                                        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                                            <Image
                                                src={product.thumbnail || "/placeholder.svg"}
                                                alt={product.title}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2 flex-grow">{product.title}</h3>
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-bold text-primary">${product.price}</p>
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/product/${product.id}`)}>
                                                check it out!
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-secondary rounded-xl p-6 md:p-8 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Stay Updated</h2>
                <p className="text-center mb-6 text-muted-foreground">
                    Subscribe to our newsletter for exclusive offers and updates
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input type="email" placeholder="Enter your email" className="flex-grow" />
                    <Button type="submit" className="w-full sm:w-auto">
                        Subscribe
                    </Button>
                </form>
            </section>

            {/* Testimonials Section */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-center">What Our Customers Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            name: "Badr Naja",
                            comment: "Great products and fast shipping! The customer service team was very helpful.",
                            avatar: "/avatars/badr.jpg",
                        },
                        {
                            name: "Samia Naja",
                            comment: "Excellent customer service. They went above and beyond to ensure I was satisfied.",
                            avatar: "/avatars/samia.jpg",
                        },
                        {
                            name: "Arina Mak",
                            comment: "The quality of the items exceeded my expectations. I've been a loyal customer for years.",
                            avatar: "/avatars/arina.jpg",
                        },
                    ].map((testimonial, index) => (
                        <motion.div key={index} {...fadeInUp} transition={{ delay: index * 0.1 }}>
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex items-center mb-4">
                                        <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md">
                                            <Image
                                                src={testimonial.avatar || "/placeholder.svg"}
                                                alt={testimonial.name}
                                                width={80}
                                                height={80}
                                                className="rounded-full object-cover"
                                                priority // Ensures the image is loaded with high priority
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-lg">{testimonial.name}</p>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground flex-grow text-base">{testimonial.comment}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>


        </div>
    )
}

export default Dashboard

