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
import Loop from "@/data/loop";
import { Suspense } from "react";
import Loading from "@/app/loading";

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
}: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [chapter, encodedTittle] = slug.split("-");
  const title = decodeURIComponent(encodedTittle);

  const manuScripts = await Loop.getAllManuScripts();
  const manuScriptMeta = manuScripts.find(
    (ms) => ms.chapter === parseInt(chapter) && ms.title === title
  );

  if (!manuScriptMeta) {
    return {
      title: "找不到章節 | 環",
    };
  }

  return {
    title: `${chapter} - ${title} | 環`,
    //TODO: Add a proper description
    // description: "",
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  const [chapter, encodedTittle] = slug.split("-");
  const title = decodeURIComponent(encodedTittle);

  const manuScripts = await Loop.getAllManuScripts();
  const manuScriptMeta = manuScripts.find(
    (ms) => ms.chapter === parseInt(chapter) && ms.title === title
  );

  if (!manuScriptMeta) {
    return notFound();
  }

  const currentChapterIndex = manuScripts.findIndex(
    (ms) => ms.chapter === parseInt(chapter)
  );
  const prevMS =
    currentChapterIndex > 0 ? manuScripts[currentChapterIndex - 1] : null;
  const nextMS =
    currentChapterIndex < manuScripts.length - 1
      ? manuScripts[currentChapterIndex + 1]
      : null;

  const handlePrevPage = prevMS
    ? `${prevMS.chapter}-${prevMS.title}`
    : undefined;

  const handleNextPage = nextMS
    ? `${nextMS.chapter}-${nextMS.title}`
    : undefined;

  try {
    const manuScript = await Loop.getManuScriptById(manuScriptMeta.id);
    const htmlContent = marked.parse(manuScript.content);
    console.log("Retrieved manuScript content:", htmlContent);

    return (
      <main className="min-h-screen bg-gray-950/50">
        <Suspense fallback={<Loading />}>
          <Reader
            content={htmlContent}
            manuScripts={manuScripts}
            chapterTitle={title}
            totalPages={manuScripts.length}
            currentPage={currentChapterIndex + 1}
            contentPath={`loop/${chapter}-${title}`}
            chapterId={`${chapter}-${title}`}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            returnUrl={`loop`}
            breadcrumbItems={[
              { label: "首頁", href: "/" },
              { label: "環", href: "/loop" },
              { label: title, href: `loop/${chapter}`, active: true },
            ]}
          />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error(`Error rendering novel chapter ${title}/${chapter}:`, error);
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Content Unavailable</h1>
          <p className="text-gray-400 mb-6">
            We're having trouble loading this content. Please try again later or
            return to the novel page.
          </p>
          <Button asChild>
            <Link href={`/loop/${chapter}-${title}`}>Return to Novel</Link>
          </Button>
        </div>
      </main>
    );
  }
}
