"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Twitter, ArrowRight, FileText, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { author } from "@/data/author"
import type { ShortStory, Novel } from "@/types/content"
import { ImageCarousel } from "@/components/image-carousel"

interface ClientPageProps {
  shorts: ShortStory[]
  novels: Novel[]
}

export default function ClientPage({ shorts, novels }: ClientPageProps) {
  const router = useRouter()
  const featuredShort = shorts[0]
  const featuredNovel = novels[0]

  // Avatar images for the carousel
  const avatarImages = ["/images/avatar1.webp", "/images/avatar2.webp", "/images/avatar3.webp"]

  return (
    <main className="min-h-screen text-white relative">
      {/* Hero Section with translucent panel */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 glass-panel-blue p-8 rounded-lg">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in cyberpunk-text-glow">
                你好，我是<span className="text-[#7ec0cd]">楊鐵銘</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 animate-fade-in animation-delay-200">
                開發者、3D藝術家和小說家。我創造數字體驗和引人入勝的故事。
              </p>
              <div className="flex gap-4 animate-fade-in animation-delay-400">
                <Button
                  asChild
                  variant="outline"
                  className="relative overflow-hidden group border border-[#7ec0cd] text-[#7ec0cd] hover:bg-[#7ec0cd]/10"
                >
                  <Link href="/works/shorts">
                    <span className="relative z-10">閱讀我的作品</span>
                    <span className="absolute inset-0 bg-[#7ec0cd]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="relative overflow-hidden group border border-[#7ec0cd] text-[#7ec0cd] hover:bg-[#7ec0cd]/10"
                >
                  <Link href="/support-me">
                    <span className="relative z-10">支持我</span>
                    <span className="absolute inset-0 bg-[#7ec0cd]/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                </Button>
              </div>
              <div className="flex gap-4 mt-8 animate-fade-in animation-delay-600">
                {author.socialLinks.map((link, index) => {
                  let Icon
                  let colorClass = ""

                  switch (link.icon) {
                    case "github":
                      Icon = Github
                      colorClass = "text-[#7ec0cd] hover:text-white"
                      break
                    case "linkedin":
                      Icon = Linkedin
                      colorClass = "text-[#7ec0cd] hover:text-white"
                      break
                    case "twitter":
                      Icon = Twitter
                      colorClass = "text-[#7ec0cd] hover:text-white"
                      break
                    default:
                      Icon = Github
                      colorClass = "text-[#7ec0cd] hover:text-white"
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.url}
                      className={`${colorClass} transition-colors relative cosmic-glow`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-6 w-6" />
                      <span className="sr-only">{link.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="md:w-1/2 animate-fade-in animation-delay-800">
              <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                {/* Avatar with carousel - no circles */}
                <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-gray-800 cosmic-glow">
                  <ImageCarousel images={avatarImages} interval={5000} className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works Section with translucent panel */}
      <section className="relative py-16 px-4 z-10">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center cyberpunk-text-glow">精選作品</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Featured Short Story */}
            <div
              className="glass-panel rounded-lg overflow-hidden border border-[#7ec0cd]/30 transition-all hover:border-[#7ec0cd] group cursor-pointer"
              onClick={() => router.push(`/works/shorts/${featuredShort.slug}`)}
            >
              <Link href={`/works/shorts/${featuredShort.slug}`} className="block">
                <div className="h-48 relative">
                  <Image
                    src={featuredShort.meta.coverImage || "/placeholder.svg?height=400&width=600"}
                    alt={featuredShort.meta.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#7ec0cd] flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      短篇
                    </span>
                    <span className="text-xs text-gray-400">{featuredShort.meta.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#7ec0cd] transition-colors">
                    {featuredShort.meta.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{featuredShort.meta.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredShort.meta.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-[#7ec0cd]/10 text-[#7ec0cd] rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" className="border border-[#7ec0cd] text-[#7ec0cd] hover:bg-[#7ec0cd]/10">
                    <span className="flex items-center gap-2">
                      閱讀全文 <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </div>
              </Link>
            </div>

            {/* Featured Novel */}
            <div
              className="glass-panel rounded-lg overflow-hidden border border-[#7ec0cd]/30 transition-all hover:border-[#7ec0cd] group cursor-pointer"
              onClick={() => router.push(`/works/novels/${featuredNovel.slug}`)}
            >
              <Link href={`/works/novels/${featuredNovel.slug}`} className="block">
                <div className="h-48 relative">
                  <Image
                    src={featuredNovel.meta.coverImage || "/placeholder.svg?height=400&width=600"}
                    alt={featuredNovel.meta.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#7ec0cd] flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      小說
                    </span>
                    <span className="text-xs text-gray-400">{featuredNovel.meta.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#7ec0cd] transition-colors">
                    {featuredNovel.meta.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{featuredNovel.meta.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredNovel.meta.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-[#7ec0cd]/10 text-[#7ec0cd] rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" className="border border-[#7ec0cd] text-[#7ec0cd] hover:bg-[#7ec0cd]/10">
                    <span className="flex items-center gap-2">
                      閱讀全文 <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              className="border border-[#7ec0cd] text-[#7ec0cd] hover:bg-[#7ec0cd]/10 hover:border-white"
            >
              <Link href="/works/shorts">查看更多作品</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section with translucent panel */}
      <section className="relative py-16 px-4 z-10">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center cyberpunk-text-glow">關於我</h2>
          <div className="glass-panel rounded-lg p-6 md:p-8 border border-[#7ec0cd]/30">
            <p className="text-gray-300 mb-6 leading-relaxed">
              我是楊鐵銘，一名充滿熱情的創作者，跨越多個領域。作為一名開發者，我專注於創建直觀且高效的應用程序。作為一名3D藝術家，我喜歡探索數字雕塑和虛擬世界的可能性。而作為一名小說家，我通過文字創造引人入勝的故事和角色。
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              我相信技術和藝術的融合可以創造出獨特而有意義的體驗。無論是通過代碼、3D模型還是文字，我都致力於將我的想像力轉化為可以與他人分享的作品。
            </p>
            <p className="text-gray-300 leading-relaxed">
              在這個網站上，你可以找到我的短篇故事、小說以及其他創作。我希望我的作品能夠為你帶來一些啟發或娛樂。如果你有任何問題或合作意向，請隨時聯繫我。
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

