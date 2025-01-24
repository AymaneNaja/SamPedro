"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useAddToCartMutation, useAddToFavoritesMutation } from "@/redux/productsApi"

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

export function ProductCard({
  id,
  title,
  description,
  price,
  discountPercentage,
  rating,
  stock,
  brand,
  thumbnail,
  tags,
}: ProductCardProps) {
  const { data: session } = useSession()
  const [addToCart] = useAddToCartMutation()
  const [addToFavorites] = useAddToFavoritesMutation()
  const { toast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)

  const discountedPrice = price - (price * discountPercentage) / 100

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
      const result = await addToCart({ productId: id.toString(), quantity: 1, price: price }).unwrap()
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

  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden h-full flex flex-col">
        <CardContent className="p-0 relative">
          <Link href={`/product/${id}`} className="block group">
            <div className="relative aspect-square">
              <Image
                src={thumbnail || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover transition-all group-hover:scale-105"
              />
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="absolute left-2 top-2">
                  -{discountPercentage.toFixed(0)}%
                </Badge>
              )}
              {stock <= 5 && (
                <Badge variant="secondary" className="absolute left-2 bottom-2">
                  Low Stock
                </Badge>
              )}
            </div>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={handleAddToFavorites}
                  disabled={isAddingToFavorites}
                >
                  <Heart className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to favorites</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 p-4 flex-grow">
          <Link href={`/product/${id}`} className="block w-full">
            <div className="flex w-full justify-between items-start">
              <div>
                <h3 className="font-semibold line-clamp-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{brand}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span>{rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </Link>
          <div className="flex w-full items-center justify-between mt-auto pt-4">
            <div className="flex flex-col">
              <span className="text-lg font-bold">${discountedPrice.toFixed(2)}</span>
              {discountPercentage > 0 && (
                <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" className="rounded-full" onClick={handleAddToCart} disabled={isAddingToCart}>
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

