"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckoutModal } from "@/components/checkout-modal"
import { toast } from "@/hooks/use-toast"
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
  useFetchSingleProductQuery,
} from "@/redux/productsApi"
import { useRouter } from "next/navigation"

const CartItem = ({ item, onUpdateCart, onRemoveItem }) => {
  const { data: product, isLoading: isProductLoading } = useFetchSingleProductQuery(item.productId)

  if (isProductLoading) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Skeleton className="h-20 w-20 rounded-md" />
            <div className="flex-grow">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="text-right">
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!product) return null

  const itemTotal = product.price * item.quantity

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Image
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.title}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
          <div className="flex-grow">
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => onUpdateCart(item.id, item.quantity - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="0"
              value={item.quantity}
              onChange={(e) => onUpdateCart(item.id, Number.parseInt(e.target.value, 10) || 0)}
              className="w-16 text-center"
            />
            <Button variant="outline" size="icon" onClick={() => onUpdateCart(item.id, item.quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-right">
            <p className="font-semibold">${itemTotal.toFixed(2)}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CartPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const userId = session?.user?.id

  const {
    data: cartItems,
    isLoading: isCartLoading,
    isError,
  } = useGetCartQuery(userId, {
    skip: !userId,
  })
  const [removeFromCart] = useRemoveFromCartMutation()
  const [updateCart] = useUpdateCartMutation()

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const handleUpdateCart = async (id, newQuantity) => {
    if (newQuantity <= 0) {
      try {
        await removeFromCart({ id }).unwrap()
        toast({
          title: "Item removed",
          description: "The item has been removed from your cart.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove item from cart.",
          variant: "destructive",
        })
      }
    } else {
      try {
        await updateCart({ id, quantity: newQuantity }).unwrap()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update cart item.",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveItem = async (id) => {
    try {
      await removeFromCart({ id }).unwrap()
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      })
    }
  }

  // Calculate the total
  const total = cartItems
    ? cartItems.reduce((sum, item) => {
      const productPrice = item.product?.price || 0
      return sum + productPrice * item.quantity
    }, 0)
    : 0

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Sign in to view your cart</h2>
            <p className="text-muted-foreground mb-4">
              Create an account or sign in to see your shopping cart and complete your purchase.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-[100px] w-full mb-4" />
            ))}
          </div>
          <div>
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error loading cart items</h1>
        <p>Please try again later.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems && cartItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CartItem item={item} onUpdateCart={handleUpdateCart} onRemoveItem={handleRemoveItem} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setIsPaymentModalOpen(true)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild>
            <a href="/products">Start Shopping</a>
          </Button>
        </motion.div>
      )}
      <CheckoutModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} amount={total} />
    </motion.div>
  )
}