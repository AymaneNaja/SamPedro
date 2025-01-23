'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'

interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

interface ProductReviewsProps {
  reviews: Review[]
  rating: number
  isLoading?: boolean
}

export function ProductReviews({ reviews, rating, isLoading = false }: ProductReviewsProps) {
  const [newReview, setNewReview] = useState({ name: '', email: '', rating: 0, comment: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle review submission
    console.log('New review:', newReview)
    // Reset form
    setNewReview({ name: '', email: '', rating: 0, comment: '' })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              fill="currentColor"
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
      </div>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border-b pb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{review.reviewerName}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
            <p className="text-sm">{review.comment}</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date(review.date).toLocaleDateString()}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your name"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          />
          <Input
            placeholder="Your email"
            type="email"
            value={newReview.email}
            onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
          />
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
              >
                <Star className={`h-6 w-6 ${i < newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Your review"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />
          <Button type="submit">Submit Review</Button>
        </form>
      </div>
    </div>
  )
}

