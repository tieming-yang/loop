"use client"
import Link from "next/link"
import Image from "next/image"
import { getNovels } from "@/lib/content"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function NovelsClient() {
  const novels = await getNovels()

  return (
    <main className="min-h-screen bg-gray-950 text-white py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">小說</h1>
        <p className="text-gray-300 mb-12 animate-fade-in animation-delay-200">
          探索我的小說作品，包含長篇和中篇小說。
        </p>

        <div className="grid gap-8">
          {novels.map((novel, index) => (
            <div
              key={novel.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 transition-all hover:border-gray-700 animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
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
                    <span className="text-xs text-gray-400">{novel.meta.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{novel.meta.title}</h2>
                  <p className="text-gray-300 mb-4">{novel.meta.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {novel.meta.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">章節</h3>
                    <ul className="space-y-1">
                      {novel.chapters.slice(0, 3).map((chapter) => (
                        <li key={chapter.id} className="text-gray-300">
                          {chapter.title}
                        </li>
                      ))}
                      {novel.chapters.length > 3 && (
                        <li className="text-gray-400 text-sm">+{novel.chapters.length - 3} 更多章節...</li>
                      )}
                    </ul>
                  </div>
                  <Button asChild>
                    <Link href={`/works/novels/${novel.slug}`} className="flex items-center gap-2">
                      開始閱讀 <ArrowRight className="h-4 w-4" />
                    </Link>
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

