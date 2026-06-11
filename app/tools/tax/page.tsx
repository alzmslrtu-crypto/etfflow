import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TaxCalculator } from "@/components/tax-calculator"

export const metadata: Metadata = {
  title: "배당소득세 계산기 — 세후 실수령 배당금 | ETF Flow",
  description:
    "배당금에서 세금을 떼면 실제로 얼마를 받을까요? 국내·미국 상장 구분에 따라 배당소득세(15.4%·15%)를 적용한 세후 실수령액과 금융소득종합과세 여부를 계산합니다.",
  alternates: { canonical: "https://www.etfflow.kr/tools/tax" },
}

export default function TaxToolPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <span className="text-foreground font-medium">배당소득세 계산기</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">배당소득세 계산기</h1>
        <p className="text-base text-muted-foreground mb-8">
          배당금에는 세금이 붙습니다. 연간 배당금과 상장 구분을 입력하면 세후 실수령액을 바로 확인하고,
          금융소득종합과세(연 2,000만원 초과) 대상인지도 알려 드립니다.
        </p>

        <TaxCalculator />

        <div className="mt-10">
          <Link
            href="/tools/dividend-goal"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            월 배당금 목표 계산기도 써보기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
