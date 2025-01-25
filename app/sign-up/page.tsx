"use client"


import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Playfair_Display } from "next/font/google"
import { FallbackImage } from "@/components/ui/fallback-image"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function SignUpPage() {
  const [backgroundImage, setBackgroundImage] = useState("")

  useEffect(() => {
    fetch(
      `https://api.unsplash.com/photos/random?query=fashion&orientation=portrait&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setBackgroundImage(data.urls.regular)
      })
      .catch((err) => {
        console.error("Error fetching Unsplash image:", err)
        setBackgroundImage("/placeholder.svg")
      })
  }, [])

  return (
    <div className="container relative min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 lg:p-0 mx-auto">
      <motion.div
        className="w-full lg:w-1/2 h-full lg:min-h-screen hidden lg:flex flex-col bg-muted p-6 lg:p-10 text-white order-2 lg:order-1"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-64 lg:h-full mb-6 lg:mb-0 overflow-hidden rounded-lg">
          <FallbackImage
            src={backgroundImage}
            fallbackSrc="/placeholder.svg"
            alt="Fashion collection"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className={`${playfair.className} text-4xl lg:text-6xl font-bold text-white text-center`}>SamPedro</h1>
          </div>
        </div>
        <div className="mt-6 lg:mt-auto">
          <blockquote className="space-y-2">
            <p className={`${playfair.className} text-lg lg:text-xl italic`}>
              "At SamPedro, we believe shopping should be more than a transaction; it should be an experience. Join us
              and discover a world of style, convenience, and unparalleled variety."
            </p>
            <footer className="text-sm">Badr Naja, Product Manager</footer>
          </blockquote>
        </div>
      </motion.div>
      <motion.div
        className="w-full lg:w-1/2 p-6 lg:p-12 order-1 lg:order-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-md">
          <SignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

