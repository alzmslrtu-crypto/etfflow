import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DividendGoalCalculator } from "@/components/dividend-goal-calculator"
import { ToolArticle } from "@/components/tool-article"

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

        <ToolArticle
          sections={[
            {
              heading: "필요 투자금은 어떻게 계산되나요?",
              body: (
                <>
                  <p>
                    월 배당 목표에서 필요한 투자금을 구하는 공식은 간단합니다.
                    먼저 연 목표 배당금(월 목표 × 12)을 구한 뒤, 이를 예상 배당수익률로 나눕니다.
                  </p>
                  <p className="rounded-lg bg-secondary/60 px-4 py-3 text-foreground font-medium">
                    필요 투자금 = (월 목표 배당금 × 12) ÷ 배당수익률
                  </p>
                  <p>
                    예를 들어 <strong className="text-foreground">월 100만원</strong>의 배당을 배당수익률{" "}
                    <strong className="text-foreground">4%</strong>로 받으려면, (100만원 × 12) ÷ 0.04 ={" "}
                    <strong className="text-foreground">3억원</strong>이 필요합니다. 배당수익률이 8%라면 절반인 1.5억원으로 줄어듭니다.
                  </p>
                </>
              ),
            },
            {
              heading: "목표를 세울 때 함께 고려할 점",
              body: (
                <>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>
                      표시된 필요 투자금은 <strong className="text-foreground">세전 기준</strong>입니다. 실제 손에 쥐는 세후 금액은
                      배당소득세(국내 15.4%, 미국 15%)만큼 줄어들므로, 세후 목표라면 투자금이 더 필요합니다.
                    </li>
                    <li>
                      배당수익률이 높을수록 필요 투자금은 줄지만, 고배당(커버드콜)은 주가 하락 위험이나 배당 삭감 가능성도 함께 커집니다.
                    </li>
                    <li>
                      한 번에 목돈이 없다면, DRIP 복리 계산기로 매월 적립하며 목표에 도달하는 기간을 시뮬레이션해 볼 수 있습니다.
                    </li>
                  </ul>
                </>
              ),
            },
          ]}
          faqs={[
            {
              q: "배당수익률은 몇 %로 잡는 게 좋나요?",
              a: "안정적인 배당성장형(SCHD 등)은 3~4%, 고배당 커버드콜형(JEPI·KODEX 미국배당커버드콜 등)은 7~10% 수준입니다. 수익률을 높게 잡으면 필요 투자금은 줄지만 위험도 커지므로, 본인이 실제 투자할 종목의 최근 배당수익률로 계산하는 것이 현실적입니다.",
            },
            {
              q: "세금을 감안하면 얼마가 더 필요한가요?",
              a: "세후 기준으로 목표를 맞추려면 대략 필요 투자금을 (1 − 세율)로 한 번 더 나눠야 합니다. 예컨대 국내 상장 ETF라면 세전 필요 투자금을 0.846으로 나눈 만큼이 세후 목표를 채우는 데 필요합니다. 정확한 세후 금액은 배당소득세 계산기에서 확인하세요.",
            },
            {
              q: "매월 적립으로도 목표에 도달할 수 있나요?",
              a: "네. 목돈이 없어도 매월 꾸준히 적립하고 배당을 재투자하면 복리로 목표에 다가갈 수 있습니다. DRIP 복리 계산기에서 월 적립액과 기간을 넣어 도달 시점을 시뮬레이션해 보세요.",
            },
          ]}
        />

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
