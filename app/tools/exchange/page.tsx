import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ExchangeCalculator } from "@/components/exchange-calculator"
import { ToolArticle } from "@/components/tool-article"

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

        <ToolArticle
          sections={[
            {
              heading: "미국 ETF 투자에서 환율이 중요한 이유",
              body: (
                <>
                  <p>
                    SCHD·VOO·JEPI 같은 미국 상장 ETF는 <strong className="text-foreground">달러로 사고파는</strong> 자산입니다.
                    따라서 한국 투자자의 실제 수익률은 <strong className="text-foreground">주가 변동 + 환율 변동</strong>이 합쳐져 결정됩니다.
                    주가가 그대로여도 원/달러 환율이 오르면 원화 환산 자산은 늘고, 환율이 내리면 줄어듭니다.
                  </p>
                  <p>
                    배당금 역시 달러로 지급되므로, 원화로 얼마를 받는지 계산하려면 환율 환산이 필요합니다.
                    이 계산기는 실시간 원/달러 환율로 원화 ↔ 달러를 즉시 환산해 줍니다.
                  </p>
                </>
              ),
            },
            {
              heading: "환전·환율 계산 시 알아둘 점",
              body: (
                <>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>
                      표시 환율은 시장 <strong className="text-foreground">매매기준율</strong>에 가깝습니다. 실제 증권사에서 환전할 때는
                      살 때·팔 때 스프레드(환전 수수료)가 붙어 조금 더 불리한 환율이 적용됩니다.
                    </li>
                    <li>
                      증권사마다 <strong className="text-foreground">환전 우대율</strong>이 다르므로, 큰 금액을 환전할 때는 우대율을 비교하면 비용을 아낄 수 있습니다.
                    </li>
                    <li>
                      미국 주식 매도 시 양도차익에 대한 세금(양도소득세)은 별도이며, 환율에 따른 원화 환산 손익도 과세 계산에 영향을 줄 수 있습니다.
                    </li>
                  </ul>
                </>
              ),
            },
          ]}
          faqs={[
            {
              q: "여기 표시되는 환율은 어디서 가져오나요?",
              a: "네이버 금융의 실시간 원/달러 환율 데이터를 기준으로 환산합니다. 시장 매매기준율에 가까운 값으로, 실제 증권사 환전 시 적용되는 환율과는 스프레드만큼 차이가 날 수 있습니다.",
            },
            {
              q: "미국 ETF는 원화로 바로 살 수 있나요?",
              a: "국내 증권사에서 원화로 매수 주문을 넣으면 증권사가 자동으로 환전(원화 → 달러)한 뒤 매수하거나, 미리 달러로 환전해 두고 매수할 수 있습니다. 환전 우대율과 환율 타이밍에 따라 비용이 달라집니다.",
            },
            {
              q: "환율이 오르면 무조건 이득인가요?",
              a: "미국 자산을 보유 중이라면 원/달러 환율 상승은 원화 환산 자산 가치를 높여 유리합니다. 반대로 새로 매수하려는 시점이라면 같은 달러어치를 사는 데 더 많은 원화가 필요해 불리합니다.",
            },
          ]}
        />

        <div className="mt-10">
          <Link href="/tools" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-primary/30 transition-all">
            다른 계산기 보기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
