import type { Novel } from "@/types/content"

export const novels: Novel[] = [
  {
    id: "1",
    slug: "the-code-of-destiny",
    meta: {
      title: "命運的代碼",
      description: "在一個由算法控制的未來世界，一名程序員發現了改變一切的秘密代碼。",
      date: "2023-01-10",
      author: "楊鐵銘",
      tags: ["科幻", "懸疑"],
      coverImage: "/placeholder.svg?height=600&width=400&text=命運的代碼&bg=111111&fg=7ec0cd",
    },
    chapters: [
      {
        id: "chapter-1",
        title: "第一章：算法世界",
        contentPath: "content/novels/the-code-of-destiny/chapter-1.md", // Removed ./ prefix
      },
      {
        id: "chapter-2",
        title: "第二章：圖書館的秘密",
        contentPath: "content/novels/the-code-of-destiny/chapter-2.md", // Removed ./ prefix
      },
    ],
  },
  {
    id: "2",
    slug: "the-virtual-sculptor",
    meta: {
      title: "虛擬雕塑家",
      description: "一位3D藝術家創造了一個虛擬世界，但當他的作品開始影響現實時，事情變得複雜起來。",
      date: "2023-03-20",
      author: "楊鐵銘",
      tags: ["科幻", "藝術"],
      coverImage: "/placeholder.svg?height=600&width=400&text=虛擬雕塑家&bg=111111&fg=7ec0cd",
    },
    chapters: [
      {
        id: "chapter-1",
        title: "第一章：數字之手",
        contentPath: "content/novels/the-virtual-sculptor/chapter-1.md", // Removed ./ prefix
      },
      {
        id: "chapter-2",
        title: "第二章：現實的邊界",
        contentPath: "content/novels/the-virtual-sculptor/chapter-2.md", // Removed ./ prefix
      },
    ],
  },
]

