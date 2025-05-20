import type { Metadata } from "next"
import { author } from "@/data/author"
import ClientPage from "./ClientPage"
import { getShorts, getNovels } from "@/lib/content"

export const metadata: Metadata = {
  title: `${author.name} | 開發者、3D藝術家和小說家`,
  description: author.bio,
}

export default async function Home() {
  // Fetch data on the server
  const shorts = await getShorts()
  const novels = await getNovels()

  // Pass data as props to the client component
  return <ClientPage shorts={shorts} novels={novels} />
}

