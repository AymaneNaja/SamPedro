"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

interface ProductImagesProps {
  images: string[]
  title: string
}

export function ProductImages({ images, title }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Zoom>
          <Image
            src={images[selectedImage] || "/placeholder.svg"}
            alt={title}
            fill
            priority
            className="object-cover rounded-lg"
          />
        </Zoom>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square rounded-md overflow-hidden ${selectedImage === index ? "ring-2 ring-primary" : ""
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src={image || "/placeholder.svg"} alt={`${title} ${index + 1}`} fill className="object-cover" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

