import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { RiskProfileTest } from "@/components/risk-profile-test"

export const metadata: Metadata = {
  title: "투자 성향 테스트 — 나에게 맞는 배당 ETF는? | ETF Flow",
  description:
    "5개 질문으로 알아보는 나의 투자 성향. 안정형·균형형·공격형 결과에 따라 어울리는 배당 ETF 유형과 예시 종목을 추천해 드립니다.",
  alternates: { canonical: "https://www.etfflow.kr/tools/risk-profile" },
}

export default function RiskProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-primary transition-colors">계산기</Link>
          <span>/</span>
          <span className="text-foreground font-medium">투자 성향 테스트</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">투자 성향 테스트</h1>
        <p className="text-base text-muted-foreground mb-8">
          5개 질문에 답하면 나의 투자 성향(안정형·균형형·공격형)을 알려주고, 그에 어울리는 배당 ETF 유형과 예시 종목을 추천합니다.
        </p>

        <RiskProfileTest />

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
