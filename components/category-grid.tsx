"use client"

import { useState, useEffect } from "react"
import { useFetchCategoriesQuery } from "@/redux/productsApi"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
    typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str)

export function CategoryGrid() {
    const { data: categories, isLoading, error } = useFetchCategoriesQuery("")
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (categories) {
            const imagePromises = categories.map((category: string) =>
                fetch(`https://source.unsplash.com/featured/?${encodeURIComponent(category)}`).then((res) => res.url),
            )
            Promise.all(imagePromises).then((urls) => {
                const newLoadedImages: Record<string, boolean> = {}
                categories.forEach((category: string, index: number) => {
                    newLoadedImages[category] = true
                })
                setLoadedImages(newLoadedImages)
            })
        }
    }, [categories])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>Error loading categories. Please try again later.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 md:gap-6">
            <AnimatePresence>
                {categories?.map((category: { name: string, image: string }, index: number) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: index * 0.1,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href={`/categories/${category.name}`}>
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-0">
                                    <div className="relative aspect-square">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-75" />
                                        <Image
                                            priority
                                            src={category.image || "/placeholder.svg"}
                                            alt={category.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-all duration-300 filter grayscale hover:grayscale-0"
                                            placeholder="blur"
                                            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 opacity-100 hover:opacity-0">
                                            <motion.h2
                                                className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center px-2 sm:px-4 drop-shadow-lg"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                {category.name}
                                            </motion.h2>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

