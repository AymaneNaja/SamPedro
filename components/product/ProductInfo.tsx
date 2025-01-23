import { Tag, Truck, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductInfoProps {
  title: string
  brand: string
  description: string
  sku: string
  shippingInformation: string
  warrantyInformation: string
  availabilityStatus: string
  stock: number
  category: string
  tags: string[]
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  returnPolicy: string
  minimumOrderQuantity: number
  isLoading?: boolean
}

export function ProductInfo({
  title,
  brand,
  description,
  sku,
  shippingInformation,
  warrantyInformation,
  availabilityStatus,
  stock,
  category,
  tags,
  weight,
  dimensions,
  returnPolicy,
  minimumOrderQuantity,
  isLoading = false
}: ProductInfoProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-lg text-muted-foreground">by {brand}</p>
      <p className="text-sm leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{category}</Badge>
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">{tag}</Badge>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center">
          <Tag className="mr-2 h-4 w-4 text-primary" />
          <span>SKU: {sku}</span>
        </div>
        <div className="flex items-center">
          <Truck className="mr-2 h-4 w-4 text-primary" />
          <span>{shippingInformation}</span>
        </div>
        <div className="flex items-center">
          <Shield className="mr-2 h-4 w-4 text-primary" />
          <span>{warrantyInformation}</span>
        </div>
        <div>
          <Badge variant={stock > 10 ? "secondary" : "destructive"}>{availabilityStatus}</Badge>
        </div>
      </div>
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Product Details</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li>Weight: {weight}g</li>
          <li>Dimensions: {dimensions.width}x{dimensions.height}x{dimensions.depth}cm</li>
          <li>Return Policy: {returnPolicy}</li>
          <li>Minimum Order: {minimumOrderQuantity}</li>
        </ul>
      </div>
    </div>
  )
}

