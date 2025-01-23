"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchProductsQuery } from "@/redux/productsApi"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Playfair_Display } from "next/font/google"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/use-debounce"

const playfair = Playfair_Display({ subsets: ["latin"] })

interface ProductCardProps {
    id: number
    title: string
    description: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    brand: string
    category: string
    thumbnail: string
    tags: string[]
}

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const {
        data: searchResults,
        isLoading,
        isFetching,
    } = useSearchProductsQuery(debouncedSearchTerm, {
        skip: debouncedSearchTerm === "",
    })

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    const clearSearch = () => {
        setSearchTerm("")
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className={`text-5xl font-bold mb-6 text-center ${playfair.className}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                SamPedro
            </motion.h1>
            <motion.p
                className={`text-xl text-slate-700 dark:text-slate-200 max-w-lg mx-auto  text-slate font-semibold mb-12  text-center ${playfair.className}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >Your Style, Your Store
                Explore premium products, top brands, and unbeatable prices. SamPedro is where quality meets convenience.
            </motion.p>

            <motion.div
                className="max-w-2xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <form onSubmit={handleSearch} className="relative">
                    <Input
                        type="search"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-12 py-5 text-lg rounded-lg outline-none shadow-sm border-2 border-gray-100 focus:border-primary focus:ring-0"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    {searchTerm && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={clearSearch}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </form>
            </motion.div>

            <AnimatePresence mode="wait">
                {isLoading || isFetching ? (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                            {Array(6)
                                .fill(0)
                                .map((_, index) => (
                                    <Skeleton key={index} className="h-[400px]" />
                                ))}
                        </div>
                    </motion.div>
                ) : searchResults && searchResults.products && searchResults.products.length > 0 ? (
                    <motion.div
                        key="results"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            visible: { transition: { staggerChildren: 0.05 } },
                            hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                        }}
                    >
                        {searchResults.products.map((product: ProductCardProps) => (
                            <motion.div
                                key={product.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                <ProductCard
                                    id={product.id}
                                    title={product.title}
                                    description={product.description}
                                    price={product.price}
                                    discountPercentage={product.discountPercentage}
                                    rating={product.rating}
                                    stock={product.stock}
                                    brand={product.brand}
                                    category={product.category}
                                    thumbnail={product.thumbnail}
                                    tags={product.category ? [product.category] : []}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : debouncedSearchTerm !== "" ? (
                    <motion.div
                        key="no-results"
                        className="text-center mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <p className="text-2xl font-semibold text-muted-foreground mb-4">No products found</p>
                        <p className="text-muted-foreground mb-8">
                            Try adjusting your search or browse our categories for inspiration.
                        </p>
                        <Button onClick={clearSearch}>Clear Search</Button>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

