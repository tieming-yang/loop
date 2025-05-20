"use client"

import { useState, useEffect } from "react"
import type { Bookmark, Highlight, ReaderPosition, ReaderSettings } from "@/types/reader"
import { getContrastColor } from "@/components/ui/color-picker"

const STORAGE_KEYS = {
  BOOKMARKS: "reader-bookmarks",
  HIGHLIGHTS: "reader-highlights",
  POSITIONS: "reader-positions",
  SETTINGS: "reader-settings",
}

export function useReaderStore(contentPath: string) {
  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  // Highlights
  const [highlights, setHighlights] = useState<Highlight[]>([])

  // Reader position
  const [position, setPosition] = useState<ReaderPosition | null>(null)

  // Reader settings
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 16,
    fontFamily: "notoSerifTC", // Default to Noto Serif TC
    theme: "dark",
    customBackgroundColor: "#FFFFFF",
    customTextColor: "#000000",
    letterSpacing: 0,
    lineHeight: 1.5,
    transparency: 0,
  })

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load bookmarks
      const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS)
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks))
      }

      // Load highlights
      const storedHighlights = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS)
      if (storedHighlights) {
        setHighlights(JSON.parse(storedHighlights))
      }

      // Load positions
      const storedPositions = localStorage.getItem(STORAGE_KEYS.POSITIONS)
      if (storedPositions) {
        const positions = JSON.parse(storedPositions) as ReaderPosition[]
        const currentPosition = positions.find((p) => p.contentPath === contentPath)
        if (currentPosition) {
          setPosition(currentPosition)
        }
      }

      // Load settings
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings)
        // Ensure we have all the new fields
        if (!parsedSettings.customBackgroundColor) {
          parsedSettings.customBackgroundColor = "#FFFFFF"
          parsedSettings.customTextColor = "#000000"
        }
        if (parsedSettings.letterSpacing === undefined) {
          parsedSettings.letterSpacing = 0
        }
        if (parsedSettings.lineHeight === undefined) {
          parsedSettings.lineHeight = 1.5
        }
        if (parsedSettings.transparency === undefined) {
          parsedSettings.transparency = 0
        }
        setSettings(parsedSettings)
      }
    } catch (error) {
      console.error("Error loading reader data from localStorage:", error)
    }
  }, [contentPath])

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks))
    } catch (error) {
      console.error("Error saving bookmarks to localStorage:", error)
    }
  }, [bookmarks])

  // Save highlights to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights))
    } catch (error) {
      console.error("Error saving highlights to localStorage:", error)
    }
  }, [highlights])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error("Error saving settings to localStorage:", error)
    }
  }, [settings])

  // Save position to localStorage
  const savePosition = (newPosition: Partial<ReaderPosition>) => {
    try {
      // Only update if there's a meaningful change to avoid infinite loops
      if (
        !position ||
        newPosition.pageNumber !== position.pageNumber ||
        newPosition.scrollPosition !== position.scrollPosition ||
        newPosition.chapterId !== position.chapterId
      ) {
        const storedPositions = localStorage.getItem(STORAGE_KEYS.POSITIONS)
        let positions: ReaderPosition[] = []

        if (storedPositions) {
          positions = JSON.parse(storedPositions)
          // Remove existing position for this content if it exists
          positions = positions.filter((p) => p.contentPath !== contentPath)
        }

        const updatedPosition: ReaderPosition = {
          contentPath,
          scrollPosition: newPosition.scrollPosition || 0,
          pageNumber: newPosition.pageNumber || 1,
          chapterId: newPosition.chapterId,
        }

        positions.push(updatedPosition)
        localStorage.setItem(STORAGE_KEYS.POSITIONS, JSON.stringify(positions))
        setPosition(updatedPosition)
      }
    } catch (error) {
      console.error("Error saving position to localStorage:", error)
    }
  }

  // Add a bookmark
  const addBookmark = (bookmark: Omit<Bookmark, "id" | "timestamp" | "contentPath">) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      contentPath,
    }

    setBookmarks((prev) => [...prev, newBookmark])
    return newBookmark
  }

  // Remove a bookmark
  const removeBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId))
  }

  // Add a highlight
  const addHighlight = (highlight: Omit<Highlight, "id" | "timestamp" | "contentPath">) => {
    const newHighlight: Highlight = {
      ...highlight,
      id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      contentPath,
    }

    setHighlights((prev) => [...prev, newHighlight])
    return newHighlight
  }

  // Update a highlight
  const updateHighlight = (highlightId: string, updates: Partial<Highlight>) => {
    setHighlights((prev) =>
      prev.map((highlight) => (highlight.id === highlightId ? { ...highlight, ...updates } : highlight)),
    )
  }

  // Remove a highlight
  const removeHighlight = (highlightId: string) => {
    setHighlights((prev) => prev.filter((highlight) => highlight.id !== highlightId))
  }

  // Update settings
  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updatedSettings = { ...prev, ...newSettings }

      // If updating background color, automatically set text color based on contrast
      if (newSettings.customBackgroundColor) {
        // Always recalculate text color when background changes
        updatedSettings.customTextColor = getContrastColor(newSettings.customBackgroundColor)
      }

      return updatedSettings
    })
  }

  return {
    bookmarks: bookmarks.filter((b) => b.contentPath === contentPath),
    allBookmarks: bookmarks,
    highlights: highlights.filter((h) => h.contentPath === contentPath),
    allHighlights: highlights,
    position,
    settings,
    addBookmark,
    removeBookmark,
    addHighlight,
    updateHighlight,
    removeHighlight,
    savePosition,
    updateSettings,
  }
}

