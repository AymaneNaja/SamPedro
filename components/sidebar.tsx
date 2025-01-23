'use client'

import { usePathname } from 'next/navigation'
import { useFetchCategoriesQuery } from '@/redux/productsApi'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { Smartphone, Laptop, SprayCanIcon as Spray, Sparkles, ShoppingBasket, Home, Sofa, Shirt, SaladIcon as Dress, HardDriveIcon as Boot, ShirtIcon as TShirt, Footprints, Watch, ShoppingBag, Gem, Glasses, Car, Bike, Lightbulb, Gift, Tablet, Trophy, Bandage, Phone, ChefHat, BookHeart } from 'lucide-react'
import Link from 'next/link'

export const categoryIcons: { [key: string]: React.ElementType } = {
  beauty: BookHeart,
  smartphones: Smartphone,
  laptops: Laptop,
  fragrances: Spray,
  skincare: Sparkles,
  groceries: ShoppingBasket,
  'home-decoration': Home,
  furniture: Sofa,
  tops: Shirt,
  'womens-dresses': Dress,
  'womens-shoes': Boot,
  'mens-shirts': TShirt,
  'mens-shoes': Footprints,
  'mens-watches': Watch,
  'womens-watches': Watch,
  'womens-bags': ShoppingBag,
  'womens-jewellery': Gem,
  sunglasses: Glasses,
  automotive: Car,
  motorcycle: Bike,
  lighting: Lightbulb,
  vehicle: Car,
  tablets: Tablet,
  'sports-accessories': Trophy,
  'skin-care': Bandage,
  'mobile-accessories': Phone,
  'kitchen-accessories': ChefHat
}

const Sidebar = () => {
  const pathname = usePathname() // Get the current path
  const { data: categories, isLoading } = useFetchCategoriesQuery('')

  // Check if the current path includes "auth", "login", or "signup"
  const shouldHideSidebar = pathname.includes('sign-up') || pathname.includes('sign-in')

  if (shouldHideSidebar) {
    return null // Do not render the sidebar
  }

  const getIcon = (category: { name: string, image: string }) => {
    const Icon = categoryIcons[category.toLowerCase()] || Gift
    return <Icon className="h-5 w-5 mr-2" />
  }

  return (
    <aside className="w-64 bg-background border-r overflow-hidden hidden md:block">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="p-4">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          {isLoading ? (
            Array(8)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-10 w-full mb-2" />
              ))
          ) : categories ? (
            <ul className="space-y-1">
              {categories.map((category: string, index: string) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-accent hover:text-accent-foreground"
                    asChild
                  >
                    <Link href={`/categories/${category.name}`}>
                      {getIcon(category.name)}
                      <span className="capitalize">
                        {category.name.replace('-', ' ')}
                      </span>
                    </Link>
                  </Button>
                </motion.li>
              ))}
            </ul>
          ) : null}
        </nav>
      </ScrollArea>
    </aside>
  )
}

export default Sidebar
