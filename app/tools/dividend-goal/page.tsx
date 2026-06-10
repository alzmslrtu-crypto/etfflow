import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DividendGoalCalculator } from "@/components/dividend-goal-calculator"

export const metadata: Metadata = {
  title: "월 배당금 목표 계산기 — 얼마를 투자해야 할까? | ETF Flow",
  description:
    "월 100만원 배당을 받으려면 얼마를 투자해야 할까요? 목표 월 배당금과 배당수익률을 입력하면 필요한 투자금을 바로 계산해 드립니다.",
  alternates: { canonical: "https://www.etfflow.kr/tools/dividend-goal" },
}

export default function DividendGoalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <span className="text-foreground font-medium">월 배당금 목표 계산기</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">월 배당금 목표 계산기</h1>
        <p className="text-base text-muted-foreground mb-8">
          매달 받고 싶은 배당금과 예상 배당수익률을 입력하면, 필요한 투자금을 거꾸로 계산해 드립니다.
          "월 100만원 배당"을 만들려면 얼마가 필요한지 확인해 보세요.
        </p>

        <DividendGoalCalculator />

        <div className="mt-10">
          <Link
            href="/etf"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            배당 ETF 종류 보러가기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
