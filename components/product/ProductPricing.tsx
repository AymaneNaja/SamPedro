"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Minus, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "./FavoriteButton"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { useAddToCartMutation, useAddToFavoritesMutation } from "@/redux/productsApi" // Import addToCart function
import { useSession } from "next-auth/react"

interface ProductPricingProps {
  productId: number
  price: number
  discountPercentage: number
  isLoading?: boolean
}

export function ProductPricing({ productId, price, discountPercentage, isLoading = false }: ProductPricingProps) {
  const [quantity, setQuantity] = useState(1)
  const [addToCart] = useAddToCartMutation()
  const [addToFavorites] = useAddToFavoritesMutation()
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false) // Add state for Add to Cart
  const { data: session } = useSession()
  const discountedPrice = price - (price * discountPercentage) / 100

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity))
  }

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
      const result = await addToCart({ productId: productId.toString(), quantity: 1, price: price }).unwrap()
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

  const handleAddToFavorites = async () => {
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
      const result = await addToFavorites(productId.toString()).unwrap()
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
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline space-x-2">
        <motion.span
          className="text-3xl font-bold text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ${discountedPrice.toFixed(2)}
        </motion.span>
        {discountPercentage > 0 && (
          <>
            <span className="text-lg text-muted-foreground line-through">${price.toFixed(2)}</span>
            <Badge variant="secondary">Save {discountPercentage.toFixed(0)}%</Badge>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value))}
            className="w-16 text-center border-0"
          />
          <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleAddToCart} disabled={isAddingToCart} className="w-full">
          {" "}
          {/* Updated Add to Cart button */}
          {isAddingToCart ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding to Cart...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
        <FavoriteButton productId={productId} onAddToFavorites={handleAddToFavorites} isLoading={isAddingToFavorites} />
      </div>
    </div>
  )
}

