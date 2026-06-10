import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DripSimulator } from "@/components/drip-simulator"

export const metadata: Metadata = {
  title: "배당 재투자(DRIP) 복리 계산기 — 10년 후 얼마? | ETF Flow",
  description:
    "배당금을 재투자하면 자산이 얼마나 불어날까요? 초기 투자금·월 적립·배당수익률·기간을 입력하면 복리 효과를 그래프로 시뮬레이션합니다.",
  alternates: { canonical: "https://www.etfflow.kr/tools/drip" },
}

export default function DripPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <span className="text-foreground font-medium">배당 재투자 복리 계산기</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">배당 재투자(DRIP) 복리 계산기</h1>
        <p className="text-base text-muted-foreground mb-8">
          받은 배당금을 다시 투자(DRIP)하면 시간이 지날수록 복리 효과로 자산이 눈덩이처럼 불어납니다.
          초기 투자금과 매월 적립액, 배당수익률, 기간을 입력해 미래 자산을 시뮬레이션해 보세요.
        </p>

        <DripSimulator />

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
