"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
    productId: number
    onAddToFavorites: () => Promise<void>
    isLoading: boolean
}

export function FavoriteButton({ productId, onAddToFavorites, isLoading }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false)
    const { data: session } = useSession()
    const { toast } = useToast()

    const handleClick = async () => {
        if (!session) {
            toast({
                title: "Authentication required",
                description: "Please sign in to add items to favorites.",
                variant: "destructive",
            })
            return
        }

        try {
            await onAddToFavorites()
            setIsFavorite(!isFavorite)
        } catch (error) {
            console.error("Error toggling favorite:", error)
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            disabled={isLoading}
            className="relative overflow-hidden"
        >
            <Heart className={`h-4 w-4 ${isFavorite ? "text-red-500 fill-red-500" : ""}`} />
            {isFavorite && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className="absolute inset-0 bg-red-100 rounded-full"
                    style={{ zIndex: -1 }}
                />
            )}
        </Button>
    )
}

