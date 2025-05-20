"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  label: string
  href: string
  active?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-1.5 h-4 w-4 text-gray-500" />}

              {isLast ? (
                <span className="font-medium text-white" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-[#7ec0cd] transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

