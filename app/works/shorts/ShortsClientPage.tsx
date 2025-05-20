"use client"

import Link from "next/link"
import Image from "next/image"
import { getShorts } from "@/lib/content"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default async function ShortsClientPage() {
  const shorts = await getShorts()
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-950 text-white py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">短篇故事</h1>
        <p className="text-gray-300 mb-12 animate-fade-in animation-delay-200">
          探索我的短篇故事集，包含各種風格和主題的作品。
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shorts.map((short, index) => (
            <Card
              key={short.id}
              className="bg-gray-900 border-gray-800 overflow-hidden hover:border-gray-700 transition-all group animate-fade-in cursor-pointer"
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
                    <span className="text-xs text-gray-400">{short.meta.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {short.meta.title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-2">{short.meta.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {short.meta.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Button variant="link" className="p-0 h-auto">
                    <span className="flex items-center gap-2 text-primary">
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

