export type MetaData = {
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  coverImage?: string
}

export type ShortStory = {
  id: string
  slug: string
  contentPath: string
  meta: MetaData
}

export type Chapter = {
  id: string
  title: string
  contentPath: string
}

export type Novel = {
  id: string
  slug: string
  meta: MetaData
  chapters: Chapter[]
}

export type SocialLink = {
  name: string
  url: string
  icon: string
}

export type Author = {
  name: string
  bio: string
  avatar: string
  socialLinks: SocialLink[]
}

