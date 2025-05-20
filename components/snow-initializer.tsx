"use client"

import { useEffect } from "react"
import { useSnowStore } from "@/hooks/use-snow-store"

export function SnowInitializer() {
  const { initialized, updateSettings } = useSnowStore()

  useEffect(() => {
    // If not initialized (first render), ensure we have default settings
    if (!initialized) {
      // This will trigger a re-render with proper settings
      updateSettings({})
    }
  }, [initialized, updateSettings])

  return null // This component doesn't render anything
}

