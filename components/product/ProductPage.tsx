"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductImages } from "@/components/product/ProductImages"
import { ProductInfo } from "@/components/product/ProductInfo"
import { ProductPricing } from "@/components/product/ProductPricing"
import { ProductReviews } from "@/components/product/ProductReviews"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { useToast } from "@/hooks/use-toast"
import { useFetchSingleProductQuery, useAddToCartMutation, useAddToFavoritesMutation } from "@/redux/productsApi"
import { ProductSkeleton } from "@/components/product/ProductSkeleton"

export default function ProductPage() {
    const { id } = useParams()
    const { data: session } = useSession()
    const { data: product, isLoading, error } = useFetchSingleProductQuery(id)
    const [addToCart] = useAddToCartMutation()
    const [addToFavorites] = useAddToFavoritesMutation()
    const { toast } = useToast()

    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)


    const handleAddToCart = async () => {
        if (!session?.user?.id) {
            toast({
                title: "Authentication required",
                description: "Please sign in to add items to cart.",
                variant: "destructive",
            })
            return
        }

        setIsAddingToCart(true)
        try {
            const result = await addToCart({ productId: product.id.toString(), quantity: 1, price: product.price }).unwrap()
            if (result.error) {
                throw new Error(result.error)
            }
            toast({
                title: "Added to cart",
                description: "The item has been added to your cart.",
            })
        } catch (error) {
            console.error("Error adding to cart:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "There was an error adding the item to cart.",
                variant: "destructive",
            })
        } finally {
            setIsAddingToCart(false)
        }
    }

    const handleAddToFavorites = async (id) => {
        if (!session?.user?.id) {
            toast({
                title: "Authentication required",
                description: "Please sign in to add items to favorites.",
                variant: "destructive",
            })
            return
        }

        setIsAddingToFavorites(true)
        try {
            const result = await addToFavorites(id.toString()).unwrap()
            if (result.error) {
                throw new Error(result.error)
            }
            toast({
                title: "Added to favorites",
                description: "The item has been added to your favorites.",
            })
        } catch (error) {
            console.error("Error adding to favorites:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "There was an error adding the item to favorites.",
                variant: "destructive",
            })
        } finally {
            setIsAddingToFavorites(false)
        }
    }

    if (isLoading) {
        return <ProductSkeleton />
    }

    if (error) {
        return <div>Error loading product</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2">
                    <ProductImages images={product.images} title={product.title} />
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                    <ProductInfo {...product} />
                    <ProductPricing
                        productId={product.id}
                        price={product.price}
                        discountPercentage={product.discountPercentage}
                        stock={product.stock}
                        onAddToCart={handleAddToCart}
                        onAddToFavorites={handleAddToFavorites}
                        isAddingToCart={isAddingToCart}
                        isAddingToFavorites={isAddingToFavorites}
                    />
                    <Tabs defaultValue="description" className="mt-8">
                        <TabsList className="w-full">
                            <TabsTrigger value="description" className="flex-1">
                                Description
                            </TabsTrigger>
                            <TabsTrigger value="reviews" className="flex-1">
                                Reviews
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="description">
                            <p>{product.description}</p>
                        </TabsContent>
                        <TabsContent value="reviews">
                            <ProductReviews reviews={product.reviews} rating={product.rating} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <div className="mt-12">
                <RelatedProducts category={product.category} currentProductId={product.id} />
            </div>
        </div>
    )
}

