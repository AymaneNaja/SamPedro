import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc: string
}

export function FallbackImage({ src, fallbackSrc, alt, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <Image
        {...props}
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc)
        }}
      />
      {isLoading && <Skeleton className="absolute inset-0" style={{ zIndex: 1 }} />}
    </>
  )
}

