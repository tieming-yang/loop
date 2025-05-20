"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const presetColors = [
  // Light backgrounds
  "#FFFFFF", // White
  "#F8F9FA", // Light gray
  "#F5F5DC", // Beige
  "#FFF8E1", // Light yellow
  "#F1F8E9", // Light green
  "#E3F2FD", // Light blue
  "#FCE4EC", // Light pink

  // Medium backgrounds
  "#E0E0E0", // Medium gray
  "#FFE0B2", // Medium orange
  "#C8E6C9", // Medium green
  "#B3E5FC", // Medium blue
  "#F8BBD0", // Medium pink

  // Dark backgrounds
  "#424242", // Dark gray
  "#212121", // Very dark gray
  "#000000", // Black
  "#1A237E", // Dark blue
  "#311B92", // Dark purple
  "#01579B", // Dark cyan
  "#004D40", // Dark teal
  "#1B5E20", // Dark green
  "#3E2723", // Dark brown
]

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [color, setColor] = useState(value || "#FFFFFF")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value !== color) {
      setColor(value)
    }
  }, [value])

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-8 h-8 p-0 border-2", className)} style={{ backgroundColor: color }}>
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md border border-gray-700" style={{ backgroundColor: color }} />
            <input
              ref={inputRef}
              type="text"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-sm"
            />
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8 overflow-hidden cursor-pointer"
              id="color-picker"
            />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  "w-6 h-6 rounded-md border border-gray-700 flex items-center justify-center",
                  color.toLowerCase() === presetColor.toLowerCase() &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-gray-900",
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => handleColorChange(presetColor)}
              >
                {color.toLowerCase() === presetColor.toLowerCase() && (
                  <Check
                    className={getContrastColor(presetColor) === "#FFFFFF" ? "text-white" : "text-black"}
                    size={14}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Update the getContrastColor function to ensure better contrast detection

// Function to get contrasting text color with better contrast
export function getContrastColor(backgroundColor: string): string {
  // Convert hex to RGB
  let r, g, b

  if (backgroundColor.startsWith("#")) {
    const hex = backgroundColor.substring(1)
    r = Number.parseInt(hex.substring(0, 2), 16)
    g = Number.parseInt(hex.substring(2, 4), 16)
    b = Number.parseInt(hex.substring(4, 6), 16)
  } else if (backgroundColor.startsWith("rgb")) {
    const rgbValues = backgroundColor.match(/\d+/g)
    if (rgbValues && rgbValues.length >= 3) {
      r = Number.parseInt(rgbValues[0])
      g = Number.parseInt(rgbValues[1])
      b = Number.parseInt(rgbValues[2])
    } else {
      return "#000000" // Default to black if parsing fails
    }
  } else {
    return "#000000" // Default to black for unknown formats
  }

  // Calculate relative luminance according to WCAG 2.0
  const R = r / 255
  const G = g / 255
  const B = b / 255

  const RsRGB = R <= 0.03928 ? R / 12.92 : Math.pow((R + 0.055) / 1.055, 2.4)
  const GsRGB = G <= 0.03928 ? G / 12.92 : Math.pow((G + 0.055) / 1.055, 2.4)
  const BsRGB = B <= 0.03928 ? B / 12.92 : Math.pow((B + 0.055) / 1.055, 2.4)

  const L = 0.2126 * RsRGB + 0.7152 * GsRGB + 0.0722 * BsRGB

  // Simplified and more reliable approach:
  // If luminance is greater than 0.5, use black text; otherwise, use white text
  return L > 0.5 ? "#000000" : "#FFFFFF"
}

// Update the isLightColor function to be more accurate
export function isLightColor(color: string): boolean {
  // Convert hex to RGB
  let r, g, b

  if (color.startsWith("#")) {
    const hex = color.substring(1)
    r = Number.parseInt(hex.substring(0, 2), 16)
    g = Number.parseInt(hex.substring(2, 4), 16)
    b = Number.parseInt(hex.substring(4, 6), 16)
  } else if (color.startsWith("rgb")) {
    const rgbValues = color.match(/\d+/g)
    if (rgbValues && rgbValues.length >= 3) {
      r = Number.parseInt(rgbValues[0])
      g = Number.parseInt(rgbValues[1])
      b = Number.parseInt(rgbValues[2])
    } else {
      return true // Default to assuming light if parsing fails
    }
  } else {
    return true // Default to assuming light for unknown formats
  }

  // Calculate relative luminance (same formula as in getContrastColor)
  const R = r / 255
  const G = g / 255
  const B = b / 255

  const RsRGB = R <= 0.03928 ? R / 12.92 : Math.pow((R + 0.055) / 1.055, 2.4)
  const GsRGB = G <= 0.03928 ? G / 12.92 : Math.pow((G + 0.055) / 1.055, 2.4)
  const BsRGB = B <= 0.03928 ? B / 12.92 : Math.pow((B + 0.055) / 1.055, 2.4)

  const L = 0.2126 * RsRGB + 0.7152 * GsRGB + 0.0722 * BsRGB

  // If luminance is greater than 0.5, color is considered light
  return L > 0.5
}

