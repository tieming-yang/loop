import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import {
  Inter,
  Noto_Sans_TC,
  Noto_Serif_TC,
  Ma_Shan_Zheng,
  ZCOOL_QingKe_HuangYou,
  ZCOOL_XiaoWei,
} from "next/font/google";
import BottomNav from "@/components/bottom-nav";
import Footer from "@/components/footer";
import { author } from "@/data/author";
import { SnowBackground } from "@/components/snow-background";
import { SnowInitializer } from "@/components/snow-initializer";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

// Chinese fonts
const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

const maShanZheng = Ma_Shan_Zheng({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ma-shan-zheng",
  display: "swap",
});

const zcoolQingKeHuangYou = ZCOOL_QingKe_HuangYou({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-zcool-qingke-huangyou",
  display: "swap",
});

const zcoolXiaoWei = ZCOOL_XiaoWei({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-zcool-xiaowei",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${author.name} | 開發者、3D藝術家和小說家`,
  description: author.bio,
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="dark">
      <body
        className={`${inter.className} ${notoSansTC.variable} ${notoSerifTC.variable} ${maShanZheng.variable} ${zcoolQingKeHuangYou.variable} ${zcoolXiaoWei.variable} bg-[#0a0a14] text-white min-h-screen relative`}
      >
        {/* Initialize snow settings */}
        <SnowInitializer />

        {/* Global snow background animation */}
        <div className="fixed inset-0 z-0">
          <SnowBackground className="w-full h-full" />
        </div>

        {/* Main content with higher z-index */}
        <div className="relative z-10">
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Footer />
        </div>

        {/* Bottom navigation with highest z-index */}
        <BottomNav />
      </body>
    </html>
  );
}
