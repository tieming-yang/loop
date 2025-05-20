import type { Metadata } from "next"
import { getNovels } from "@/lib/content"
import NovelsPageClient from "./NovelsPageClient"

export const metadata: Metadata = {
  title: "小說 | 楊鐵銘",
  description: "楊鐵銘的小說作品，包含長篇和中篇小說。",
}

export default async function NovelsPage() {
  // Fetch data on the server
  const novels = await getNovels()

  // Pass data as props to the client component
  return <NovelsPageClient novels={novels} />
}

