import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { author } from "@/data/author"
import { SnowControls } from "@/components/snow-controls"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 w-full">
      <div className="glass-panel border-t border-[#7ec0cd]/20 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 cyberpunk-text-glow">關於我</h3>
              <p className="mb-4 text-gray-300">{author.bio}</p>
              <div className="flex space-x-4">
                {author.socialLinks.map((link) => {
                  let Icon

                  switch (link.icon) {
                    case "github":
                      Icon = Github
                      break
                    case "linkedin":
                      Icon = Linkedin
                      break
                    case "twitter":
                      Icon = Twitter
                      break
                    default:
                      Icon = Github
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.url}
                      className="text-gray-400 hover:text-[#7ec0cd] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{link.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 cyberpunk-text-glow">導航</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/" className="hover:text-[#7ec0cd] transition-colors">
                    首頁
                  </Link>
                </li>
                <li>
                  <Link href="/works/shorts" className="hover:text-[#7ec0cd] transition-colors">
                    短篇
                  </Link>
                </li>
                <li>
                  <Link href="/works/novels" className="hover:text-[#7ec0cd] transition-colors">
                    小說
                  </Link>
                </li>
                <li>
                  <Link href="/support-me" className="hover:text-[#7ec0cd] transition-colors">
                    支持我
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 cyberpunk-text-glow">聯繫我</h3>
              <p className="mb-2 text-gray-300">如果您有任何問題或合作意向，請隨時聯繫我。</p>
              <Link href="mailto:contact@yangteming.com" className="text-[#7ec0cd] hover:underline">
                contact@yangteming.com
              </Link>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-400 mb-2">網站設置</h4>
                <SnowControls />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {currentYear} {author.name}. 保留所有權利。
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

