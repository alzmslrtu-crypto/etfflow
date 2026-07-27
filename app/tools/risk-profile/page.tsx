import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { RiskProfileTest } from "@/components/risk-profile-test"
import { ToolArticle } from "@/components/tool-article"

export const metadata: Metadata = {
  title: "투자 성향 테스트 — 나에게 맞는 배당 ETF는? | ETF Flow",
  description:
    "5개 질문으로 알아보는 나의 투자 성향. 안정형·균형형·공격형 결과에 따라 어울리는 배당 ETF 유형과 예시 종목을 추천해 드립니다.",
  alternates: { canonical: "https://www.etfflow.kr/tools/risk-profile" },
}

export default function RiskProfilePage() {
  return (
    <main className="min-h-screen bg-background">
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

        <ToolArticle
          sections={[
            {
              heading: "투자 성향을 왜 알아야 하나요?",
              body: (
                <>
                  <p>
                    같은 배당 ETF라도 투자자의 성향에 따라 적합도가 다릅니다.
                    <strong className="text-foreground"> 원금 손실을 크게 꺼리는 사람</strong>이 변동성이 큰 커버드콜 고배당 ETF에 집중하면
                    하락장에서 심리적으로 버티기 어렵고, 반대로 <strong className="text-foreground">높은 수익을 원하는 사람</strong>이
                    지나치게 안정적인 자산만 담으면 목표 수익에 도달하기 어렵습니다.
                  </p>
                  <p>
                    이 테스트는 5개 질문으로 투자 성향을 안정형·균형형·공격형으로 나누고, 각 유형에 어울리는 배당 ETF 유형과 예시 종목을 제안합니다.
                  </p>
                </>
              ),
            },
            {
              heading: "성향별 배당 ETF 방향",
              body: (
                <>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>
                      <strong className="text-foreground">안정형</strong>: 변동성을 낮추고 꾸준한 배당을 선호. 배당성장형(SCHD·배당다우존스)이나 채권 혼합 비중을 고려합니다.
                    </li>
                    <li>
                      <strong className="text-foreground">균형형</strong>: 성장과 배당을 절충. 배당성장형에 지수형(VOO·QQQ)을 섞어 균형을 맞춥니다.
                    </li>
                    <li>
                      <strong className="text-foreground">공격형</strong>: 높은 현금흐름·수익을 우선. 커버드콜 고배당(JEPI·JEPQ) 비중을 높이되 주가 변동 위험을 감수합니다.
                    </li>
                  </ul>
                  <p className="mt-3">
                    결과는 참고용 방향이며, 실제 포트폴리오는 나이·투자 기간·목표 금액에 따라 조정하는 것이 좋습니다.
                  </p>
                </>
              ),
            },
          ]}
          faqs={[
            {
              q: "테스트 결과는 얼마나 신뢰할 수 있나요?",
              a: "5개 질문으로 산출하는 간이 진단으로, 큰 방향(안정·균형·공격)을 잡는 참고 자료입니다. 실제 투자 결정은 본인의 재정 상황, 투자 기간, 목표를 종합해 내려야 하며 필요 시 전문가 상담을 권장합니다.",
            },
            {
              q: "공격형이면 무조건 고배당 ETF가 좋은가요?",
              a: "아닙니다. 고배당(커버드콜)은 현금흐름이 크지만 주가 상승 여력이 제한되고 하락장에서 손실이 클 수 있습니다. 공격형이라도 성장형과 고배당을 적절히 섞는 분산이 일반적으로 권장됩니다.",
            },
            {
              q: "성향은 바뀔 수 있나요?",
              a: "네. 나이가 들거나 은퇴가 가까워지면 보통 안정형으로 이동하고, 목돈·투자 기간이 늘면 감내할 수 있는 위험도 달라집니다. 주기적으로 다시 점검하고 포트폴리오를 조정하는 것이 좋습니다.",
            },
          ]}
        />

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
