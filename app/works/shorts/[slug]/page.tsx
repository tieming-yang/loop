import { getShort, getShorts, generateMetadata as genMeta, getMarkdownContent } from "@/lib/content"
import { notFound } from "next/navigation"
import Reader from "@/components/reader"
import type { Metadata } from "next"
import { marked } from "marked"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type ShortPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ShortPageProps): Promise<Metadata> {
  const short = await getShort(params.slug)

  if (!short) {
    return {
      title: "找不到短篇 | 楊鐵銘",
    }
  }

  return genMeta(short.meta)
}

export async function generateStaticParams() {
  const shorts = await getShorts()

  return shorts.map((short) => ({
    slug: short.slug,
  }))
}

export default async function ShortPage({ params }: ShortPageProps) {
  const short = await getShort(params.slug)

  if (!short) {
    notFound()
  }

  try {
    // Get the content from the file
    const rawContent = await getMarkdownContent(short.contentPath)

    if (rawContent === "Content could not be loaded. Please try again later.") {
      throw new Error("Failed to load content")
    }

    // Get all shorts for navigation
    const allShorts = await getShorts()

    // Find the current short's index in the array
    const currentIndex = allShorts.findIndex((s) => s.slug === params.slug)

    // Determine previous and next short slugs
    const prevShortSlug = currentIndex > 0 ? allShorts[currentIndex - 1].slug : undefined
    const nextShortSlug = currentIndex < allShorts.length - 1 ? allShorts[currentIndex + 1].slug : undefined

    // Use marked to convert markdown to HTML
    const content = marked.parse(rawContent)

    return (
      <main className="min-h-screen bg-gray-950 relative">
        <Reader
          content={content}
          chapterTitle={short.meta.title}
          totalPages={Math.ceil(rawContent.length / 1000)} // Rough estimate
          currentPage={1}
          contentPath={short.contentPath}
          returnUrl="/works/shorts"
          isShort={true}
          prevShortSlug={prevShortSlug}
          nextShortSlug={nextShortSlug}
          breadcrumbItems={[
            { label: "首頁", href: "/" },
            { label: "短篇故事", href: "/works/shorts" },
            { label: short.meta.title, href: `/works/shorts/${params.slug}`, active: true },
          ]}
        />
      </main>
    )
  } catch (error) {
    console.error(`Error rendering short story ${params.slug}:`, error)
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Content Unavailable</h1>
          <p className="text-gray-400 mb-6">
            We're having trouble loading this content. Please try again later or return to the shorts page.
          </p>
          <Button asChild>
            <Link href="/works/shorts">Return to Shorts</Link>
          </Button>
        </div>
      </main>
    )
  }
}

