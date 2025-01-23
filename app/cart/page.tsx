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

const CartItem = ({ item, onUpdateCart, onRemoveItem }: any) => {
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

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckoutModal } from "@/components/checkout-modal";
import { toast } from "@/hooks/use-toast";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
  useFetchSingleProductQuery,
} from "@/redux/productsApi";
import { useRouter } from "next/navigation";

const CartItem = ({ item, onUpdateCart, onRemoveItem }) => {
  const { data: product, isLoading: isProductLoading } = useFetchSingleProductQuery(item.productId);

  if (isProductLoading) {
    // ...
  }

  if (!product) {
    return null;
  }

  const itemTotal = product.price * item.quantity;

  // ...
};
export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const {
    data: cartItems,
    isLoading: isCartLoading,
    isError,
  } = useGetCartQuery(userId, {
    skip: !userId,
  });

  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCart] = useUpdateCartMutation();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const handleUpdateCart = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      try {
        await removeFromCart({ id }).unwrap();
        toast({
          title: "Item removed",
          description: "The item has been removed from your cart.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove item from cart.",
          variant: "destructive",
        });
      }
    } else {
      try {
        await updateCart({ id, quantity: newQuantity }).unwrap();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update cart item.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart({ id }).unwrap();
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  // Calculate the total
  const total = cartItems
    ? cartItems.reduce((sum, item) => {
      const productPrice = item.product?.price || 0; // Assuming product data is included in cartItems
      return sum + productPrice * item.quantity;
    }, 0)
    : 0;

  // ...
};