import type { Metadata } from "next"
import { getShorts, getNovels } from "@/lib/content"
import { SearchPageSimple } from "./SearchPageSimple"

export const metadata: Metadata = {
  title: "搜尋 | 楊鐵銘",
  description: "搜尋楊鐵銘的短篇和小說作品。",
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ""

  // Fetch all shorts and novels
  const shorts = await getShorts()
  const novels = await getNovels()

  // Extract all unique tags from shorts and novels
  const allTags = new Set<string>()

  shorts.forEach((short) => {
    short.meta.tags.forEach((tag) => allTags.add(tag))
  })

  novels.forEach((novel) => {
    novel.meta.tags.forEach((tag) => allTags.add(tag))
  })

  // Convert Set to array and sort alphabetically
  const tags = Array.from(allTags).sort()

  return <SearchPageSimple shorts={shorts} novels={novels} tags={tags} initialQuery={query} />
}

