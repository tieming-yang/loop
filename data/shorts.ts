import type { ShortStory } from "@/types/content"

export const shorts: ShortStory[] = [
  {
    id: "1",
    slug: "the-last-star",
    contentPath: "content/shorts/the-last-star.md", // Removed ./ prefix
    meta: {
      title: "最後的星星",
      description: "在一個星星逐漸消失的世界裡，一個小女孩踏上了尋找最後一顆星星的旅程。",
      date: "2023-05-15",
      author: "楊鐵銘",
      tags: ["科幻", "冒險"],
      coverImage: "/placeholder.svg?height=400&width=600&text=最後的星星&bg=111111&fg=7ec0cd",
    },
  },
  {
    id: "2",
    slug: "the-digital-garden",
    contentPath: "content/shorts/the-digital-garden.md", // Removed ./ prefix
    meta: {
      title: "數字花園",
      description: "一個程序員創造了一個虛擬花園，但他沒想到它會以意想不到的方式成長。",
      date: "2023-06-22",
      author: "楊鐵銘",
      tags: ["科技", "奇幻"],
      coverImage: "/placeholder.svg?height=400&width=600&text=數字花園&bg=111111&fg=7ec0cd",
    },
  },
  {
    id: "3",
    slug: "the-sculptors-dream",
    contentPath: "content/shorts/the-sculptors-dream.md", // Removed ./ prefix
    meta: {
      title: "雕塑家的夢",
      description: "一個雕塑家發現他的作品在夜間會活過來，開始了一段奇妙的冒險。",
      date: "2023-07-10",
      author: "楊鐵銘",
      tags: ["奇幻", "藝術"],
      coverImage: "/placeholder.svg?height=400&width=600&text=雕塑家的夢&bg=111111&fg=7ec0cd",
    },
  },
]

