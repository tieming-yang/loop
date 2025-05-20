"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Type,
  Minus,
  Plus,
  Bookmark,
  Search,
  Share,
  Palette,
  ArrowLeft,
  LayoutListIcon as LetterSpacing,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useReaderStore } from "@/hooks/use-reader-store"
import { BookmarksPanel } from "@/components/bookmarks-panel"
import { ShareDialog } from "@/components/share-dialog"
import { toast } from "@/hooks/use-toast"
import { ColorPicker, getContrastColor, isLightColor } from "@/components/ui/color-picker"
import { useRouter } from "next/navigation"
import type { ThemeOption } from "@/types/reader"
import { Breadcrumb, type BreadcrumbItem } from "@/components/breadcrumb"

type ReaderProps = {
  content: string
  className?: string
  totalPages?: number
  currentPage?: number
  chapterTitle?: string
  contentPath: string
  chapterId?: string
  onNextPage?: () => void | string
  onPrevPage?: () => void | string
  returnUrl?: string
  isShort?: boolean
  nextShortSlug?: string
  prevShortSlug?: string
  breadcrumbItems?: BreadcrumbItem[]
}

export default function Reader({
  content,
  className,
  totalPages = 497,
  currentPage = 22,
  chapterTitle = "",
  contentPath,
  chapterId,
  onNextPage,
  onPrevPage,
  returnUrl = "/",
  isShort = false,
  nextShortSlug,
  prevShortSlug,
  breadcrumbItems,
}: ReaderProps) {
  const router = useRouter()
  const {
    bookmarks,
    highlights,
    settings,
    addBookmark,
    removeBookmark,
    addHighlight,
    removeHighlight,
    updateSettings,
    savePosition,
  } = useReaderStore(contentPath)

  const [menuOpen, setMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(true)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTablet = useMediaQuery("(max-width: 768px)")

  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState("notoSerifTC") // Default to Noto Serif TC
  const [theme, setTheme] = useState<ThemeOption>("light")
  const [customBackgroundColor, setCustomBackgroundColor] = useState("#FFFFFF")
  const [customTextColor, setCustomTextColor] = useState("#000000")
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [transparency, setTransparency] = useState(0) // New state for background transparency

  // Hide bottom navigation when in reading mode
  useEffect(() => {
    // More comprehensive approach to hide the bottom navigation
    // Target both by class and by component structure
    const bottomNavs = [
      document.querySelector('[class*="bottom-4 left-1/2 transform -translate-x-1/2 z-50"]'),
      document.querySelector('nav[class*="rounded-3xl"]'),
      document.querySelector('div[class*="fixed bottom-4"]'),
    ]

    // Hide all possible navigation elements
    bottomNavs.forEach((nav) => {
      if (nav) {
        nav.classList.add("hidden")
        // Additional approach: set display none directly
        ;(nav as HTMLElement).style.display = "none"
      }
    })

    return () => {
      // Restore bottom nav visibility when component unmounts
      bottomNavs.forEach((nav) => {
        if (nav) {
          nav.classList.remove("hidden")
          ;(nav as HTMLElement).style.display = ""
        }
      })
    }
  }, []) // Only run once on mount

  const themeStyles = {
    light: "bg-white text-gray-900",
    sepia: "bg-amber-50 text-amber-900",
    dark: "bg-gray-900 text-gray-100",
    black: "bg-black text-gray-100",
    custom: "",
  }

  // Updated font families with Chinese options only
  const fontFamilies = {
    notoSansTC: "font-noto-sans-tc",
    notoSerifTC: "font-noto-serif-tc",
    maShanZheng: "font-ma-shan-zheng",
    zcoolQingKeHuangYou: "font-zcool-qingke-huangyou",
    zcoolXiaoWei: "font-zcool-xiaowei",
  }

  // Font display names for UI
  const fontDisplayNames = {
    notoSansTC: "思源黑體",
    notoSerifTC: "思源宋體",
    maShanZheng: "馬善政體",
    zcoolQingKeHuangYou: "清刻黄油體",
    zcoolXiaoWei: "小魏體",
  }

  // Initialize state from settings
  useEffect(() => {
    if (settings) {
      // Only update if values are different to avoid unnecessary re-renders
      if (settings.fontSize !== fontSize) {
        setFontSize(settings.fontSize)
      }
      if (settings.fontFamily !== fontFamily) {
        setFontFamily(settings.fontFamily)
      }
      if (settings.theme !== theme) {
        setTheme(settings.theme)
      }
      if (settings.customBackgroundColor !== customBackgroundColor) {
        setCustomBackgroundColor(settings.customBackgroundColor)
      }
      if (settings.customTextColor !== customTextColor) {
        setCustomTextColor(settings.customTextColor)
      }
      if (settings.letterSpacing !== undefined && settings.letterSpacing !== letterSpacing) {
        setLetterSpacing(settings.letterSpacing)
      }
      if (settings.lineHeight !== undefined && settings.lineHeight !== lineHeight) {
        setLineHeight(settings.lineHeight)
      }
      if (settings.transparency !== undefined && settings.transparency !== transparency) {
        setTransparency(settings.transparency)
      }
    }
  }, [settings])

  // Save settings when they change
  const updateReaderSettings = useCallback(
    (newSettings: Partial<typeof settings>) => {
      updateSettings(newSettings)
    },
    [updateSettings],
  )

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)
    updateReaderSettings({ fontSize: newSize })
  }

  const handleFontFamilyChange = (newFamily: string) => {
    setFontFamily(newFamily)
    updateReaderSettings({ fontFamily: newFamily })
  }

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme)
    updateReaderSettings({ theme: newTheme })
  }

  const handleBackgroundColorChange = (newColor: string) => {
    setCustomBackgroundColor(newColor)
    // Always calculate and set the text color based on the background
    const newTextColor = getContrastColor(newColor)
    setCustomTextColor(newTextColor)
    updateReaderSettings({
      theme: "custom",
      customBackgroundColor: newColor,
      customTextColor: newTextColor,
    })
  }

  // New handler for transparency
  const handleTransparencyChange = (newTransparency: number) => {
    setTransparency(newTransparency)
    updateReaderSettings({ transparency: newTransparency })
  }

  // New handlers for letter spacing and line height
  const handleLetterSpacingChange = (newSpacing: number) => {
    setLetterSpacing(newSpacing)
    updateReaderSettings({ letterSpacing: newSpacing })
  }

  const handleLineHeightChange = (newHeight: number) => {
    setLineHeight(newHeight)
    updateReaderSettings({ lineHeight: newHeight })
  }

  const increaseSize = () => {
    const newSize = Math.min(fontSize + 1, 24)
    handleFontSizeChange(newSize)
  }

  const decreaseSize = () => {
    const newSize = Math.max(fontSize - 1, 12)
    handleFontSizeChange(newSize)
  }

  const handleContentClick = () => {
    // Only toggle controls on mobile/tablet
    if (isTablet) {
      setShowControls(!showControls)
      if (activePanel) {
        setActivePanel(null)
      }
    }
  }

  const handleAddBookmark = () => {
    // Get the first 50 characters of the visible content as the bookmark text
    let bookmarkText = ""
    if (contentRef.current) {
      const visibleText = contentRef.current.innerText.substring(0, 50) + "..."
      bookmarkText = visibleText
    }

    const newBookmark = addBookmark({
      pageNumber: currentPage,
      text: bookmarkText,
      chapterId,
    })

    toast({
      title: "Bookmark added",
      description: "Your bookmark has been saved",
    })
  }

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  const handlePrevNavigation = () => {
    if (isShort && prevShortSlug) {
      // Navigate to previous short story
      router.push(`/works/shorts/${prevShortSlug}`)
    } else if (typeof onPrevPage === "function") {
      // Use existing novel chapter navigation
      onPrevPage()
    } else if (onPrevPage) {
      router.push(onPrevPage)
    }
  }

  const handleNextNavigation = () => {
    if (isShort && nextShortSlug) {
      // Navigate to next short story
      router.push(`/works/shorts/${nextShortSlug}`)
    } else if (typeof onNextPage === "function") {
      // Use existing novel chapter navigation
      onNextPage()
    } else if (onNextPage) {
      router.push(onNextPage)
    }
  }

  // Auto-hide controls after a delay (only for mobile/tablet)
  useEffect(() => {
    if (isTablet && showControls && !menuOpen && !activePanel) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, menuOpen, activePanel, isTablet])

  // Save current position
  useEffect(() => {
    // Use a debounce to avoid too frequent updates
    const timer = setTimeout(() => {
      if (contentRef.current) {
        savePosition({
          pageNumber: currentPage,
          chapterId,
          scrollPosition: contentRef.current.scrollTop || 0,
        })
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timer)
  }, [currentPage, chapterId, savePosition])

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    // Remove the hash if it exists
    hex = hex.replace("#", "")

    // Parse the hex values
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    // Return the RGB values
    return { r, g, b }
  }

  // Get custom styles for the reader
  const getCustomStyles = () => {
    if (theme === "custom") {
      // Apply transparency to background color
      const bgColor = customBackgroundColor
      let bgColorWithTransparency = bgColor

      if (transparency > 0) {
        // Extract RGB components using the helper function
        const rgb = hexToRgb(bgColor)

        // Calculate alpha value (0-1)
        const alpha = 1 - transparency / 100

        // Create rgba color
        bgColorWithTransparency = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
      }

      return {
        backgroundColor: bgColorWithTransparency,
        color: customTextColor,
        "--selection-bg": "rgba(126, 192, 205, 0.3)", // Primary color with transparency
      } as React.CSSProperties
    }

    // For built-in themes, apply transparency if needed
    if (transparency > 0) {
      let baseColor
      switch (theme) {
        case "light":
          baseColor = "255, 255, 255" // white
          break
        case "sepia":
          baseColor = "255, 251, 235" // amber-50
          break
        case "dark":
          baseColor = "17, 24, 39" // gray-900
          break
        case "black":
          baseColor = "0, 0, 0" // black
          break
        default:
          baseColor = "255, 255, 255"
      }

      const alpha = 1 - transparency / 100
      return {
        backgroundColor: `rgba(${baseColor}, ${alpha})`,
        "--selection-bg": "rgba(126, 192, 205, 0.3)",
      } as React.CSSProperties
    }

    return {
      "--selection-bg": "rgba(126, 192, 205, 0.3)", // Primary color with transparency
    } as React.CSSProperties
  }

  // Add a function to ensure proper contrast for text elements
  const ensureProperContrast = () => {
    if (theme === "custom" && contentRef.current) {
      // Apply proper contrast to all text elements
      const links = contentRef.current.querySelectorAll("a")
      const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
      const paragraphs = contentRef.current.querySelectorAll("p")
      const listItems = contentRef.current.querySelectorAll("li")

      const isLight = isLightColor(customBackgroundColor)

      // Set link colors based on background
      links.forEach((link) => {
        link.style.color = isLight ? "#0066cc" : "#66b3ff" // Darker blue for light bg, lighter blue for dark bg
      })

      // Ensure headings have proper contrast
      headings.forEach((heading) => {
        heading.style.color = customTextColor
      })

      // Ensure paragraphs have proper contrast
      paragraphs.forEach((paragraph) => {
        paragraph.style.color = customTextColor
      })

      // Ensure list items have proper contrast
      listItems.forEach((item) => {
        item.style.color = customTextColor
      })

      // Set the main content color
      contentRef.current.style.color = customTextColor
    }
  }

  // Call the contrast function when content or theme changes
  useEffect(() => {
    ensureProperContrast()
  }, [theme, customBackgroundColor, customTextColor, content])

  // Get prose styles based on background color
  const getProseStyles = () => {
    if (theme === "custom") {
      const isLight = isLightColor(customBackgroundColor)
      return isLight ? "prose-gray" : "prose-invert"
    }

    // Default prose styles for built-in themes
    switch (theme) {
      case "light":
      case "sepia":
        return "prose-gray"
      case "dark":
      case "black":
        return "prose-invert"
      default:
        return "prose-gray"
    }
  }

  // Format letter spacing value for display
  const formatLetterSpacing = (value: number) => {
    if (value === 0) return "標準"
    return value > 0 ? `+${value}px` : `${value}px`
  }

  // Format line height value for display
  const formatLineHeight = (value: number) => {
    return `${value.toFixed(1)}`
  }

  // Format transparency value for display
  const formatTransparency = (value: number) => {
    return `${value}%`
  }

  // Render the desktop sidebar
  const renderDesktopSidebar = () => {
    return (
      <div className="fixed left-0 top-0 bottom-0 w-16 bg-gray-900/90 backdrop-blur-sm border-r border-gray-800 flex flex-col items-center py-6 z-40">
        {/* Back button - changed from Home to ArrowLeft */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white mb-8"
          onClick={() => router.push(returnUrl)}
          title="Return to Previous Page"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex flex-col items-center gap-6">
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={handlePrevNavigation}
            disabled={!onPrevPage && !prevShortSlug}
            title={isShort ? "Previous Short Story" : "Previous Chapter"}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={handleNextNavigation}
            disabled={!onNextPage && !nextShortSlug}
            title={isShort ? "Next Short Story" : "Next Chapter"}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Divider */}
          <div className="w-8 h-px bg-gray-700 my-2"></div>

          {/* Tools */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setActivePanel("bookmarks")}
            title="Bookmarks & Highlights"
          >
            <Bookmark className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setActivePanel("search")}
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-white" onClick={handleShare} title="Share">
            <Share className="h-5 w-5" />
          </Button>

          {/* Divider */}
          <div className="w-8 h-px bg-gray-700 my-2"></div>

          {/* Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white" title="Theme Settings">
                <Palette className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" side="right">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Background Color</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <ColorPicker
                        value={theme === "custom" ? customBackgroundColor : "#FFFFFF"}
                        onChange={handleBackgroundColorChange}
                      />
                      <span className="text-sm">Custom</span>
                    </div>

                    <RadioGroup value={theme} onValueChange={handleThemeChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-white border border-gray-200"></div>
                          Light
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sepia" id="sepia" />
                        <Label htmlFor="sepia" className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-amber-50 border border-amber-100"></div>
                          Sepia
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-gray-900 border border-gray-700"></div>
                          Dark
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="black" id="black" />
                        <Label htmlFor="black" className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-black border border-gray-700"></div>
                          Black
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* New transparency slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium leading-none">背景透明度</h4>
                    <span className="text-sm">{formatTransparency(transparency)}</span>
                  </div>
                  <Slider
                    value={[transparency]}
                    min={0}
                    max={90}
                    step={5}
                    onValueChange={(values) => handleTransparencyChange(values[0])}
                    className="mt-2"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white" title="Font Settings">
                <Type className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" side="right">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Font Size</h4>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={decreaseSize} className="text-gray-500">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm w-8 text-center">{fontSize}</span>
                    <Button variant="ghost" size="icon" onClick={increaseSize} className="text-gray-500">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Font</h4>
                  <RadioGroup
                    value={fontFamily}
                    onValueChange={handleFontFamilyChange}
                    className="max-h-60 overflow-y-auto"
                  >
                    {/* Chinese fonts */}
                    {Object.entries(fontDisplayNames).map(([key, name]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className={fontFamilies[key as keyof typeof fontFamilies]}>
                          {name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* New popover for text spacing settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white" title="Text Spacing">
                <LetterSpacing className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" side="right">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium leading-none">字元間距</h4>
                    <span className="text-sm">{formatLetterSpacing(letterSpacing)}</span>
                  </div>
                  <Slider
                    value={[letterSpacing]}
                    min={-2}
                    max={10}
                    step={0.5}
                    onValueChange={(values) => handleLetterSpacingChange(values[0])}
                    className="mt-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium leading-none">行高</h4>
                    <span className="text-sm">{formatLineHeight(lineHeight)}</span>
                  </div>
                  <Slider
                    value={[lineHeight]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={(values) => handleLineHeightChange(values[0])}
                    className="mt-2"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Page indicator - only show for novels, not shorts */}
        {!isShort && (
          <div className="text-white text-xs mt-auto mb-4">
            {currentPage}/{totalPages}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative min-h-screen w-full", className)}>
      {/* Reading Content */}
      <div
        className={cn(
          "transition-colors min-h-screen",
          theme !== "custom" ? themeStyles[theme] : "",
          !isTablet ? "pl-16" : "p-4 md:p-8 lg:p-12", // Add left padding for desktop to accommodate sidebar
        )}
        style={getCustomStyles()}
        onClick={handleContentClick}
      >
        {breadcrumbItems && (
          <div className="max-w-3xl mx-auto pt-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        )}
        <div
          ref={contentRef}
          className={cn(
            `prose prose-lg mx-auto transition-all pb-24 ${getProseStyles()} reader-content`,
            fontFamilies[fontFamily as keyof typeof fontFamilies],
            !isTablet && "max-w-3xl", // Limit content width on desktop
          )}
          style={{
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}px`,
            lineHeight: lineHeight,
            ...(theme === "custom" ? { color: customTextColor } : {}),
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Desktop sidebar - only visible on larger screens */}
      {!isTablet && renderDesktopSidebar()}

      {/* Close panel button - only visible when a panel is open */}
      {activePanel && (
        <button
          className="fixed top-4 right-4 z-50 bg-gray-800/80 text-white rounded-full p-2"
          onClick={() => setActivePanel(null)}
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Bottom controls - only for mobile/tablet */}
      {isTablet && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40 transition-all duration-300",
            showControls ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          style={{ transform: showControls ? "translateY(0)" : "translateY(100%)" }}
        >
          {/* Main reading controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800">
            {/* Left side - Menu button */}
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>

            {/* Center - Page indicator - only show for novels, not shorts */}
            {!isShort && (
              <div className="text-white text-sm">
                {currentPage} of {totalPages}
              </div>
            )}

            {/* Right side - Quick settings */}
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Palette className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Background Color</h4>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <ColorPicker
                            value={theme === "custom" ? customBackgroundColor : "#FFFFFF"}
                            onChange={handleBackgroundColorChange}
                          />
                          <span className="text-sm">Custom</span>
                        </div>

                        <RadioGroup value={theme} onValueChange={handleThemeChange}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light-mobile" />
                            <Label htmlFor="light-mobile" className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-white border border-gray-200"></div>
                              Light
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sepia" id="sepia-mobile" />
                            <Label htmlFor="sepia-mobile" className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-amber-50 border border-amber-100"></div>
                              Sepia
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark-mobile" />
                            <Label htmlFor="dark-mobile" className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-gray-900 border border-gray-700"></div>
                              Dark
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="black" id="black-mobile" />
                            <Label htmlFor="black-mobile" className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-black border border-gray-700"></div>
                              Black
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* New transparency slider for mobile */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium leading-none">背景透明度</h4>
                        <span className="text-sm">{formatTransparency(transparency)}</span>
                      </div>
                      <Slider
                        value={[transparency]}
                        min={0}
                        max={90}
                        step={5}
                        onValueChange={(values) => handleTransparencyChange(values[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Type className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Font Size</h4>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={decreaseSize} className="text-gray-500">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm w-8 text-center">{fontSize}</span>
                        <Button variant="ghost" size="icon" onClick={increaseSize} className="text-gray-500">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Font</h4>
                      <RadioGroup
                        value={fontFamily}
                        onValueChange={handleFontFamilyChange}
                        className="max-h-60 overflow-y-auto"
                      >
                        {/* Chinese fonts */}
                        {Object.entries(fontDisplayNames).map(([key, name]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <RadioGroupItem value={key} id={`${key}-mobile`} />
                            <Label htmlFor={`${key}-mobile`} className={fontFamilies[key as keyof typeof fontFamilies]}>
                              {name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* New text spacing popover for mobile */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <LetterSpacing className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium leading-none">字元間距</h4>
                        <span className="text-sm">{formatLetterSpacing(letterSpacing)}</span>
                      </div>
                      <Slider
                        value={[letterSpacing]}
                        min={-2}
                        max={10}
                        step={0.5}
                        onValueChange={(values) => handleLetterSpacingChange(values[0])}
                        className="mt-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium leading-none">行高</h4>
                        <span className="text-sm">{formatLineHeight(lineHeight)}</span>
                      </div>
                      <Slider
                        value={[lineHeight]}
                        min={1}
                        max={3}
                        step={0.1}
                        onValueChange={(values) => handleLineHeightChange(values[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="icon" className="text-white" onClick={handleShare}>
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-up menu with animation - only for mobile/tablet */}
      {isTablet && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-50 transition-all duration-300 ease-in-out border-t border-gray-800",
            menuOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none",
          )}
        >
          <div className="p-4 flex flex-col gap-6">
            {/* Navigation Controls */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-sm font-medium">Navigation</h3>
              <div className="grid grid-cols-3 gap-2">
                {/* Also update the mobile menu to use ArrowLeft instead of Home */}
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700"
                  onClick={() => router.push(returnUrl)}
                >
                  <ArrowLeft className="h-6 w-6 mb-2" />
                  <span className="text-xs">Back</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700"
                  onClick={handlePrevNavigation}
                  disabled={!onPrevPage && !prevShortSlug}
                >
                  <ChevronLeft className="h-6 w-6 mb-2" />
                  <span className="text-xs">Previous</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700"
                  onClick={handleNextNavigation}
                  disabled={!onNextPage && !nextShortSlug}
                >
                  <ChevronRight className="h-6 w-6 mb-2" />
                  <span className="text-xs">Next</span>
                </Button>
              </div>
            </div>

            {/* Tools */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-sm font-medium">Tools</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700"
                  onClick={() => {
                    setMenuOpen(false)
                    setActivePanel("bookmarks")
                  }}
                >
                  <Bookmark className="h-6 w-6 mb-2" />
                  <span className="text-xs">Bookmarks</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700"
                  onClick={() => {
                    setMenuOpen(false)
                    setActivePanel("search")
                  }}
                >
                  <Search className="h-6 w-6 mb-2" />
                  <span className="text-xs">Search</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700"
                  onClick={() => {
                    setMenuOpen(false)
                    handleShare()
                  }}
                >
                  <Share className="h-6 w-6 mb-2" />
                  <span className="text-xs">Share</span>
                </Button>
              </div>
            </div>

            {/* Close button */}
            <Button variant="secondary" className="w-full mt-2" onClick={() => setMenuOpen(false)}>
              Close Menu
            </Button>
          </div>
        </div>
      )}

      {/* Bookmarks & Highlights Panel */}
      {activePanel === "bookmarks" && (
        <div className="fixed inset-0 bg-gray-900/95 z-50 overflow-auto">
          <BookmarksPanel
            bookmarks={bookmarks}
            highlights={highlights}
            onBookmarkClick={(bookmark) => {
              // Navigate to bookmark
              setActivePanel(null)
            }}
            onHighlightClick={(highlight) => {
              // Navigate to highlight
              setActivePanel(null)
            }}
            onDeleteBookmark={removeBookmark}
            onDeleteHighlight={removeHighlight}
            onClose={() => setActivePanel(null)}
          />
        </div>
      )}

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        title={chapterTitle || "Reading"}
        url={window.location.href}
      />
    </div>
  )
}

