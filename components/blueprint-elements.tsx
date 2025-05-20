"use client"

import { useEffect, useRef } from "react"

interface BlueprintElementsProps {
  className?: string
}

export function BlueprintElements({ className }: BlueprintElementsProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Animation for the blueprint elements
    const svg = svgRef.current
    if (!svg) return

    // Animate the technical elements
    const elements = svg.querySelectorAll(".animate-element")
    elements.forEach((el, index) => {
      const delay = index * 100
      setTimeout(() => {
        el.classList.add("opacity-100")
        el.classList.remove("opacity-0")
      }, delay)
    })

    // Animate the circuit paths
    const paths = svg.querySelectorAll(".circuit-path")
    paths.forEach((path, index) => {
      const pathLength = (path as SVGPathElement).getTotalLength()
      path.setAttribute("stroke-dasharray", pathLength.toString())
      path.setAttribute("stroke-dashoffset", pathLength.toString())

      setTimeout(
        () => {
          path.classList.add("animate-circuit")
        },
        index * 300 + 500,
      )
    })

    // Animate electrons
    const electrons = svg.querySelectorAll(".electron")
    electrons.forEach((electron, index) => {
      setTimeout(
        () => {
          electron.classList.add("animate-electron")
        },
        index * 1000 + 1000,
      )
    })
  }, [])

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: "transparent" }}
    >
      {/* Cyberpunk grid lines */}
      <g className="grid-lines" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="0.5">
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * 20} x2="800" y2={i * 20} />
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="600" />
        ))}
      </g>

      {/* Cyberpunk circuit elements */}
      <g className="circuit-elements">
        {/* Hexagonal patterns */}
        <path
          d="M100,100 L150,75 L200,100 L200,150 L150,175 L100,150 Z"
          stroke="#00e5ff"
          strokeWidth="1.5"
          fill="none"
          className="animate-element opacity-0 transition-opacity duration-1000"
        />

        <path
          d="M600,400 L650,375 L700,400 L700,450 L650,475 L600,450 Z"
          stroke="#ff0080"
          strokeWidth="1.5"
          fill="none"
          className="animate-element opacity-0 transition-opacity duration-1000"
        />

        {/* Digital circuit patterns */}
        <rect
          x="300"
          y="150"
          width="200"
          height="100"
          rx="5"
          ry="5"
          stroke="#9000ff"
          strokeWidth="1.5"
          fill="none"
          className="animate-element opacity-0 transition-opacity duration-1000"
        />

        {/* Internal circuit lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`circuit-h-${i}`}
            x1="310"
            y1={160 + i * 10}
            x2="490"
            y2={160 + i * 10}
            stroke="#9000ff"
            strokeWidth="0.5"
            className="animate-element opacity-0 transition-opacity duration-1000"
          />
        ))}

        {/* Circular elements */}
        <circle
          cx="150"
          cy="400"
          r="50"
          stroke="#ffcc00"
          strokeWidth="1.5"
          fill="none"
          className="animate-element opacity-0 transition-opacity duration-1000"
        />

        <circle
          cx="150"
          cy="400"
          r="40"
          stroke="#ffcc00"
          strokeWidth="1"
          fill="none"
          className="animate-element opacity-0 transition-opacity duration-1000"
        />

        <circle
          cx="150"
          cy="400"
          r="30"
          stroke="#ffcc00"
          strokeWidth="0.5"
          fill="none"
          className="animate-element opacity-0 transition-opacity duration-1000"
        />

        {/* Connection lines */}
        <path
          d="M200,125 L250,125 L250,200 L300,200"
          stroke="#00e5ff"
          strokeWidth="1.5"
          fill="none"
          className="circuit-path"
        />

        <path
          d="M500,200 L550,200 L550,400 L600,400"
          stroke="#ff0080"
          strokeWidth="1.5"
          fill="none"
          className="circuit-path"
        />

        <path d="M650,425 L700,425 L700,500" stroke="#ff0080" strokeWidth="1.5" fill="none" className="circuit-path" />

        <path
          d="M150,450 L150,500 L300,500 L300,550"
          stroke="#ffcc00"
          strokeWidth="1.5"
          fill="none"
          className="circuit-path"
        />

        <path
          d="M150,350 L150,300 L250,300 L250,250"
          stroke="#ffcc00"
          strokeWidth="1.5"
          fill="none"
          className="circuit-path"
        />

        {/* Curved paths */}
        <path
          d="M400,150 C450,100 500,100 550,150"
          stroke="#9000ff"
          strokeWidth="1.5"
          fill="none"
          className="circuit-path"
        />

        <path
          d="M400,250 C450,300 500,300 550,250"
          stroke="#9000ff"
          strokeWidth="1.5"
          fill="none"
          className="circuit-path"
        />

        {/* Electrons */}
        <circle cx="350" cy="200" r="3" fill="#00e5ff" className="electron opacity-0" />
        <circle cx="450" cy="200" r="3" fill="#9000ff" className="electron opacity-0" />
        <circle cx="150" cy="375" r="3" fill="#ffcc00" className="electron opacity-0" />
        <circle cx="650" cy="425" r="3" fill="#ff0080" className="electron opacity-0" />
      </g>

      {/* Cyberpunk text elements */}
      <text
        x="400"
        y="50"
        fontSize="14"
        textAnchor="middle"
        fill="#00e5ff"
        className="animate-element opacity-0 transition-opacity duration-1000"
      >
        SYSTEM.INITIALIZE
      </text>

      <text
        x="150"
        cy="300"
        fontSize="10"
        textAnchor="middle"
        fill="#ffcc00"
        className="animate-element opacity-0 transition-opacity duration-1000"
      >
        CORE.ACTIVE
      </text>

      <text
        x="650"
        y="350"
        fontSize="10"
        textAnchor="middle"
        fill="#ff0080"
        className="animate-element opacity-0 transition-opacity duration-1000"
      >
        NETWORK.ONLINE
      </text>
    </svg>
  )
}

