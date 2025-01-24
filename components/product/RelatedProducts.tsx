'use client'
import { ProductCard } from '@/components/product-card'
import { useFetchCategoryQuery } from '@/redux/productsApi'
import { Skeleton } from '../ui/skeleton'
import { motion } from 'framer-motion'




export function RelatedProducts({ category }: { category: string }) {
  const { data, isLoading } = useFetchCategoryQuery(category)
  if (isLoading) {
    return (
      <div className="mt-12">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="ggrid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-2 sm:gap-6">
        {data.products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}


