"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { Novel } from "@/types/content"
import { Breadcrumb } from "@/components/breadcrumb"

interface NovelsPageClientProps {
  novels: Novel[]
}

export default function NovelsPageClient({ novels }: NovelsPageClientProps) {
  const router = useRouter()
  const [expandedNovels, setExpandedNovels] = useState<Record<string, boolean>>({})

  const toggleExpand = (novelId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click from triggering
    setExpandedNovels((prev) => ({
      ...prev,
      [novelId]: !prev[novelId],
    }))
  }

  return (
    <main className="min-h-screen text-white py-16 px-4 relative z-10">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "首頁", href: "/" },
              { label: "小說", href: "/works/novels", active: true },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in cyberpunk-text-glow">小說</h1>
          <p className="text-gray-300 mb-6 animate-fade-in animation-delay-200">
            探索我的小說作品，包含長篇和中篇小說。
          </p>
        </div>

        <div className="grid gap-8">
          {novels.map((novel, index) => (
            <div
              key={novel.id}
              className="glass-panel rounded-lg overflow-hidden border border-[#7ec0cd]/30 transition-all hover:border-[#7ec0cd] animate-fade-in cursor-pointer"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
              onClick={() => router.push(`/works/novels/${novel.slug}`)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 md:h-auto relative">
                  <Image
                    src={novel.meta.coverImage || "/placeholder.svg?height=600&width=400"}
                    alt={novel.meta.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#7ec0cd]">{novel.meta.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-[#7ec0cd] transition-colors">
                    {novel.meta.title}
                  </h2>
                  <p className="text-gray-300 mb-4">{novel.meta.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {novel.meta.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-[#7ec0cd]/10 text-[#7ec0cd] rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">章節</h3>
                      {novel.chapters.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#7ec0cd] hover:text-[#7ec0cd] hover:bg-[#7ec0cd]/10"
                          onClick={(e) => toggleExpand(novel.id, e)}
                        >
                          {expandedNovels[novel.id] ? (
                            <span className="flex items-center gap-1">
                              收起 <ChevronUp className="h-4 w-4" />
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              展開全部 ({novel.chapters.length}) <ChevronDown className="h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      )}
                    </div>

                    <ul className="space-y-1">
                      {/* Always show first 3 chapters */}
                      {novel.chapters.slice(0, 3).map((chapter) => (
                        <li
                          key={chapter.id}
                          className="text-gray-300 hover:text-[#7ec0cd] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/works/novels/${novel.slug}?chapter=${chapter.id}`)
                          }}
                        >
                          <Link
                            href={`/works/novels/${novel.slug}?chapter=${chapter.id}`}
                            className="block py-1 px-2 hover:bg-[#7ec0cd]/10 rounded transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {chapter.title}
                          </Link>
                        </li>
                      ))}

                      {/* Conditionally show remaining chapters with animation */}
                      {novel.chapters.length > 3 && (
                        <AnimatePresence>
                          {expandedNovels[novel.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              {novel.chapters.slice(3).map((chapter) => (
                                <motion.li
                                  key={chapter.id}
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-gray-300 hover:text-[#7ec0cd] transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/works/novels/${novel.slug}?chapter=${chapter.id}`)
                                  }}
                                >
                                  <Link
                                    href={`/works/novels/${novel.slug}?chapter=${chapter.id}`}
                                    className="block py-1 px-2 hover:bg-[#7ec0cd]/10 rounded transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {chapter.title}
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </ul>
                  </div>

                  <Button className="bg-[#7ec0cd] hover:bg-[#7ec0cd]/80 text-white border border-[#7ec0cd]">
                    <span className="flex items-center gap-2">
                      開始閱讀 <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

