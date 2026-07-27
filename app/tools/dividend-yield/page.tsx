import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DividendYieldCalculator } from "@/components/dividend-yield-calculator"
import { ToolArticle } from "@/components/tool-article"

export const metadata: Metadata = {
  title: "배당수익률 계산기 — 주가·배당금으로 수익률 계산 | ETF Flow",
  description:
    "현재 주가와 1주당 배당금을 입력하면 배당수익률(%)과 연 배당금 총액을 바로 계산합니다. 보유 주수를 넣어 예상 배당 총액도 확인하세요.",
  alternates: { canonical: "https://www.etfflow.kr/tools/dividend-yield" },
}

export default function DividendYieldPage() {
  return (
    <main className="min-h-screen bg-background">
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

        <ToolArticle
          sections={[
            {
              heading: "배당수익률 계산 공식",
              body: (
                <>
                  <p>
                    배당수익률(Dividend Yield)은 <strong className="text-foreground">주가 대비 1년간 받는 배당금의 비율</strong>입니다.
                    같은 배당금이라도 주가가 낮을수록 수익률은 높아집니다.
                  </p>
                  <p className="rounded-lg bg-secondary/60 px-4 py-3 text-foreground font-medium">
                    배당수익률(%) = (1주당 연 배당금 ÷ 현재 주가) × 100
                  </p>
                  <p>
                    예를 들어 주가가 <strong className="text-foreground">80달러</strong>이고 연 배당금이{" "}
                    <strong className="text-foreground">2.8달러</strong>라면, 배당수익률은 (2.8 ÷ 80) × 100 ={" "}
                    <strong className="text-foreground">3.5%</strong>입니다. 보유 주수를 입력하면 연 배당금 총액과 투자 원금도 함께 확인할 수 있습니다.
                  </p>
                </>
              ),
            },
            {
              heading: "수익률 숫자를 볼 때 주의할 점",
              body: (
                <>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>
                      대부분의 표시 배당률은 <strong className="text-foreground">세전</strong> 기준입니다. 실제 실수령은 배당소득세(국내 15.4%, 미국 15%)만큼 줄어듭니다.
                    </li>
                    <li>
                      배당수익률이 유난히 높다면 주가가 크게 하락했기 때문일 수 있습니다. 높은 숫자만 보고 판단하기보다 배당의 지속 가능성을 함께 봐야 합니다.
                    </li>
                    <li>
                      과거 배당 기준의 <strong className="text-foreground">후행 수익률(TTM)</strong>과 최근 배당 기준의 예상 수익률은 다를 수 있습니다.
                    </li>
                  </ul>
                </>
              ),
            },
          ]}
          faqs={[
            {
              q: "배당수익률과 배당성향은 어떻게 다른가요?",
              a: "배당수익률은 '주가 대비 배당금'의 비율이고, 배당성향은 '기업 순이익 중 배당으로 지급한 비율'입니다. 배당수익률은 투자자가 받는 수익 관점, 배당성향은 기업이 이익을 얼마나 나눠주는지의 관점입니다.",
            },
            {
              q: "배당수익률이 높을수록 좋은 건가요?",
              a: "꼭 그렇지는 않습니다. 수익률이 지나치게 높으면 주가 급락이나 일시적 특별배당 때문일 수 있고, 이후 배당이 삭감될 위험도 있습니다. 배당의 안정성과 성장성을 함께 확인하는 것이 중요합니다.",
            },
            {
              q: "세후 배당수익률은 어떻게 구하나요?",
              a: "세전 배당수익률에 (1 − 세율)을 곱하면 됩니다. 예를 들어 세전 4%인 미국 ETF의 세후 수익률은 4% × (1 − 0.15) = 3.4%입니다. 정확한 세후 실수령액은 배당소득세 계산기에서 확인할 수 있습니다.",
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
