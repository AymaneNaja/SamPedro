"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useFetchProductsQuery } from "@/redux/productsApi"
import { useFetchCategoryQuery } from "@/redux/productsApi"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  ArrowRight,
  ShoppingBag,
  Truck,
  RefreshCcw,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Gift,
  Clock,
  Zap,
  Sparkles,
  Smartphone,
  Shirt,
  Home,
  ShoppingCart,
  Heart,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import Image from "next/image"
import Link from "next/link"
import { FallbackImage } from "@/components/ui/fallback-image"

const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

const FALLBACK_IMAGES = {
  hero: ["https://images.unsplash.com/photo-1601597565151-70c4020dc0e1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?q=80&w=1969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1485518882345-15568b007407?q=80&w=1942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",],
  categories: {
    Electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVsZWN0cm9uaWNzfGVufDB8fDB8fHww",
    Fashion: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    "Home & Garden": "https://plus.unsplash.com/premium_photo-1678836292816-fdf0ac484cf1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9tZSUyMGFuZCUyMGdhcmRlbnxlbnwwfHwwfHx8MA%3D%3D",
    Beauty: "https://plus.unsplash.com/premium_photo-1684407616442-8d5a1b7c978e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmVhdXR5fGVufDB8fDB8fHww",
  },
  flashSale: "https://images.unsplash.com/photo-1521404567986-a2c39cde0c31?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUxfHxzYWxlfGVufDB8fDB8fHww",
}

