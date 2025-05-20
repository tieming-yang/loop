"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ShortStory, Novel } from "@/types/content"
import Link from "next/link"

interface SearchProps {
  initialResults?: (ShortStory | Novel)[]
  initialQuery?: string
}

export default function Search({ initialResults = [], initialQuery = "" }: SearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<(ShortStory | Novel)[]>(initialResults)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchResults()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
  }

  const isNovel = (item: ShortStory | Novel): item is Novel => {
    return "chapters" in item
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative mb-8">
        <Input
          type="search"
          placeholder="搜尋短篇或小說..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 py-6 bg-gray-900 border-gray-700 text-white rounded-3xl"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white rounded-3xl"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </form>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7ec0cd] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-400">搜尋中...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.length > 0 ? (
            <>
              <h2 className="text-xl font-bold mb-4">搜尋結果 ({results.length})</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={`/works/${isNovel(item) ? "novels" : "shorts"}/${item.slug}`}
                    className="block group"
                  >
                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 transition-all hover:border-[#7ec0cd]">
                      <div className="p-4">
                        <h3 className="text-lg font-bold group-hover:text-[#7ec0cd] transition-colors">
                          {item.meta.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-2">{item.meta.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.meta.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-3xl">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          {isNovel(item) ? "小說" : "短篇"} • {item.meta.date}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : query ? (
            <div className="text-center py-8">
              <p className="text-gray-400">沒有找到與 "{query}" 相關的結果</p>
              <p className="text-gray-500 mt-2">
                <Link href="/search" className="text-[#7ec0cd] hover:underline">
                  前往進階搜尋頁面
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

