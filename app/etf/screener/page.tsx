import type { Metadata } from "next"
import Link from "next/link"
import { EtfScreener } from "@/components/etf-screener"

export const metadata: Metadata = {
  title: "ETF 파인더 — 조건별 배당 ETF 찾기 | ETF Flow",
  description:
    "지역·배당주기·운용사로 원하는 배당 ETF를 골라보세요. 월배당·미국 배당성장·한국 상장 ETF를 한 화면에서 필터링하고 비교합니다.",
  alternates: { canonical: "https://www.etfflow.kr/etf/screener" },
  // 필터 도구 페이지는 색인 제외 (콘텐츠는 블로그/허브 중심)
  robots: { index: false, follow: true },
}

export default function ScreenerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/etf" className="hover:text-primary transition-colors">ETF 모음</Link>
          <span>/</span>
          <span className="text-foreground font-medium">ETF 파인더</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">ETF 파인더</h1>
        <p className="text-base text-muted-foreground mb-8">
          국내 상장 전체 ETF를 분류·정렬·검색으로 빠르게 찾아보세요. 종목을 누르면 실시간 가격·배당 정보를 확인할 수 있습니다.
        </p>

        <EtfScreener />
      </div>
    </main>
  )
}
