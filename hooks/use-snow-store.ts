import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SnowSettings {
  enabled: boolean
  amount: number
  speed: number
  size: number
  color: string
}

interface SnowStore {
  settings: SnowSettings
  initialized: boolean
  updateSettings: (settings: Partial<SnowSettings>) => void
  toggleSnow: () => void
  resetToDefaults: () => void
}

// Define default settings as a constant
const DEFAULT_SETTINGS: SnowSettings = {
  enabled: true,
  amount: 150,
  speed: 1,
  size: 1,
  color: "#ffffff",
}

export const useSnowStore = create<SnowStore>()(
  persist(
    (set) => ({
      // Start with default settings
      settings: DEFAULT_SETTINGS,
      initialized: true, // Add initialized flag

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),

      toggleSnow: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            enabled: !state.settings.enabled,
          },
        })),

      // Add a function to reset to defaults
      resetToDefaults: () =>
        set(() => ({
          settings: DEFAULT_SETTINGS,
        })),
    }),
    {
      name: "snow-settings",
      // Only store settings in localStorage
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
)

