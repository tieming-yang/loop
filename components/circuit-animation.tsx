"use client"

import { useEffect, useRef } from "react"

interface CircuitAnimationProps {
  className?: string
}

export function CircuitAnimation({ className }: CircuitAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // Cyberpunk colors
    const bgColor = "#0f0f10" // Dark background matching search page
    const colors = {
      primary: "#7ec0cd", // Primary color for electrons
      lineColor: "rgba(255, 255, 255, 0.5)", // White with 50% opacity for lines
    }

    // Draw background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Metro system class
    class MetroSystem {
      nodes: MetroNode[]
      lines: MetroLine[]
      electrons: MetroElectron[]

      constructor(width: number, height: number) {
        this.nodes = []
        this.lines = []
        this.electrons = []

        this.initialize(width, height)
      }

      initialize(width: number, height: number) {
        // Create metro nodes
        const nodeCount = Math.max(15, Math.floor((width * height) / 40000))

        // Create main nodes (larger, at key positions)
        const mainNodes = [
          new MetroNode(width * 0.2, height * 0.2, 6, this.getRandomColor()),
          new MetroNode(width * 0.8, height * 0.2, 6, this.getRandomColor()),
          new MetroNode(width * 0.5, height * 0.5, 8, this.getRandomColor()),
          new MetroNode(width * 0.2, height * 0.8, 6, this.getRandomColor()),
          new MetroNode(width * 0.8, height * 0.8, 6, this.getRandomColor()),
        ]

        this.nodes.push(...mainNodes)

        // Create additional random nodes
        for (let i = 0; i < nodeCount - mainNodes.length; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          const size = Math.random() * 2 + 2
          const color = this.getRandomColor()

          this.nodes.push(new MetroNode(x, y, size, color))
        }

        // Create metro lines connecting nodes
        this.createLines()

        // Initialize electrons
        this.initializeElectrons()
      }

      getRandomColor() {
        // Return primary color for electrons, line color for lines
        return Math.random() > 0.7 ? colors.primary : colors.lineColor
      }

      createLines() {
        // Connect main nodes in a circuit with 90-degree angles
        for (let i = 0; i < 5; i++) {
          const nextIndex = (i + 1) % 5
          const nodeA = this.nodes[i]
          const nodeB = this.nodes[nextIndex]

          // Create 90-degree angle connection
          const midX = nodeA.x
          const midY = nodeB.y

          // First segment (horizontal)
          this.lines.push(new MetroLine(nodeA, { x: midX, y: midY, size: 0 } as MetroNode, colors.lineColor, 1))

          // Second segment (vertical)
          this.lines.push(new MetroLine({ x: midX, y: midY, size: 0 } as MetroNode, nodeB, colors.lineColor, 1))
        }

        // Connect some random nodes with 90-degree angles
        const maxConnections = Math.min(this.nodes.length * 2, 30) // Limit total connections

        for (let i = 0; i < maxConnections; i++) {
          const nodeA = this.nodes[Math.floor(Math.random() * this.nodes.length)]
          const nodeB = this.nodes[Math.floor(Math.random() * this.nodes.length)]

          // Don't connect a node to itself and avoid duplicate connections
          if (nodeA !== nodeB && !this.hasConnection(nodeA, nodeB)) {
            // Only connect if distance is reasonable
            const distance = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y)
            const maxDistance = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) * 0.3

            if (distance < maxDistance) {
              // Create 90-degree angle connection
              const useHorizontalFirst = Math.random() > 0.5
              const midX = useHorizontalFirst ? nodeB.x : nodeA.x
              const midY = useHorizontalFirst ? nodeA.y : nodeB.y

              // First segment
              this.lines.push(new MetroLine(nodeA, { x: midX, y: midY, size: 0 } as MetroNode, colors.lineColor, 1))

              // Second segment
              this.lines.push(new MetroLine({ x: midX, y: midY, size: 0 } as MetroNode, nodeB, colors.lineColor, 1))
            }
          }
        }
      }

      hasConnection(nodeA: MetroNode, nodeB: MetroNode) {
        return this.lines.some(
          (line) => (line.nodeA === nodeA && line.nodeB === nodeB) || (line.nodeA === nodeB && line.nodeB === nodeA),
        )
      }

      initializeElectrons() {
        // Add electrons to some lines
        const electronCount = Math.min(this.lines.length / 3, 15) // Limit total electrons

        for (let i = 0; i < electronCount; i++) {
          const line = this.lines[Math.floor(Math.random() * this.lines.length)]
          this.electrons.push(new MetroElectron(line))
        }
      }

      update(timestamp: number) {
        // Update electrons
        this.electrons = this.electrons.filter((electron) => {
          electron.update()
          return !electron.finished
        })

        // Occasionally add new electrons
        if (Math.random() < 0.02 && this.electrons.length < 20) {
          const line = this.lines[Math.floor(Math.random() * this.lines.length)]
          this.electrons.push(new MetroElectron(line))
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw lines
        this.lines.forEach((line) => line.draw(ctx))

        // Draw nodes
        this.nodes.forEach((node) => node.draw(ctx))

        // Draw electrons on top
        this.electrons.forEach((electron) => electron.draw(ctx))
      }
    }

    // Metro node class
    class MetroNode {
      x: number
      y: number
      size: number
      color: string
      pulsePhase: number

      constructor(x: number, y: number, size: number, color: string) {
        this.x = x
        this.y = y
        this.size = size
        this.color = color
        this.pulsePhase = Math.random() * Math.PI * 2
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw glow
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3)
        glow.addColorStop(0, this.color)
        glow.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.globalAlpha = 0.3 + 0.1 * Math.sin(Date.now() * 0.002 + this.pulsePhase)
        ctx.fill()
        ctx.globalAlpha = 1

        // Draw node
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Draw inner highlight
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fill()
      }
    }

    // Metro line class
    class MetroLine {
      nodeA: MetroNode
      nodeB: MetroNode
      color: string
      width: number

      constructor(nodeA: MetroNode, nodeB: MetroNode, color: string, width: number) {
        this.nodeA = nodeA
        this.nodeB = nodeB
        this.color = color
        this.width = width
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw line glow
        ctx.beginPath()
        ctx.moveTo(this.nodeA.x, this.nodeA.y)
        ctx.lineTo(this.nodeB.x, this.nodeB.y)
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.width * 3
        ctx.globalAlpha = 0.2
        ctx.stroke()
        ctx.globalAlpha = 1

        // Draw main line
        ctx.beginPath()
        ctx.moveTo(this.nodeA.x, this.nodeA.y)
        ctx.lineTo(this.nodeB.x, this.nodeB.y)
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.width
        ctx.stroke()
      }

      getPointAtPosition(position: number): { x: number; y: number } {
        return {
          x: this.nodeA.x + (this.nodeB.x - this.nodeA.x) * position,
          y: this.nodeA.y + (this.nodeB.y - this.nodeA.y) * position,
        }
      }

      getLength(): number {
        return Math.hypot(this.nodeB.x - this.nodeA.x, this.nodeB.y - this.nodeA.y)
      }
    }

    // Curved metro line class
    class CurvedMetroLine extends MetroLine {
      controlPoint: { x: number; y: number }

      constructor(
        nodeA: MetroNode,
        nodeB: MetroNode,
        controlPoint: { x: number; y: number },
        color: string,
        width: number,
      ) {
        super(nodeA, nodeB, color, width)
        this.controlPoint = controlPoint
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw line glow
        ctx.beginPath()
        ctx.moveTo(this.nodeA.x, this.nodeA.y)
        ctx.quadraticCurveTo(this.controlPoint.x, this.controlPoint.y, this.nodeB.x, this.nodeB.y)
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.width * 3
        ctx.globalAlpha = 0.2
        ctx.stroke()
        ctx.globalAlpha = 1

        // Draw main line
        ctx.beginPath()
        ctx.moveTo(this.nodeA.x, this.nodeA.y)
        ctx.quadraticCurveTo(this.controlPoint.x, this.controlPoint.y, this.nodeB.x, this.nodeB.y)
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.width
        ctx.stroke()
      }

      getPointAtPosition(position: number): { x: number; y: number } {
        // Quadratic Bezier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
        const t = position
        const mt = 1 - t

        return {
          x: mt * mt * this.nodeA.x + 2 * mt * t * this.controlPoint.x + t * t * this.nodeB.x,
          y: mt * mt * this.nodeA.y + 2 * mt * t * this.controlPoint.y + t * t * this.nodeB.y,
        }
      }

      getLength(): number {
        // Approximate length of quadratic curve
        const ax = this.nodeA.x - 2 * this.controlPoint.x + this.nodeB.x
        const ay = this.nodeA.y - 2 * this.controlPoint.y + this.nodeB.y
        const bx = 2 * (this.controlPoint.x - this.nodeA.x)
        const by = 2 * (this.controlPoint.y - this.nodeA.y)

        // Approximation using a few sample points
        const steps = 10
        let length = 0
        let prevX = this.nodeA.x
        let prevY = this.nodeA.y

        for (let i = 1; i <= steps; i++) {
          const t = i / steps
          const point = this.getPointAtPosition(t)
          length += Math.hypot(point.x - prevX, point.y - prevY)
          prevX = point.x
          prevY = point.y
        }

        return length
      }
    }

    // Metro electron class
    class MetroElectron {
      line: MetroLine | CurvedMetroLine
      position: number
      speed: number
      size: number
      color: string
      finished: boolean
      tailLength: number

      constructor(line: MetroLine | CurvedMetroLine) {
        this.line = line
        this.position = 0
        this.speed = (Math.random() * 0.005 + 0.002) / (line.getLength() / 500) // Adjust speed based on line length
        this.size = line.width * 1.5
        this.color = colors.primary // Always use primary color for electrons
        this.finished = false
        this.tailLength = Math.random() * 0.1 + 0.05 // Tail length as percentage of total line
      }

      update() {
        this.position += this.speed
        if (this.position >= 1) {
          this.finished = true
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw tail
        const tailStart = Math.max(0, this.position - this.tailLength)
        const steps = 10

        for (let i = 0; i < steps; i++) {
          const t = tailStart + (this.position - tailStart) * (i / steps)
          if (t < 0) continue

          const point = this.line.getPointAtPosition(t)
          const alpha = i / steps
          const size = this.size * alpha

          // Draw glow
          const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size * 3)
          glow.addColorStop(0, this.color)
          glow.addColorStop(1, "rgba(0, 0, 0, 0)")

          ctx.beginPath()
          ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.globalAlpha = 0.3 * alpha
          ctx.fill()
          ctx.globalAlpha = 1
        }

        // Draw electron head
        const point = this.line.getPointAtPosition(this.position)

        // Draw glow
        const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, this.size * 3)
        glow.addColorStop(0, this.color)
        glow.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(point.x, point.y, this.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.globalAlpha = 0.6
        ctx.fill()
        ctx.globalAlpha = 1

        // Draw electron
        ctx.beginPath()
        ctx.arc(point.x, point.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Draw inner highlight
        ctx.beginPath()
        ctx.arc(point.x, point.y, this.size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fill()
      }
    }

    // Create metro system
    const metroSystem = new MetroSystem(canvas.width, canvas.height)

    // Animation loop
    let animationFrame: number

    const animate = (timestamp: number) => {
      // Clear canvas with dark background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw metro system
      metroSystem.update(timestamp)
      metroSystem.draw(ctx)

      animationFrame = requestAnimationFrame(animate)
    }

    animate(0)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}

