import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DividendYieldCalculator } from "@/components/dividend-yield-calculator"

export const metadata: Metadata = {
  title: "배당수익률 계산기 — 주가·배당금으로 수익률 계산 | ETF Flow",
  description:
    "현재 주가와 1주당 배당금을 입력하면 배당수익률(%)과 연 배당금 총액을 바로 계산합니다. 보유 주수를 넣어 예상 배당 총액도 확인하세요.",
  alternates: { canonical: "https://www.etfflow.kr/tools/dividend-yield" },
}

export default function DividendYieldPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-primary transition-colors">계산기</Link>
          <span>/</span>
          <span className="text-foreground font-medium">배당수익률 계산기</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">배당수익률 계산기</h1>
        <p className="text-base text-muted-foreground mb-8">
          주가와 1주당 배당금만 넣으면 배당수익률을 바로 계산합니다. 보유 주수까지 입력하면 연 배당금 총액과 투자 금액도 함께 확인할 수 있습니다.
        </p>

        <DividendYieldCalculator />

        <div className="mt-10">
          <Link href="/tools" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all">
            다른 계산기 보기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
