import type { Metadata } from "next"
import { Coffee, Heart, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata: Metadata = {
  title: "支持我 | 楊鐵銘",
  description: "如果您喜歡我的作品，可以通過多種方式支持我的創作。",
}

export default function SupportMePage() {
  return (
    <main className="min-h-screen text-white py-16 px-4 relative z-10">
      <div className="container mx-auto max-w-3xl">
        <div className="glass-panel p-6 rounded-lg mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in cyberpunk-text-glow">支持我的創作</h1>
          <p className="text-gray-300 mb-12 animate-fade-in animation-delay-200">
            如果您喜歡我的作品，可以通過以下方式支持我繼續創作。您的每一份支持都對我意義重大。
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="glass-panel border-[#00e5ff]/30 animate-fade-in animation-delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 cyberpunk-text-glow">
                <Coffee className="h-5 w-5 text-[#00e5ff]" />
                請我喝咖啡
              </CardTitle>
              <CardDescription>一次性小額贊助，幫助我保持創作動力。</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                創作需要時間和精力，有時也需要咖啡因的支持。您的贊助將直接幫助我創作更多內容。
              </p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Button
                  variant="outline"
                  className="w-full border-[#00e5ff]/30 hover:border-[#00e5ff] hover:bg-[#00e5ff]/10"
                >
                  ¥10
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#00e5ff]/30 hover:border-[#00e5ff] hover:bg-[#00e5ff]/10"
                >
                  ¥20
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#00e5ff]/30 hover:border-[#00e5ff] hover:bg-[#00e5ff]/10"
                >
                  ¥50
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#00e5ff] text-black hover:bg-[#00e5ff]/80">贊助我</Button>
            </CardFooter>
          </Card>

          <Card className="glass-panel border-[#ff0080]/30 animate-fade-in animation-delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#ff0080]">
                <Heart className="h-5 w-5 text-[#ff0080]" />
                成為月度支持者
              </CardTitle>
              <CardDescription>定期支持，獲得獨家內容和更新。</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">成為月度支持者，您將獲得：</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>提前閱讀新作品</li>
                <li>參與創作過程的投票</li>
                <li>獨家創作筆記和背景故事</li>
                <li>每月感謝信和創作更新</li>
              </ul>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Button
                  variant="outline"
                  className="w-full border-[#ff0080]/30 hover:border-[#ff0080] hover:bg-[#ff0080]/10"
                >
                  ¥20/月
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#ff0080]/30 hover:border-[#ff0080] hover:bg-[#ff0080]/10"
                >
                  ¥50/月
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#ff0080]/30 hover:border-[#ff0080] hover:bg-[#ff0080]/10"
                >
                  ¥100/月
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#ff0080] hover:bg-[#ff0080]/80">成為支持者</Button>
            </CardFooter>
          </Card>

          <Card className="glass-panel border-[#9000ff]/30 animate-fade-in animation-delay-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#9000ff]">
                <MessageSquare className="h-5 w-5 text-[#9000ff]" />
                分享和反饋
              </CardTitle>
              <CardDescription>非金錢方式的支持也同樣重要。</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">如果您目前無法提供金錢支持，以下方式也能幫助我：</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>在社交媒體上分享我的作品</li>
                <li>給我的作品留下評論和反饋</li>
                <li>向朋友推薦我的網站</li>
                <li>發送電子郵件告訴我您的想法</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="w-full border-[#9000ff]/30 hover:border-[#9000ff] hover:bg-[#9000ff]/10"
              >
                <Link href="mailto:contact@yangteming.com">發送反饋</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center animate-fade-in animation-delay-600 glass-panel p-4 rounded-lg">
          <p className="text-gray-300">感謝您考慮支持我的創作。每一份支持都讓我能夠繼續做我熱愛的事情。</p>
        </div>
      </div>
    </main>
  )
}

