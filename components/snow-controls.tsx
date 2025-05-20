"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Snowflake } from "lucide-react"
import { useSnowStore } from "@/hooks/use-snow-store"

export function SnowControls() {
  const { settings, updateSettings, toggleSnow, resetToDefaults } = useSnowStore()
  const initialized = true // Always consider it initialized
  const [open, setOpen] = useState(false)

  // Don't render until initialized to avoid flashing with default values
  if (!initialized) {
    return (
      <Button variant="outline" size="sm" className="flex items-center gap-2 border-gray-700 text-gray-500" disabled>
        <Snowflake className="h-4 w-4" />
        <span>Loading...</span>
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${settings.enabled ? "border-white/50 text-white" : "border-gray-700 text-gray-500"}`}
        >
          <Snowflake className="h-4 w-4" />
          <span>Snow Effects</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-900/90 backdrop-blur-md border-gray-800">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-blue-300" />
              <h4 className="font-medium">Snow Effects</h4>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={toggleSnow}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount</Label>
                <span className="text-sm text-gray-400">{settings.amount}</span>
              </div>
              <Slider
                id="amount"
                min={50}
                max={500}
                step={10}
                value={[settings.amount]}
                onValueChange={(value) => updateSettings({ amount: value[0] })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="speed">Speed</Label>
                <span className="text-sm text-gray-400">{settings.speed.toFixed(1)}x</span>
              </div>
              <Slider
                id="speed"
                min={0.2}
                max={3}
                step={0.1}
                value={[settings.speed]}
                onValueChange={(value) => updateSettings({ speed: value[0] })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="size">Size</Label>
                <span className="text-sm text-gray-400">{settings.size.toFixed(1)}x</span>
              </div>
              <Slider
                id="size"
                min={0.5}
                max={3}
                step={0.1}
                value={[settings.size]}
                onValueChange={(value) => updateSettings({ size: value[0] })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="color"
                  value={settings.color}
                  onChange={(e) => updateSettings({ color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer"
                  disabled={!settings.enabled}
                />
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {["#ffffff", "#e3f2fd", "#bbdefb", "#90caf9", "#ffcdd2"].map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded-full border border-gray-700"
                      style={{ backgroundColor: color }}
                      onClick={() => updateSettings({ color })}
                      disabled={!settings.enabled}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Use the new resetToDefaults function
                resetToDefaults()
                // Force recreation of snowflakes
                window.dispatchEvent(new Event("resize"))
              }}
              disabled={!settings.enabled}
            >
              Reset to Default
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

