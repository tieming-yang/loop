export type Bookmark = {
  id: string
  pageNumber: number
  timestamp: number
  text: string
  chapterId?: string
  contentPath: string
}

export type Highlight = {
  id: string
  text: string
  color: string
  pageNumber: number
  timestamp: number
  note?: string
  chapterId?: string
  contentPath: string
}

export type ReaderPosition = {
  contentPath: string
  scrollPosition: number
  pageNumber: number
  chapterId?: string
}

export type ThemeOption = "light" | "sepia" | "dark" | "black" | "custom"

export type ReaderSettings = {
  fontSize: number
  fontFamily: string
  theme: ThemeOption
  customBackgroundColor: string
  customTextColor: string
  letterSpacing: number
  lineHeight: number
  transparency: number
}

