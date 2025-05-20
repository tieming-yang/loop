import { getNovel, getNovels, generateMetadata as genMeta, getNovelChapterContent } from "@/lib/content"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Reader from "@/components/reader"
import { marked } from "marked"
import { Breadcrumb } from "@/components/breadcrumb"

type NovelPageProps = {
  params: {
    slug: string
  }
  searchParams: {
    chapter?: string
  }
}

export async function generateMetadata({ params }: NovelPageProps): Promise<Metadata> {
  const novel = await getNovel(params.slug)

  if (!novel) {
    return {
      title: "找不到小說 | 楊鐵銘",
    }
  }

  return genMeta(novel.meta)
}

export async function generateStaticParams() {
  const novels = await getNovels()

  return novels.map((novel) => ({
    slug: novel.slug,
  }))
}

export default async function NovelPage({ params, searchParams }: NovelPageProps) {
  const novel = await getNovel(params.slug)

  if (!novel) {
    notFound()
  }

  // If chapter is specified in the URL, render the chapter content
  if (searchParams.chapter) {
    const chapterId = searchParams.chapter
    const chapter = novel.chapters.find((ch) => ch.id === chapterId)

    if (chapter) {
      try {
        // Get the content from the file
        const rawContent = await getNovelChapterContent(params.slug, chapterId)

        if (!rawContent || rawContent === "Content could not be loaded. Please try again later.") {
          throw new Error("Failed to load content")
        }

        // Use marked to convert markdown to HTML
        const content = marked.parse(rawContent)

        // Find current chapter index to enable next/prev navigation
        const currentChapterIndex = novel.chapters.findIndex((ch) => ch.id === chapterId)
        const prevChapter = currentChapterIndex > 0 ? novel.chapters[currentChapterIndex - 1] : null
        const nextChapter =
          currentChapterIndex < novel.chapters.length - 1 ? novel.chapters[currentChapterIndex + 1] : null

        const handlePrevPage = prevChapter ? () => `/works/novels/${params.slug}?chapter=${prevChapter.id}` : undefined

        const handleNextPage = nextChapter ? () => `/works/novels/${params.slug}?chapter=${nextChapter.id}` : undefined

        return (
          <main className="min-h-screen bg-gray-950">
            <Reader
              content={content}
              chapterTitle={chapter.title}
              totalPages={novel.chapters.length}
              currentPage={currentChapterIndex + 1}
              contentPath={chapter.contentPath}
              chapterId={chapter.id}
              onPrevPage={handlePrevPage ? () => (window.location.href = handlePrevPage()) : undefined}
              onNextPage={handleNextPage ? () => (window.location.href = handleNextPage()) : undefined}
              returnUrl={`/works/novels/${params.slug}`}
            />
          </main>
        )
      } catch (error) {
        console.error(`Error rendering novel chapter ${params.slug}/${chapterId}:`, error)
        return (
          <main className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-lg max-w-md mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Content Unavailable</h1>
              <p className="text-gray-400 mb-6">
                We're having trouble loading this content. Please try again later or return to the novel page.
              </p>
              <Button asChild>
                <Link href={`/works/novels/${params.slug}`}>Return to Novel</Link>
              </Button>
            </div>
          </main>
        )
      }
    }
  }

  // If no chapter is specified or chapter doesn't exist, show the novel overview page
  return (
    <main className="min-h-screen bg-[#0f0f10] text-white py-16 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <Breadcrumb
          items={[
            { label: "首頁", href: "/" },
            { label: "小說", href: "/works/novels" },
            { label: novel.meta.title, href: `/works/novels/${params.slug}`, active: true },
          ]}
        />
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 mt-6">
            <div className="md:w-1/3">
              <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={novel.meta.coverImage || "/placeholder.svg?height=600&width=400"}
                  alt={novel.meta.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{novel.meta.title}</h1>
              <p className="text-gray-300 mb-6">{novel.meta.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {novel.meta.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-400 mb-8">
                <p>作者: {novel.meta.author}</p>
                <p>發布日期: {novel.meta.date}</p>
              </div>

              <Button asChild className="bg-[#7ec0cd] hover:bg-[#7ec0cd]/90 text-[#0f0f10]">
                <Link href={`/works/novels/${params.slug}?chapter=${novel.chapters[0].id}`}>
                  <span className="flex items-center gap-2">
                    開始閱讀 <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="inline-block w-1 h-6 bg-[#7ec0cd] mr-3"></span>
            章節列表
          </h2>

          <ul className="space-y-2 divide-y divide-gray-800">
            {novel.chapters.map((chapter, index) => (
              <li key={chapter.id} className="pt-2 first:pt-0">
                <Link
                  href={`/works/novels/${params.slug}?chapter=${chapter.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-6 text-center">{index + 1}</span>
                    <span className="group-hover:text-[#7ec0cd] transition-colors">{chapter.title}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-[#7ec0cd] transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Back button at the bottom */}
      <div className="fixed bottom-6 left-6 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-900/80 backdrop-blur-sm border-gray-700 hover:bg-gray-800 hover:border-[#7ec0cd]"
          asChild
        >
          <Link href="/works/novels" aria-label="返回小說列表">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </main>
  )
}

