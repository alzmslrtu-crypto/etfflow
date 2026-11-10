import type { Metadata } from "next"
import Link from "next/link"
import { TickerSearch } from "@/components/ticker-search"

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | ETF Flow",
  robots: { index: false, follow: true },
}

const LINKS = [
  { href: "/#compare", label: "ETF 비교" },
  { href: "/etf", label: "ETF 모음" },
  { href: "/tools", label: "배당 계산기" },
  { href: "/blog", label: "배당 투자 블로그" },
]

export default function NotFound() {
  return (
    <main className="min-h-[60vh] bg-background">
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-sm font-semibold text-primary mb-3">404</p>
        <h1 className="text-3xl font-bold text-foreground mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8">
          주소가 바뀌었거나 삭제된 페이지입니다. 찾는 ETF를 검색해 보세요.
        </p>
        <div className="text-left mb-8">
          <TickerSearch />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-full border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
