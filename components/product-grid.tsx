'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Product {
  id: number
  title: string
  price: number
  image: string
}

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=8')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col justify-between">
          <CardContent className="p-4">
            <div className="aspect-square relative mb-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">${product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add to Cart</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default ProductGrid

