import type { ShortStory, Novel, MetaData } from "@/types/content"
import { shorts } from "@/data/shorts"
import { novels } from "@/data/novels"
import fs from "fs/promises"
import path from "path"

export async function getShorts(): Promise<ShortStory[]> {
  return shorts
}

export async function getShort(slug: string): Promise<ShortStory | undefined> {
  return shorts.find((short) => short.slug === slug)
}

export async function getNovels(): Promise<Novel[]> {
  return novels
}

export async function getNovel(slug: string): Promise<Novel | undefined> {
  return novels.find((novel) => novel.slug === slug)
}

export async function getMarkdownContent(filePath: string): Promise<string> {
  try {
    // Remove any leading ./ from the path to ensure consistent path handling
    const normalizedPath = filePath.replace(/^\.\//, "")

    // First try with process.cwd()
    const fullPath = path.join(process.cwd(), normalizedPath)
    console.log(`Attempting to read file at: ${fullPath}`)

    try {
      const content = await fs.readFile(fullPath, "utf8")
      return content
    } catch (readError) {
      console.error(`Error reading file at ${fullPath}:`, readError)

      // Try with an absolute path
      const absolutePath = path.resolve(normalizedPath)
      console.log(`Trying absolute path: ${absolutePath}`)

      try {
        const content = await fs.readFile(absolutePath, "utf8")
        return content
      } catch (absError) {
        console.error(`Error reading file with absolute path: ${absolutePath}`, absError)

        // Try with a path relative to the app directory
        const appRelativePath = path.join(process.cwd(), "app", normalizedPath)
        console.log(`Trying app-relative path: ${appRelativePath}`)

        try {
          const content = await fs.readFile(appRelativePath, "utf8")
          return content
        } catch (appError) {
          console.error(`Error reading file with app-relative path: ${appRelativePath}`, appError)

          // One last attempt - try with a direct path from root
          const rootPath = `/${normalizedPath}`
          console.log(`Trying root path: ${rootPath}`)

          const content = await fs.readFile(rootPath, "utf8")
          return content
        }
      }
    }
  } catch (error) {
    console.error(`Error reading markdown file at ${filePath}:`, error)
    return "Content could not be loaded. Please try again later."
  }
}

export async function getShortContent(slug: string): Promise<string | undefined> {
  const short = await getShort(slug)
  if (!short) return undefined

  return getMarkdownContent(short.contentPath)
}

export async function getNovelChapterContent(novelSlug: string, chapterId: string): Promise<string | undefined> {
  const novel = await getNovel(novelSlug)
  if (!novel) return undefined

  const chapter = novel.chapters.find((ch) => ch.id === chapterId)
  if (!chapter) return undefined

  return getMarkdownContent(chapter.contentPath)
}

export async function searchContent(query: string, tags: string[] = []): Promise<(ShortStory | Novel)[]> {
  const allShorts = await getShorts()
  const allNovels = await getNovels()

  let results: (ShortStory | Novel)[] = [...allShorts, ...allNovels]

  // Filter by query if provided
  if (query) {
    const normalizedQuery = query.toLowerCase()
    results = results.filter(
      (item) =>
        item.meta.title.toLowerCase().includes(normalizedQuery) ||
        item.meta.description.toLowerCase().includes(normalizedQuery) ||
        item.meta.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)),
    )
  }

  // Filter by tags if provided
  if (tags.length > 0) {
    results = results.filter((item) => tags.some((tag) => item.meta.tags.includes(tag)))
  }

  return results
}

export function generateMetadata(meta: MetaData) {
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      authors: [meta.author],
      tags: meta.tags,
    },
  }
}

