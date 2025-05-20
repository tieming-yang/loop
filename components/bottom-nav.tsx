"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, BookOpen, Heart, Search, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isReaderActive, setIsReaderActive] = useState(false)
  const [activeTabRect, setActiveTabRect] = useState({ left: 0, width: 0, center: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const navItems = [
    { href: "/", label: "首頁", icon: Home },
    { href: "/works/shorts", label: "短篇", icon: FileText },
    { href: "/works/novels", label: "小說", icon: BookOpen },
    { href: "/support-me", label: "支持我", icon: Heart },
    { href: "/search", label: "搜尋", icon: Search },
  ]

  useEffect(() => {
    // Check if we're in a reader page
    const isInReaderMode = pathname.includes("/shorts/") || pathname.includes("/novels/")
    setIsReaderActive(isInReaderMode)
  }, [lastScrollY, pathname])

  // Update the active tab indicator position
  useEffect(() => {
    const updateActiveTabPosition = () => {
      // Find the active tab index based on the current pathname
      const activeIndex = navItems.findIndex((item) => {
        if (item.href === "/") {
          return pathname === "/"
        } else {
          return pathname.startsWith(item.href)
        }
      })

      // If we found an active tab and its ref exists
      if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
        const activeTab = tabRefs.current[activeIndex]
        const navElement = navRef.current

        if (activeTab && navElement) {
          const tabRect = activeTab.getBoundingClientRect()
          const navRect = navElement.getBoundingClientRect()

          // Calculate center position and make width 50% of tab width
          const tabCenter = tabRect.left + tabRect.width / 2 - navRect.left
          const underlineWidth = tabRect.width * 0.5

          setActiveTabRect({
            left: tabCenter - underlineWidth / 2,
            width: underlineWidth,
            center: tabCenter,
          })
        }
      }
    }

    // Update on mount and when pathname changes
    // Use a small timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      updateActiveTabPosition()
    }, 50)

    // Also update on window resize
    window.addEventListener("resize", updateActiveTabPosition)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateActiveTabPosition)
    }
  }, [pathname])

  // Scroll to top on route change, except when using browser back/forward
  useEffect(() => {
    // Store the current pathname in session storage when navigating
    const handleRouteChange = () => {
      sessionStorage.setItem("lastPath", pathname)
      window.scrollTo(0, 0)
    }

    // Add event listener for route changes
    window.addEventListener("beforeunload", handleRouteChange)

    // Check if this is a back/forward navigation
    const lastPath = sessionStorage.getItem("lastPath")
    const isBackNavigation = lastPath && lastPath !== pathname

    // If not a back navigation, scroll to top
    if (!isBackNavigation) {
      window.scrollTo(0, 0)
    }

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange)
    }
  }, [pathname])

  // Don't render the navigation if in reader mode
  if (isReaderActive) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 w-full left-0 flex justify-center z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <nav
          ref={navRef}
          className="flex items-center justify-around gap-1 px-2 py-2 glass-panel rounded-full border border-[#00e5ff]/30 relative overflow-hidden"
        >
          {/* Animated underline indicator */}
          <motion.div
            className="absolute bottom-0 h-1 bg-white rounded-full glow-underline"
            initial={false}
            animate={{
              left: activeTabRect.left,
              width: activeTabRect.width,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />

          {navItems.map((item, index) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => (tabRefs.current[index] = el)}
                className={cn(
                  "flex flex-col items-center justify-center px-4 py-2 text-xs transition-colors",
                  isActive ? "text-white cyberpunk-text-glow" : "text-gray-400 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </motion.div>
    </AnimatePresence>
  )
}

