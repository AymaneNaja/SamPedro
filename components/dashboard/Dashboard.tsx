'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useFetchProductsQuery } from '@/redux/productsApi'
import { useFetchCategoryQuery } from '@/redux/productsApi'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, ArrowRight, ShoppingBag, Truck, RefreshCcw, ShieldCheck } from 'lucide-react'
import Arina from "../../public/avatars/arina.jpg"
import Badr from "../../public/avatars/badr.jpg"
import Samia from "../../public/avatars/samia.jpg"
import { useRouter } from 'next/navigation'

const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
const Dashboard = () => {
    const router = useRouter()
    const { data: newArrivals, isLoading: isLoadingNewArrivals } = useFetchProductsQuery({ limit: 4 })
    const { data: popularCategory, isLoading: isLoadingPopularCategory } = useFetchCategoryQuery('laptops')
    const [heroImage, setHeroImage] = useState('')
    const [galleryImages, setGalleryImages] = useState<string[]>([])
    function getSeasonHeading() {
        const month = new Date().getMonth(); // January is 0, December is 11
        const year = new Date().getFullYear();
        let season = '';

        if (month >= 2 && month <= 4) {
            season = 'Spring';
        } else if (month >= 5 && month <= 7) {
            season = 'Summer';
        } else if (month >= 8 && month <= 10) {
            season = 'Autumn';
        } else {
            season = 'Winter';
        }

        return `${season} Collection ${year}`;
    }

    useEffect(() => {
        // Fetch hero image from Unsplash
        fetch(`https://api.unsplash.com/photos/random?query=fashion&orientation=landscape&client_id=${UNSPLASH_KEY}`)
            .then(res => res.json())
            .then(data => setHeroImage(data.urls.regular))

        // Fetch gallery images from Unsplash
        fetch(`https://api.unsplash.com/photos/random?count=6&query=lifestyle&client_id=${UNSPLASH_KEY}`)
            .then(res => res.json())
            .then(data => setGalleryImages(data.map((img: any) => img.urls.small)))
    }, [])

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            {/* Hero Section */}
            <section className="relative h-[70vh] rounded-xl overflow-hidden">
                {heroImage ? (
                    <Image src={heroImage || "/placeholder.svg"} alt="Hero" layout="fill" objectFit="cover" />
                ) : (
                    <Skeleton className="w-full h-full" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-start p-12">
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {getSeasonHeading()}
                    </motion.h1>

                    <motion.p
                        className="text-xl text-white mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Discover the hottest trends of the season
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Button size="lg">
                            Shop Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
                    { icon: RefreshCcw, title: 'Easy Returns', description: '30-day return policy' },
                    { icon: ShieldCheck, title: 'Secure Payments', description: 'Shop with confidence' },
                ].map((feature, index) => (
                    <Card key={index}>
                        <CardContent className="flex items-center p-6">
                            <feature.icon className="h-10 w-10 text-primary mr-4" />
                            <div>
                                <h3 className="font-semibold text-lg">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* New Arrivals Section */}
            <section>
                <h2 className="text-3xl font-bold mb-6">New Arrivals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoadingNewArrivals
                        ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[300px]" />)
                        : newArrivals.products?.map((product: any) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                </div>
                <div className="text-center mt-8">
                    <Button variant="outline" size="lg">
                        View All New Arrivals
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </section>

            {/* Popular Category Section */}
            <section className="bg-muted rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6">Popular in Electronics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoadingPopularCategory
                        ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[200px]" />)
                        : popularCategory.products?.map((product: any) => (
                            <Card key={product.id}>
                                <CardContent className="p-4">
                                    <Image src={product.thumbnail || "/placeholder.svg"} alt={product.title} width={200} height={200} className="rounded-lg mb-4" />
                                    <h3 className="font-semibold mb-2">{product.title}</h3>
                                    <p className="text-muted-foreground">${product.price}</p>
                                    <Button variant="secondary" className="mt-4 w-full">Add to Cart</Button>
                                </CardContent>
                            </Card>
                        ))}
                </div>
                <div className="text-center mt-8">
                    <Button variant="outline" onClick={
                        () => router.replace('/categories/laptops')
                    } size="lg">
                        Explore Electronics
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </section>

            {/* Special Offers Section */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Special Offer</h2>
                        <p className="text-xl mb-4">Get 20% off on your first purchase!</p>
                        <p className="mb-6">Use code: WELCOME20 at checkout</p>
                        <Button variant="secondary">
                            Claim Offer
                            <ShoppingBag className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <Image src="https://plus.unsplash.com/premium_photo-1728717859117-0c8f45e2dae5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fG9mZmVyfGVufDB8fDB8fHww" width={300} height={300} className="mt-6 md:mt-0" />
                </div>
            </section>



            {/* Newsletter Section */}
            <section className="bg-secondary rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-4 text-center">Subscribe to Our Newsletter</h2>
                <p className="text-center mb-6">Stay updated with our latest offers and products</p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input type="email" placeholder="Enter your email" className="flex-grow" />
                    <Button type="submit">Subscribe</Button>
                </form>
            </section>

            {/* Testimonials Section */}
            <section>
                <h2 className="text-3xl font-bold mb-6">What Our Customers Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "Badr Naja", comment: "Great products and fast shipping!", avatar: Badr.src },
                        { name: "Samia Naja", comment: "Excellent customer service. Highly recommended!", avatar: Samia.src },
                        { name: "Arina Mak", comment: "The quality of the items exceeded my expectations.", avatar: Arina.src },
                    ].map((testimonial, index) => (
                        <Card key={index}>
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-start mb-4">
                                    <div className="mr-4 flex-shrink-0">
                                        <Image
                                            src={testimonial.avatar || "/placeholder.svg"}
                                            alt={testimonial.name}
                                            width={80}
                                            height={80}
                                            className="rounded-full w-20 h-20 object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-4">{`"${testimonial.comment}"`}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            {/* Instagram-style Gallery */}
            <section>
                <h2 className="text-3xl font-bold mb-6">Shop Our Instagram</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {galleryImages.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                            <Image src={img || "/placeholder.svg"} alt={`Gallery ${index + 1}`} layout="fill" objectFit="cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button variant="secondary" size="sm">Shop Now</Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Button variant="outline" size="lg">
                        Follow Us on Instagram
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </section>
        </div>
    )
}

export default Dashboard

