"use client"

import { useEffect, useRef, useState } from "react"

interface CosmicBackgroundProps {
  className?: string
}

export function CosmicBackground({ className }: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match parent container
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        const { width, height } = parent.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        setDimensions({ width, height })
      } else {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Colors for the cosmic theme
    const colors = {
      background: "#030308", // Much darker background
      stars: ["#ffffff", "#eeeeee", "#7ec0cd", "#9000ff", "#ff0080"],
      nebulaPrimary: "#7ec0cd",
      nebulaSecondary: "#9000ff",
      nebulaAccent: "#ff0080",
    }

    // Star class
    class Star {
      x: number
      y: number
      size: number
      color: string
      twinkleSpeed: number
      twinklePhase: number
      opacity: number

      constructor(x: number, y: number, size: number, color: string) {
        this.x = x
        this.y = y
        this.size = size
        this.color = color
        this.twinkleSpeed = Math.random() * 0.03 + 0.01
        this.twinklePhase = Math.random() * Math.PI * 2
        this.opacity = Math.random() * 0.5 + 0.5
      }

      update() {
        // Make stars twinkle by varying opacity
        this.twinklePhase += this.twinkleSpeed
        this.opacity = 0.5 + Math.sin(this.twinklePhase) * 0.5
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()

        // Add glow effect for larger stars
        if (this.size > 1) {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3)
          gradient.addColorStop(0, this.color)
          gradient.addColorStop(1, "rgba(0,0,0,0)")
          ctx.fillStyle = gradient
          ctx.globalAlpha = this.opacity * 0.3
          ctx.fill()
        }

        ctx.globalAlpha = 1
      }
    }

    // Nebula class
    class Nebula {
      x: number
      y: number
      width: number
      height: number
      color1: string
      color2: string
      color3: string
      opacity: number
      pulseSpeed: number
      pulsePhase: number

      constructor(x: number, y: number, width: number, height: number, color1: string, color2: string, color3: string) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color1 = color1
        this.color2 = color2
        this.color3 = color3
        this.opacity = Math.random() * 0.3 + 0.1
        this.pulseSpeed = Math.random() * 0.005 + 0.001
        this.pulsePhase = Math.random() * Math.PI * 2
      }

      update() {
        // Make nebula pulse by varying opacity
        this.pulsePhase += this.pulseSpeed
        this.opacity = 0.1 + Math.sin(this.pulsePhase) * 0.05
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Create a complex gradient for the nebula
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          Math.max(this.width, this.height) / 2,
        )
        gradient.addColorStop(0, this.color1)
        gradient.addColorStop(0.5, this.color2)
        gradient.addColorStop(1, this.color3)

        ctx.beginPath()
        ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Dust class for small particles
    class DustParticle {
      x: number
      y: number
      size: number
      color: string
      opacity: number
      speed: number

      constructor(x: number, y: number, size: number, color: string) {
        this.x = x
        this.y = y
        this.size = size
        this.color = color
        this.opacity = Math.random() * 0.2 + 0.1
        this.speed = Math.random() * 0.1 + 0.05
      }

      update() {
        // Slow drift movement
        this.x += Math.sin(Date.now() * 0.001) * this.speed
        this.y += Math.cos(Date.now() * 0.001) * this.speed

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Create cosmic objects
    const createCosmicObjects = () => {
      const stars: Star[] = []
      const nebulae: Nebula[] = []
      const dustParticles: DustParticle[] = []

      // Create stars based on canvas size
      const starCount = Math.floor((canvas.width * canvas.height) / 800)
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 2 + 0.5
        const color = colors.stars[Math.floor(Math.random() * colors.stars.length)]
        stars.push(new Star(x, y, size, color))
      }

      // Create a few larger stars
      for (let i = 0; i < starCount / 15; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 2.5 + 2
        const color = colors.stars[Math.floor(Math.random() * colors.stars.length)]
        stars.push(new Star(x, y, size, color))
      }

      // Create nebulae
      const nebulaCount = Math.max(3, Math.floor((canvas.width * canvas.height) / 300000))
      for (let i = 0; i < nebulaCount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const width = Math.random() * canvas.width * 0.5 + canvas.width * 0.2
        const height = Math.random() * canvas.height * 0.5 + canvas.height * 0.2

        // Randomly select colors for variety
        const colorSets = [
          [colors.nebulaPrimary, colors.nebulaSecondary, "rgba(0,0,0,0)"],
          [colors.nebulaSecondary, colors.nebulaAccent, "rgba(0,0,0,0)"],
          [colors.nebulaAccent, colors.nebulaPrimary, "rgba(0,0,0,0)"],
        ]
        const colorSet = colorSets[Math.floor(Math.random() * colorSets.length)]

        nebulae.push(new Nebula(x, y, width, height, colorSet[0], colorSet[1], colorSet[2]))
      }

      // Create dust particles
      const dustCount = Math.floor((canvas.width * canvas.height) / 2000)
      for (let i = 0; i < dustCount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 0.5 + 0.2
        const color = colors.stars[Math.floor(Math.random() * colors.stars.length)]
        dustParticles.push(new DustParticle(x, y, size, color))
      }

      return { stars, nebulae, dustParticles }
    }

    let cosmicObjects = createCosmicObjects()

    // Animation loop
    let animationFrame: number
    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = colors.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw nebulae first (background)
      cosmicObjects.nebulae.forEach((nebula) => {
        nebula.update()
        nebula.draw(ctx)
      })

      // Draw dust particles
      cosmicObjects.dustParticles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      // Draw stars (foreground)
      cosmicObjects.stars.forEach((star) => {
        star.update()
        star.draw(ctx)
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    // Recreate cosmic objects when dimensions change
    const handleResize = () => {
      cosmicObjects = createCosmicObjects()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}

