import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://image-similarity-web.vercel.app"),
  title: {
    default: "포켓몬 닮은꼴 찾기 | Pokemon Lookalike Finder",
    template: "%s | 포켓몬 닮은꼴 찾기",
  },
  description:
    "사진을 업로드하면 AI가 닮은 포켓몬을 찾아드립니다. 나와 닮은 포켓몬은 누구일까요? 지금 바로 확인해보세요!",
  keywords: [
    "포켓몬",
    "닮은꼴",
    "포켓몬 닮은꼴",
    "AI",
    "이미지 분석",
    "포켓몬 찾기",
    "Pokemon",
    "lookalike",
    "Pokemon lookalike",
    "나와 닮은 포켓몬",
    "포켓몬 테스트",
  ],
  authors: [{ name: "Pokemon Lookalike Finder" }],
  creator: "Pokemon Lookalike Finder",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://image-similarity-web.vercel.app",
    siteName: "포켓몬 닮은꼴 찾기",
    title: "포켓몬 닮은꼴 찾기 ⚡",
    description:
      "사진을 업로드하면 AI가 닮은 포켓몬을 찾아드립니다! 나와 닮은 포켓몬은 누구일까요?",
  },
  twitter: {
    card: "summary_large_image",
    title: "포켓몬 닮은꼴 찾기 ⚡",
    description:
      "사진을 업로드하면 AI가 닮은 포켓몬을 찾아드립니다! 나와 닮은 포켓몬은 누구일까요?",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://image-similarity-web.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
