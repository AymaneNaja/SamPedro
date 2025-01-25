"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, SortAsc, SortDesc } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { useFetchProductsQuery, useFetchCategoriesQuery } from "@/redux/productsApi"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [selectedCategory, setSelectedCategory] = useState("all")

    const { data: productsData, isLoading, isFetching, isError } = useFetchProductsQuery(page)
    const { data: categories } = useFetchCategoriesQuery("")

    const { ref, inView } = useInView({
        threshold: 0,
    })

    useEffect(() => {
        if (inView && !isLoading && !isFetching && productsData && productsData.products.length < productsData.total) {
            setPage((prevPage) => prevPage + 1)
        }
    }, [inView, isLoading, isFetching, productsData])

    const allProducts = productsData ? productsData.products : []

    const filteredProducts = allProducts
        .filter(
            (product) =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                product.price >= priceRange[0] &&
                product.price <= priceRange[1] &&
                (selectedCategory === "all" || product.category === selectedCategory),
        )
        .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price))

    return (
        <div className="w-full sm:container mx-auto px-1 py-8">
            <motion.h1
                className="text-4xl font-bold mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Our Products
            </motion.h1>

            <motion.div
                className="mb-8 flex flex-col md:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-1/3"
                />
                <Select onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger className="md:w-1/4">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories &&
                            categories.map((category: string, index: number) => (
                                <SelectItem key={index} value={category.name}>
                                    {category.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-2 md:w-1/3">
                    <span>Price:</span>
                    <Slider min={0} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} />
                    <span>${priceRange[0]}</span>
                    <span>-</span>
                    <span>${priceRange[1]}</span>
                </div>
                <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
            </motion.div>

            <AnimatePresence>
                {isError ? (
                    <motion.p
                        className="text-center text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        Error loading products. Please try again later.
                    </motion.p>
                ) : filteredProducts.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-2 sm:gap-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.05 } },
                        }}
                    >
                        {filteredProducts.map((product, index) => (
                            <motion.div

                                key={product.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                <ProductCard {...product} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.p
                        className="text-center text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        No products found matching your criteria.
                    </motion.p>
                )}
            </AnimatePresence>

            {(isLoading || isFetching) && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1 mt-10">
                    {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton key={index} className="h-[300px] lg:h-[350px] " />
                        ))}
                </div>
            )}

            <div ref={ref} className="h-20" />
        </div>
    )
}