const Dashboard = () => {
  const router = useRouter()
  const { data: newArrivals, isLoading: isLoadingNewArrivals } = useFetchProductsQuery({ limit: 8 })
  const { data: popularCategory, isLoading: isLoadingPopularCategory } = useFetchCategoryQuery("laptops")
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [categoryImages, setCategoryImages] = useState<string[]>([])
  const [isLoadingHeroImages, setIsLoadingHeroImages] = useState(true)
  const [isLoadingCategoryImages, setIsLoadingCategoryImages] = useState(true)

  const categories = [
    { name: "Electronics", icon: Smartphone, query: "laptops" },
    { name: "Fashion", icon: Shirt, query: "womens-dresses" },
    { name: "Home & Garden", icon: Home, query: "home-decoration" },
    { name: "Beauty", icon: Sparkles, query: "beauty" },
  ]

  useEffect(() => {
    if (heroImages.length === 0) {
      setIsLoadingHeroImages(true)
      fetch(
        `https://api.unsplash.com/photos/random?query=fashion,technology,lifestyle&count=3&orientation=landscape&client_id=${UNSPLASH_KEY}`,
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch hero images")
          }
          return res.json()
        })
        .then((data) => {
          setHeroImages(data.map((img: any) => img.urls.regular))
          setIsLoadingHeroImages(false)
        })
        .catch((error) => {
          console.error("Error fetching hero images:", error)
          // Fallback to placeholder images
          setHeroImages(FALLBACK_IMAGES.hero)
          setIsLoadingHeroImages(false)
        })
    } else {
      setIsLoadingHeroImages(false)
    }
  }, [heroImages.length])

  useEffect(() => {
    if (categoryImages.length === 0) {
      setIsLoadingCategoryImages(true)
      Promise.all(
        categories.map(
          (category) =>
            fetch(
              `https://api.unsplash.com/photos/random?query=${category.query}&orientation=landscape&client_id=${UNSPLASH_KEY}`,
            )
              .then((res) => {
                if (!res.ok) {
                  throw new Error("Failed to fetch category image")
                }
                return res.json()
              })
              .then((data) => data.urls.regular)
              .catch(() => FALLBACK_IMAGES.categories[category.name]), // Fallback to category-specific placeholder
        ),
      )
        .then((images) => {
          setCategoryImages(images)
          setIsLoadingCategoryImages(false)
        })
        .catch((error) => {
          console.error("Error fetching category images:", error)
          setCategoryImages(categories.map((category) => FALLBACK_IMAGES.categories[category.name]))
          setIsLoadingCategoryImages(false)
        })
    } else {
      setIsLoadingCategoryImages(false)
    }
  }, [categories, categoryImages.length])

  useEffect(() => {
    const addOneMonth = (date) => {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() + 1)
      if (newDate.getDate() < date.getDate()) {
        newDate.setDate(0)
      }
      return newDate
    }

    const today = new Date()
    const endDate = addOneMonth(today)
    const endTime = endDate.getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime - now

      if (distance <= 0) {
        clearInterval(timer)
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden shadow-lg">
        {isLoadingHeroImages ? (
          <Skeleton className="h-[50vh] md:h-[70vh] w-full" />
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            loop={true}
            className="h-[60vh] md:h-[70vh]"
          >
            {heroImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <FallbackImage
                    src={image || "/placeholder.svg"}
                    fallbackSrc={FALLBACK_IMAGES.hero[index]}
                    alt={`Hero ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent flex flex-col justify-center items-start p-6 md:p-12">
                    <motion.h1
                      className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Discover Your Style
                    </motion.h1>
                    <motion.p
                      className="text-lg md:text-xl text-white mb-6 md:mb-8 max-w-md"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      Explore our latest collection and find the perfect look for you.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => router.replace('/categories')}>
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* Features Section */}
      <section className="hidden md:grid md:grid-cols-3 gap-6">
        {[
          { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
          { icon: RefreshCcw, title: "Easy Returns", description: "30-day return policy" },
          { icon: ShieldCheck, title: "Secure Payments", description: "Shop with confidence" },
        ].map((feature, index) => (
          <motion.div key={index} {...fadeInUp} transition={{ delay: index * 0.1 }}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex items-center p-6">
                <feature.icon className="h-10 w-10 text-primary mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Featured Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoadingCategoryImages
            ? Array(4)
              .fill(0)
              .map((_, index) => <Skeleton key={index} className="h-40 md:h-60 w-full rounded-lg" />)
            : categories.map((category, index) => (
              <motion.div key={index} {...fadeInUp} transition={{ delay: index * 0.1 }}>
                <div className="relative h-40 md:h-60 rounded-lg overflow-hidden group">
                  <FallbackImage
                    src={categoryImages[index] || "/placeholder.svg"}
                    fallbackSrc={FALLBACK_IMAGES.categories[category.name]}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 transition-opacity duration-300 group-hover:bg-opacity-50">
                    <category.icon className="h-8 w-8 text-white mb-2" />
                    <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                    <Button variant="secondary" size="sm" className="self-start group" onClick={() => router.replace(category.query)}>
                      Explore
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Trending Now Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <TrendingUp className="mr-2 h-8 w-8 text-primary" />
            Trending Now
          </h2>
          <Button variant="ghost" onClick={() => router.push("/trending")} className="text-primary">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <Swiper
          slidesPerView={2}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
          }}
          className="w-full"
        >
          {isLoadingNewArrivals
            ? Array(4)
              .fill(0)
              .map((_, i) => (
                <SwiperSlide key={i}>
                  <Skeleton className="h-[300px] w-full" />
                </SwiperSlide>
              ))
            : newArrivals?.products?.slice(0, 8).map((product: any) => (
              <SwiperSlide key={product.id}>
                <motion.div {...fadeInUp}>
                  <ProductCard {...product} />
                </motion.div>
              </SwiperSlide>
            ))}
        </Swiper>
      </section>


      {/* Flash Sale Section */}
      <section>
        {Object.values(countdown).every((value) => value === 0) ? (
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 w-full md:w-1/2">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <div className="flex justify-center md:justify-start space-x-4 mb-6">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} className="h-16 w-16 rounded-lg" />
                  ))}
              </div>
              <Skeleton className="h-12 w-40" />
            </div>
            <Skeleton className="w-full md:w-1/2 h-64 rounded-lg" />
          </div>
        ) : (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4 flex items-center justify-center md:justify-start">
                  <Zap className="mr-2 h-8 w-8 text-yellow-500" />
                  Flash Sale!
                </h2>
                <p className="text-xl mb-4">Up to 70% off on selected items</p>
                <div className="flex justify-center md:justify-start space-x-4 mb-6">
                  {Object.entries(countdown).map(([unit, value]) => (
                    <div key={unit} className="text-center bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                      <div className="text-2xl font-bold text-primary">{value}</div>
                      <div className="text-xs uppercase text-muted-foreground">{unit}</div>
                    </div>
                  ))}
                </div>
                <Button size="lg" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                  Shop Flash Sale
                  <ShoppingCart className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="w-full md:w-1/2 h-64 relative rounded-lg overflow-hidden shadow-xl">
                <FallbackImage
                  src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  fallbackSrc={FALLBACK_IMAGES.flashSale}
                  alt="Flash Sale"
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-4xl font-bold text-white">Up to 70% OFF</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Popular in Electronics Section */}
      <section className="bg-muted rounded-xl p-6 md:p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <Smartphone className="mr-2 h-8 w-8 text-primary" />
            Popular in Electronics
          </h2>
          <Button variant="ghost" onClick={() => router.push("/categories/electronics")} className="text-primary">
            Explore More <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingPopularCategory
            ? Array(3)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-[300px]" />)
            : popularCategory?.products?.slice(0, 3).map((product: any) => (
              <motion.div key={product.id} {...fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={product.thumbnail || "/placeholder.svg"}
                        alt={product.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 flex-grow">{product.title}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-primary">${product.price}</p>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/product/${product.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <Sparkles className="mr-2 h-8 w-8 text-primary" />
            New Arrivals
          </h2>
          <Button variant="ghost" onClick={() => router.push("/products")} className="text-primary">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoadingNewArrivals
            ? Array(4)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-[300px]" />)
            : newArrivals?.products?.slice(0, 4).map((product: any) => (
              <motion.div key={product.id} {...fadeInUp}>
                <ProductCard {...product} />
              </motion.div>
            ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 md:p-8 shadow-lg">
        {isLoadingNewArrivals ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Skeleton className="h-10 flex-grow" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Stay Updated</h2>
            <p className="text-center mb-6 text-muted-foreground">
              Subscribe to our newsletter for exclusive offers and updates
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-grow" />
              <Button type="submit" className="w-full sm:w-auto">
                Subscribe
                <Gift className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </>
        )}
      </section>

      {/* Testimonials Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
          <Star className="mr-2 h-8 w-8 text-yellow-500" />
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingNewArrivals
            ? Array(3)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <Skeleton className="w-20 h-20 rounded-full" />
                      <div className="ml-4 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="flex-grow h-20" />
                  </CardContent>
                </Card>
              ))
            : [
              {
                name: "Badr Naja",
                comment: "Great products and fast shipping! The customer service team was very helpful.",
                avatar: "/avatars/badr.jpg",
              },
              {
                name: "Samia Naja",
                comment: "Excellent customer service. They went above and beyond to ensure I was satisfied.",
                avatar: "/avatars/samia.jpg",
              },
              {
                name: "Arina Mak",
                comment: "The quality of the items exceeded my expectations. I've been a loyal customer for years.",
                avatar: "/avatars/arina.jpg",
              },
            ].map((testimonial, index) => (
              <motion.div key={index} {...fadeInUp} transition={{ delay: index * 0.1 }}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-20 h-20 relative rounded-full overflow-hidden border-2  shadow-md">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={80}
                          height={80}
                          className="rounded-full object-cover"
                          priority
                        />
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-lg">{testimonial.name}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground flex-grow text-base italic">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard

