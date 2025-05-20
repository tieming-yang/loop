"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ShortStory } from "@/types/content"
import { Breadcrumb } from "@/components/breadcrumb"

interface ShortsPageClientProps {
  shorts: ShortStory[]
}

export default function ShortsPageClient({ shorts }: ShortsPageClientProps) {
  const router = useRouter()

  return (
    <main className="min-h-screen text-white py-16 px-4 relative z-10">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "首頁", href: "/" },
              { label: "短篇故事", href: "/works/shorts", active: true },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in cyberpunk-text-glow">短篇故事</h1>
          <p className="text-gray-300 mb-6 animate-fade-in animation-delay-200">
            探索我的短篇故事集，包含各種風格和主題的作品。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shorts.map((short, index) => (
            <Card
              key={short.id}
              className="glass-panel border-[#00e5ff]/20 overflow-hidden hover:border-[#00e5ff] transition-all group animate-fade-in cursor-pointer"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
              onClick={() => router.push(`/works/shorts/${short.slug}`)}
            >
              <Link href={`/works/shorts/${short.slug}`} className="block">
                <div className="h-48 relative">
                  <Image
                    src={short.meta.coverImage || "/placeholder.svg?height=400&width=600"}
                    alt={short.meta.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#00e5ff]">{short.meta.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-[#00e5ff] transition-colors">
                    {short.meta.title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-2">{short.meta.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {short.meta.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-[#00e5ff]/10 text-[#00e5ff] rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Button variant="outline" className="border-white/70 hover:border-[#00e5ff] text-[#00e5ff]">
                    <span className="flex items-center gap-2">
                      閱讀全文 <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

