import { type NextRequest, NextResponse } from "next/server"
import { getShorts, getNovels } from "@/lib/content"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const tags = searchParams.getAll("tag")

  if (!query && tags.length === 0) {
    return NextResponse.json([])
  }

  const shorts = await getShorts()
  const novels = await getNovels()

  let results = [...shorts, ...novels]

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

  return NextResponse.json(results)
}

