import type { Metadata } from "next"
import { getShorts } from "@/lib/content"
import ShortsPageClient from "./ShortsPageClient"

export const metadata: Metadata = {
  title: "短篇故事 | 楊鐵銘",
  description: "楊鐵銘的短篇故事集，包含科幻、奇幻和現實主義作品。",
}

export default async function ShortsPage() {
  // Fetch data on the server
  const shorts = await getShorts()

  // Pass data as props to the client component
  return <ShortsPageClient shorts={shorts} />
}

