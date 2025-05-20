"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SearchIcon, X, BookOpen, FileText, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { ShortStory, Novel } from "@/types/content"

interface SearchPageClientProps {
  initialShorts: ShortStory[]
  initialNovels: Novel[]
  tags: string[]
  initialQuery?: string
}

export default function SearchPageClient({
  initialShorts,
  initialNovels,
  tags,
  initialQuery = "",
}: SearchPageClientProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Combine shorts and novels for display
  const allContent = useMemo(() => {
    return [
      ...initialShorts.map((short) => ({
        ...short,
        type: "short" as const,
      })),
      ...initialNovels.map((novel) => ({
        ...novel,
        type: "novel" as const,
      })),
    ]
  }, [initialShorts, initialNovels])

  // Filter content based on search query and selected tags
  const filteredContent = useMemo(() => {
    let results = allContent

    // Filter by search query if present
    if (query) {
      const normalizedQuery = query.toLowerCase()
      results = results.filter(
        (item) =>
          item.meta.title.toLowerCase().includes(normalizedQuery) ||
          item.meta.description.toLowerCase().includes(normalizedQuery) ||
          item.meta.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)),
      )
    }

    // Filter by selected tags if any
    if (selectedTags.length > 0) {
      results = results.filter((item) => selectedTags.some((tag) => item.meta.tags.includes(tag)))
    }

    return results
  }, [allContent, query, selectedTags])

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([])
    setQuery("")
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f10] text-white py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center animate-fade-in">搜尋作品</h1>
        <p className="text-gray-300 mb-8 text-center animate-fade-in animation-delay-200">
          搜尋我的短篇和小說作品，找到您感興趣的內容。
        </p>

        <div className="w-full max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="relative mb-8">
            <Input
              type="search"
              placeholder="搜尋短篇或小說..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 py-6 bg-gray-900 border-gray-700 text-white"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </form>

          {/* Tags Wall */}
          <div className="mb-8 animate-fade-in animation-delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">標籤</h2>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[#7ec0cd] hover:text-[#7ec0cd] hover:bg-[#7ec0cd]/10"
                >
                  清除所有篩選
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className={
                    selectedTags.includes(tag)
                      ? "bg-[#7ec0cd] text-[#0f0f10] hover:bg-[#7ec0cd]/90 hover:text-[#0f0f10]"
                      : "border-gray-700 hover:border-[#7ec0cd] hover:text-[#7ec0cd]"
                  }
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6 animate-fade-in animation-delay-400">
            {filteredContent.length > 0 ? (
              <>
                <h2 className="text-xl font-bold mb-4">
                  搜尋結果 ({filteredContent.length})
                  {selectedTags.length > 0 && (
                    <span className="text-sm font-normal text-gray-400 ml-2">已篩選: {selectedTags.join(", ")}</span>
                  )}
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {filteredContent.map((item) => (
                    <Card
                      key={`${item.type}-${item.id}`}
                      className="bg-gray-900 border-gray-800 overflow-hidden hover:border-[#7ec0cd] transition-all cursor-pointer"
                      onClick={() => router.push(`/works/${item.type === "short" ? "shorts" : "novels"}/${item.slug}`)}
                    >
                      <Link
                        href={`/works/${item.type === "short" ? "shorts" : "novels"}/${item.slug}`}
                        className="block"
                      >
                        <div className="h-48 relative">
                          <Image
                            src={item.meta.coverImage || "/placeholder.svg?height=400&width=600"}
                            alt={item.meta.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            {item.type === "short" ? (
                              <>
                                <FileText className="h-3 w-3 text-[#7ec0cd]" />
                                <span className="text-xs">短篇</span>
                              </>
                            ) : (
                              <>
                                <BookOpen className="h-3 w-3 text-[#7ec0cd]" />
                                <span className="text-xs">小說</span>
                              </>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-400">{item.meta.date}</span>
                          </div>
                          <h3 className="text-lg font-bold mb-2 group-hover:text-[#7ec0cd] transition-colors">
                            {item.meta.title}
                          </h3>
                          <p className="text-gray-300 mb-4 line-clamp-2">{item.meta.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.meta.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  selectedTags.includes(tag)
                                    ? "bg-[#7ec0cd]/20 text-[#7ec0cd]"
                                    : "bg-gray-800 text-gray-300"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="px-6 pb-6 pt-0">
                          <Button variant="link" className="p-0 h-auto">
                            <span className="flex items-center gap-2 text-[#7ec0cd]">
                              閱讀全文 <ArrowRight className="h-4 w-4" />
                            </span>
                          </Button>
                        </CardFooter>
                      </Link>
                    </Card>
                  ))}
                </div>
              </>
            ) : query || selectedTags.length > 0 ? (
              <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <SearchIcon className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">沒有找到相符的結果</h3>
                <p className="text-gray-400 mb-6">
                  {query && `沒有找到與 "${query}" `}
                  {query && selectedTags.length > 0 && "和 "}
                  {selectedTags.length > 0 && `標籤 "${selectedTags.join(", ")}" `}
                  相關的結果
                </p>
                <Button onClick={clearFilters}>清除篩選條件</Button>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <SearchIcon className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">開始搜尋</h3>
                <p className="text-gray-400 mb-6">輸入關鍵字或選擇標籤來搜尋作品</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

