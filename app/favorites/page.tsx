"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation, useFetchSingleProductQuery } from "@/redux/productsApi"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Heart, Trash2, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const FavoriteItem = ({ favoriteId, productId, onRemove, isRemoving }) => {
  const { data: product, isLoading } = useFetchSingleProductQuery(productId)

  if (isLoading) {
    return <ProductCardSkeleton />
  }

  if (!product) {
    return null
  }

  return (
    <div className="relative group">
      <ProductCard {...product} />
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(favoriteId)}
          disabled={isRemoving}
          className="flex items-center space-x-1"
        >
          {isRemoving ? (
            <Skeleton className="h-4 w-4 rounded-full" />
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              <span>Remove</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

const ProductCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-4 relative">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-8 w-24" />
    </div>
    <Skeleton className="h-8 w-24 absolute bottom-2 right-2" />
  </div>
)

const FavoritesPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const userId = session?.user?.id
  const {
    data: favorites,
    isLoading: isFavoritesLoading,
    refetch,
  } = useGetFavoritesQuery(userId, {
    skip: !userId,
  })
  const [removeFromFavorites] = useRemoveFromFavoritesMutation()
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      refetch()
    }
  }, [userId, refetch])

  const handleRemoveFromFavorites = async (id: string) => {
    setRemovingId(id)
    try {
      await removeFromFavorites({ id }).unwrap()
      toast({
        title: "Removed from favorites",
        description: "The item has been removed from your favorites.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error removing the item from favorites.",
        variant: "destructive",
      })
    } finally {
      setRemovingId(null)
    }
  }

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Sign in to view your favorites</h2>
            <p className="text-muted-foreground mb-4">Create an account or sign in to save your favorite items.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Favorites
      </motion.h1>

      {isFavoritesLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : !favorites || favorites.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4">Your favorites list is empty</h2>
          <p className="text-muted-foreground mb-8">Start adding some products to your favorites!</p>
          <Button asChild size="lg">
            <a href="/products">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Explore Products
            </a>
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {favorites.map((favorite) => (
              <motion.div
                key={favorite.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FavoriteItem
                  favoriteId={favorite.id}
                  productId={favorite.productId}
                  onRemove={handleRemoveFromFavorites}
                  isRemoving={removingId === favorite.id}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

export default FavoritesPage

