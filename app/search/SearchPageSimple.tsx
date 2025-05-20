"use client"

import { useState } from "react"
import Link from "next/link"
import { SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ShortStory, Novel } from "@/types/content"

interface SearchPageSimpleProps {
  shorts: ShortStory[]
  novels: Novel[]
  tags: string[]
  initialQuery?: string
}

export function SearchPageSimple({ shorts, novels, tags, initialQuery = "" }: SearchPageSimpleProps) {
  const [query, setQuery] = useState(initialQuery)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Filter content based on search query and selected tags
  const filteredShorts = shorts.filter((short) => {
    // Filter by search query
    const matchesQuery =
      !query ||
      short.meta.title.toLowerCase().includes(query.toLowerCase()) ||
      short.meta.description.toLowerCase().includes(query.toLowerCase())

    // Filter by tags
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => short.meta.tags.includes(tag))

    return matchesQuery && matchesTags
  })

  const filteredNovels = novels.filter((novel) => {
    // Filter by search query
    const matchesQuery =
      !query ||
      novel.meta.title.toLowerCase().includes(query.toLowerCase()) ||
      novel.meta.description.toLowerCase().includes(query.toLowerCase())

    // Filter by tags
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => novel.meta.tags.includes(tag))

    return matchesQuery && matchesTags
  })

  const totalResults = filteredShorts.length + filteredNovels.length

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([])
    setQuery("")
  }

  return (
    <main className="min-h-screen text-white py-16 px-4 relative z-10">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center cyberpunk-text-glow">搜尋作品</h1>
          <p className="text-gray-300 mb-8 text-center">搜尋我的短篇和小說作品，找到您感興趣的內容。</p>
        </div>

        <div className="w-full max-w-3xl mx-auto mb-12">
          {/* Search Input - Removed background */}
          <div className="mb-8">
            <div className="relative">
              <Input
                type="search"
                placeholder="搜尋短篇或小說..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10 py-6 bg-transparent border-[#7ec0cd]/30 text-white rounded-3xl focus:border-[#7ec0cd]"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7ec0cd] h-5 w-5" />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white rounded-3xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Tags Wall */}
          <div className="glass-panel p-4 rounded-lg mb-8 animate-fade-in animation-delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold cyberpunk-text-glow">標籤</h2>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[#7ec0cd] hover:text-[#7ec0cd] hover:bg-[#7ec0cd]/10 rounded-3xl"
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
                      ? "bg-[#7ec0cd] text-[#0f0f10] hover:bg-[#7ec0cd]/90 hover:text-[#0f0f10] rounded-3xl"
                      : "border-[#7ec0cd]/30 hover:border-[#7ec0cd] hover:text-[#7ec0cd] rounded-3xl"
                  }
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="glass-panel p-4 rounded-lg animate-fade-in animation-delay-400">
            {totalResults > 0 ? (
              <>
                <h2 className="text-xl font-bold mb-4 cyberpunk-text-glow">
                  搜尋結果 ({totalResults})
                  {selectedTags.length > 0 && (
                    <span className="text-sm font-normal text-gray-400 ml-2">已篩選: {selectedTags.join(", ")}</span>
                  )}
                </h2>

                {/* Short Stories */}
                {filteredShorts.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-[#7ec0cd]">短篇 ({filteredShorts.length})</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredShorts.map((short) => (
                        <div
                          key={short.id}
                          className="bg-[#0f0f10]/50 rounded-lg overflow-hidden border border-[#7ec0cd]/30 hover:border-[#7ec0cd] transition-all"
                        >
                          <Link href={`/works/shorts/${short.slug}`} className="block p-4">
                            <h4 className="font-bold mb-2 text-white hover:text-[#7ec0cd] transition-colors">
                              {short.meta.title}
                            </h4>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{short.meta.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {short.meta.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`text-xs px-2 py-0.5 rounded-3xl ${
                                    selectedTags.includes(tag)
                                      ? "bg-[#7ec0cd]/20 text-[#7ec0cd]"
                                      : "bg-[#0f0f10]/70 text-gray-300"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">{short.meta.date}</p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Novels - Changed color to match primary */}
                {filteredNovels.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#7ec0cd]">小說 ({filteredNovels.length})</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredNovels.map((novel) => (
                        <div
                          key={novel.id}
                          className="bg-[#0f0f10]/50 rounded-lg overflow-hidden border border-[#7ec0cd]/30 hover:border-[#7ec0cd] transition-all"
                        >
                          <Link href={`/works/novels/${novel.slug}`} className="block p-4">
                            <h4 className="font-bold mb-2 text-white hover:text-[#7ec0cd] transition-colors">
                              {novel.meta.title}
                            </h4>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{novel.meta.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {novel.meta.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`text-xs px-2 py-0.5 rounded-3xl ${
                                    selectedTags.includes(tag)
                                      ? "bg-[#7ec0cd]/20 text-[#7ec0cd]"
                                      : "bg-[#0f0f10]/70 text-gray-300"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">{novel.meta.date}</p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-[#0f0f10]/50 rounded-lg border border-gray-800">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0f0f10]/70 flex items-center justify-center">
                  <SearchIcon className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">沒有找到相符的結果</h3>
                <p className="text-gray-400 mb-6">
                  {query && `沒有找到與 "${query}" `}
                  {query && selectedTags.length > 0 && "和 "}
                  {selectedTags.length > 0 && `標籤 "${selectedTags.join(", ")}" `}
                  相關的結果
                </p>
                <Button onClick={clearFilters} className="rounded-3xl bg-[#7ec0cd] hover:bg-[#7ec0cd]/90 text-black">
                  清除篩選條件
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

