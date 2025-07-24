import {
  getNovel,
  generateMetadata as genMeta,
  getNovelChapterContent,
} from "@/lib/content";
import { notFound, redirect } from "next/navigation";
import Reader from "@/components/reader";
import type { Metadata } from "next";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ChapterPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    chapter: string;
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: ChapterPageProps): Promise<Metadata> {
  const novel = await getNovel(params.slug);

  if (!novel) {
    return {
      title: "找不到小說 | 楊鐵銘",
    };
  }

  const chapter = novel.chapters.find((ch) => ch.id === searchParams.chapter);

  if (!chapter) {
    return genMeta(novel.meta);
  }

  return {
    title: `${chapter.title} - ${novel.meta.title} | 楊鐵銘`,
    description: novel.meta.description,
  };
}

export default async function ChapterPage({
  params,
  searchParams,
}: ChapterPageProps) {
  const novel = await getNovel(params.slug);

  if (!novel) {
    notFound();
  }

  const chapterId = searchParams.chapter;
  if (!chapterId) {
    // Redirect to the novel page if no chapter is specified
    redirect(`/works/novels/${params.slug}`);
  }

  const chapter = novel.chapters.find((ch) => ch.id === chapterId);

  if (!chapter) {
    notFound();
  }

  try {
    // Get the content from the file
    const rawContent = await getNovelChapterContent(params.slug, chapterId);

    if (
      !rawContent ||
      rawContent === "Content could not be loaded. Please try again later."
    ) {
      throw new Error("Failed to load content");
    }

    // Use marked to convert markdown to HTML
    const content = marked.parse(rawContent);

    // Find current chapter index to enable next/prev navigation
    const currentChapterIndex = novel.chapters.findIndex(
      (ch) => ch.id === chapterId
    );
    const prevChapter =
      currentChapterIndex > 0 ? novel.chapters[currentChapterIndex - 1] : null;
    const nextChapter =
      currentChapterIndex < novel.chapters.length - 1
        ? novel.chapters[currentChapterIndex + 1]
        : null;

    const handlePrevPage = prevChapter
      ? () => `/works/novels/${params.slug}?chapter=${prevChapter.id}`
      : undefined;

    const handleNextPage = nextChapter
      ? () => `/works/novels/${params.slug}?chapter=${nextChapter.id}`
      : undefined;

    return (
      <main className="min-h-screen bg-gray-950">
        <Reader
          content={typeof content === "object" ? "" : content}
          chapterTitle={chapter.title}
          totalPages={novel.chapters.length}
          currentPage={currentChapterIndex + 1}
          contentPath={chapter.contentPath}
          chapterId={chapter.id}
          onPrevPage={
            handlePrevPage
              ? (window.location.href = handlePrevPage())
              : undefined
          }
          onNextPage={
            handleNextPage
              ? (window.location.href = handleNextPage())
              : undefined
          }
          returnUrl={`/works/novels/${params.slug}`}
          breadcrumbItems={[
            { label: "首頁", href: "/" },
            { label: "小說", href: "/works/novels" },
            { label: novel.meta.title, href: `/works/novels/${params.slug}` },
            {
              label: chapter.title,
              href: `/works/novels/${params.slug}?chapter=${chapterId}`,
              active: true,
            },
          ]}
        />
      </main>
    );
  } catch (error) {
    console.error(
      `Error rendering novel chapter ${params.slug}/${chapterId}:`,
      error
    );
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Content Unavailable</h1>
          <p className="text-gray-400 mb-6">
            We're having trouble loading this content. Please try again later or
            return to the novel page.
          </p>
          <Button asChild>
            <Link href={`/works/novels/${params.slug}`}>Return to Novel</Link>
          </Button>
        </div>
      </main>
    );
  }
}
