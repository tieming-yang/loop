import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "404 - Page Not Found | 楊鐵銘",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f0f10] text-white">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="mb-8">
          <div className="text-[10rem] font-bold leading-none text-[#7ec0cd]">404</div>
          <div className="h-1 w-16 bg-[#7ec0cd] mx-auto my-6 rounded-full"></div>
        </div>

        <div className="space-y-6 mb-12">
          {/* English */}
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
            <p className="text-gray-400">The page you are looking for doesn't exist or has been moved.</p>
          </div>

          {/* Chinese */}
          <div className="animate-fade-in animation-delay-200">
            <h1 className="text-2xl font-bold mb-2">找不到頁面</h1>
            <p className="text-gray-400">您尋找的頁面不存在或已被移動。</p>
          </div>

          {/* Japanese */}
          <div className="animate-fade-in animation-delay-400">
            <h1 className="text-2xl font-bold mb-2">ページが見つかりません</h1>
            <p className="text-gray-400">お探しのページは存在しないか、移動されました。</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in animation-delay-600">
          <Button asChild variant="outline" className="border-[#7ec0cd] hover:bg-[#7ec0cd]/10">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Home / 首頁 / ホーム</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="border-[#7ec0cd] hover:bg-[#7ec0cd]/10">
            <Link href="/works/shorts" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Stories / 短篇 / 短編</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="border-[#7ec0cd] hover:bg-[#7ec0cd]/10">
            <Link href="/search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search / 搜尋 / 検索</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

