import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ExchangeCalculator } from "@/components/exchange-calculator"

export const metadata: Metadata = {
  title: "원달러 환율 계산기 — 실시간 환전 계산 | ETF Flow",
  description:
    "원화와 미국 달러를 실시간 환율로 바로 환산합니다. 미국 ETF·주식 투자 시 원화로 얼마인지, 달러로 얼마인지 즉시 계산하세요.",
  alternates: { canonical: "https://www.etfflow.kr/tools/exchange" },
}

export default function ExchangePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-primary transition-colors">계산기</Link>
          <span>/</span>
          <span className="text-foreground font-medium">환율 계산기</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">원달러 환율 계산기</h1>
        <p className="text-base text-muted-foreground mb-8">
          미국 ETF·주식에 투자할 때 원화가 달러로 얼마인지, 또는 달러가 원화로 얼마인지 실시간 환율로 바로 계산합니다.
        </p>

        <ExchangeCalculator />

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
