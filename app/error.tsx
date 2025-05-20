"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f0f10] text-white">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="mb-8">
          <div className="text-[8rem] font-bold leading-none text-[#7ec0cd]">Error</div>
          <div className="h-1 w-16 bg-[#7ec0cd] mx-auto my-6 rounded-full"></div>
        </div>

        <div className="space-y-6 mb-12">
          {/* English */}
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-400">We apologize for the inconvenience.</p>
          </div>

          {/* Chinese */}
          <div className="animate-fade-in animation-delay-200">
            <h1 className="text-2xl font-bold mb-2">發生錯誤</h1>
            <p className="text-gray-400">我們為此帶來的不便深表歉意。</p>
          </div>

          {/* Japanese */}
          <div className="animate-fade-in animation-delay-400">
            <h1 className="text-2xl font-bold mb-2">エラーが発生しました</h1>
            <p className="text-gray-400">ご不便をおかけして申し訳ありません。</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in animation-delay-600">
          <Button
            onClick={() => reset()}
            variant="outline"
            className="border-[#7ec0cd] hover:bg-[#7ec0cd]/10 flex items-center gap-2 justify-center"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Try again / 重試 / 再試行</span>
          </Button>

          <Button asChild variant="outline" className="border-[#7ec0cd] hover:bg-[#7ec0cd]/10">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Home / 首頁 / ホーム</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

