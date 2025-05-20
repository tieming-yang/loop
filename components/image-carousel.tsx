"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageCarouselProps {
  images: string[]
  interval?: number
  className?: string
  imageClassName?: string
}

export function ImageCarousel({ images, interval = 5000, className, imageClassName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  if (images.length === 0) return null

  return (
    <div className={cn("relative overflow-hidden rounded-full", className)}>
      {images.map((src, index) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={`Avatar ${index + 1}`}
            fill
            className={cn("object-cover", imageClassName)}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}

