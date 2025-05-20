"use client"

import { useEffect, useRef } from "react"
import { useSnowStore } from "@/hooks/use-snow-store"

interface SnowBackgroundProps {
  className?: string
}

export function SnowBackground({ className }: SnowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { settings } = useSnowStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match parent container
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      } else {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create snowflakes
    class Snowflake {
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      wind: number
      wobble: number
      wobbleSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height * -1 - 10 // Start above the canvas

        // Use a more conservative default for size and speed
        // This ensures even if settings aren't loaded yet, animation looks reasonable
        const safeSize = typeof settings.size === "number" && !isNaN(settings.size) ? settings.size : 1
        const safeSpeed = typeof settings.speed === "number" && !isNaN(settings.speed) ? settings.speed : 1

        this.size = (Math.random() * 2 + 0.5) * safeSize // Smaller base size
        this.speed = (Math.random() * 0.5 + 0.3) * safeSpeed // Slower base speed
        this.opacity = Math.random() * 0.6 + 0.4
        this.wind = Math.random() * 0.3 - 0.15 // Less wind effect
        this.wobble = 0
        this.wobbleSpeed = Math.random() * 0.02
      }

      update() {
        this.y += this.speed
        this.x += this.wind
        this.wobble += this.wobbleSpeed
        this.x += Math.sin(this.wobble) * 0.3

        // Reset if out of bounds
        if (this.y > canvas.height + 10) {
          this.y = -10
          this.x = Math.random() * canvas.width
        }
        if (this.x < -10) {
          this.x = canvas.width + 10
        }
        if (this.x > canvas.width + 10) {
          this.x = -10
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = settings.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Create spotlight
    const drawSpotlight = (ctx: CanvasRenderingContext2D) => {
      const spotlightX = canvas.width * 0.5 // Center horizontally
      const spotlightY = canvas.height * 0.5 // Center vertically
      const radius = Math.max(canvas.width, canvas.height) * 0.6 // Larger radius

      const gradient = ctx.createRadialGradient(spotlightX, spotlightY, 0, spotlightX, spotlightY, radius)
      gradient.addColorStop(0, "rgba(255, 230, 150, 0.25)") // Increased intensity (was 0.15)
      gradient.addColorStop(0.5, "rgba(255, 230, 150, 0.1)") // Increased intensity (was 0.05)
      gradient.addColorStop(1, "rgba(255, 230, 150, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Create snowflakes
    let snowflakes: Snowflake[] = []
    const createSnowflakes = () => {
      snowflakes = []
      // Use a safe amount value with a reasonable default
      const safeAmount = typeof settings.amount === "number" && !isNaN(settings.amount) ? settings.amount : 150
      const actualAmount = Math.min(safeAmount, 300) // Cap at 300 to prevent performance issues

      for (let i = 0; i < actualAmount; i++) {
        snowflakes.push(new Snowflake())
      }
    }

    // Initialize snowflakes with current settings
    createSnowflakes()

    // Animation loop
    let animationFrame: number
    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = "#0a0a14" // Dark night blue
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw spotlight
      drawSpotlight(ctx)

      // Only draw snow if enabled
      if (settings.enabled) {
        // Draw snowflakes
        snowflakes.forEach((snowflake) => {
          snowflake.update()
          snowflake.draw(ctx)
        })
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [settings]) // Make sure we're watching settings changes

  return <canvas ref={canvasRef} className={className} />
}

