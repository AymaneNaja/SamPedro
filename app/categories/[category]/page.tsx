"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useFetchCategoryQuery } from "@/redux/productsApi"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Filter, SortAsc, SortDesc } from 'lucide-react'

const CategoryPage = () => {
    const params = useParams()
    const category = params.category as string
    const { data: products, isLoading } = useFetchCategoryQuery(category)
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [filterPrice, setFilterPrice] = useState<number | "">("")
    const [categoryImage, setCategoryImage] = useState("")
    const [categoryAds, setCategoryAds] = useState([
        {
            title: `New ${category} Collection`,
            description: 'Discover the latest trends and styles',
            image: '',
        },
        {
            title: `${category} Clearance Sale`,
            description: 'Up to 50% off on selected items',
            image: '',
        },
    ])

    useEffect(() => {
        const fetchCategoryImage = async () => {
            try {
                const response = await fetch(
                    `https://api.unsplash.com/photos/random?query=${category}&orientation=landscape&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
                )
                const data = await response.json()
                setCategoryImage(data.urls.regular)
            } catch (error) {
                console.error("Error fetching category image:", error)
                setCategoryImage("/placeholder.svg")
            }
        }

        fetchCategoryImage()
    }, [category])

    useEffect(() => {
        const fetchCategoryAdImages = async () => {
            try {
                const adImages = await Promise.all(
                    categoryAds.map(async () => {
                        const response = await fetch(`https://api.unsplash.com/photos/random?query=${category}&orientation=landscape&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`)
                        const data = await response.json()
                        return data.urls.regular
                    })
                )
                setCategoryAds(prevAds => prevAds.map((ad, index) => ({ ...ad, image: adImages[index] })))
            } catch (error) {
                console.error('Error fetching category ad images:', error)
            }
        }

        fetchCategoryAdImages()
    }, [category])

    const sortedAndFilteredProducts = products
        ? products.products
            .filter((product) => filterPrice === "" || product.price <= Number(filterPrice))
            .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price))
        : []

    return (
        <div className="container mx-auto px-1.5 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
                    {categoryImage ? (
                        <Image src={categoryImage || "/placeholder.svg"} alt={category} layout="fill" objectFit="cover" priority />
                    ) : (
                        <Skeleton className="w-full h-full" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white capitalize">{category.replace("-", " ")}</h1>
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-3/4">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Products</h2>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    placeholder="Max Price"
                                    value={filterPrice}
                                    onChange={(e) => setFilterPrice(e.target.value ? Number(e.target.value) : "")}
                                    className="w-32"
                                />
                                <Button variant="outline" size="icon" onClick={() => setFilterPrice(filterPrice)}>
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6)
                                .fill(0)
                                .map((_, index) => (
                                    <Skeleton key={index} className="h-[300px]" />
                                ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-2 sm:gap-6">
                            {sortedAndFilteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProductCard {...product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/4 space-y-6">
                    {categoryAds.map((ad, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <Image src={ad.image || "/placeholder.svg"} alt={ad.title} width={400} height={200} className="w-full" />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
                                        <p className="text-muted-foreground mb-4">{ad.description}</p>
                                        <Button variant="outline" className="w-full">
                                            Shop Now
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-4">Subscribe for Exclusive Offers</h3>
                            <Input type="email" placeholder="Enter your email" className="mb-4" />
                            <Button className="w-full">Subscribe</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CategoryPage