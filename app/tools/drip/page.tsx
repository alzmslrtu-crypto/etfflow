import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DripSimulator } from "@/components/drip-simulator"
import { ToolArticle } from "@/components/tool-article"

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

        <ToolArticle
          sections={[
            {
              heading: "DRIP(배당 재투자)란 무엇인가요?",
              body: (
                <>
                  <p>
                    DRIP은 <strong className="text-foreground">Dividend ReInvestment Plan</strong>의 약자로,
                    받은 배당금을 소비하지 않고 같은 자산에 다시 투자하는 전략입니다. 재투자한 배당금이 또 배당을 낳고,
                    그 배당이 다시 재투자되면서 <strong className="text-foreground">복리(compound)</strong> 효과가 발생합니다.
                    투자 기간이 길수록 원금 대비 자산 증가 폭이 기하급수적으로 커지는 것이 핵심입니다.
                  </p>
                  <p>
                    이 시뮬레이터는 초기 투자금, 매월 추가 적립액, 예상 배당수익률, 투자 기간을 입력하면
                    배당을 재투자했을 때의 미래 자산을 그래프로 보여 줍니다.
                  </p>
                </>
              ),
            },
            {
              heading: "복리 계산은 어떻게 이루어지나요?",
              body: (
                <>
                  <p>
                    이 계산기는 매년 발생한 배당금을 전액 재투자한다고 가정하고, 여기에 매월 적립액을 더해 자산을 누적합니다.
                    핵심은 <strong className="text-foreground">배당수익률만큼 자산이 매년 재투자되어 원금이 커지고</strong>,
                    커진 원금이 다시 더 많은 배당을 만든다는 점입니다.
                  </p>
                  <p>
                    예를 들어 초기 1,000만원을 배당수익률 4%에 넣고 배당을 모두 재투자하면 1년 뒤 약 1,040만원,
                    이 40만원이 다시 4% 배당을 만들어 시간이 지날수록 곡선이 가팔라집니다. 여기에 매월 적립까지 더하면
                    자산 성장 속도는 훨씬 빨라집니다.
                  </p>
                </>
              ),
            },
          ]}
          faqs={[
            {
              q: "배당을 재투자하는 것과 그냥 쓰는 것은 얼마나 차이가 나나요?",
              a: "기간이 길수록 차이는 극적으로 벌어집니다. 배당을 소비하면 원금은 그대로지만, 재투자하면 원금 자체가 계속 불어나 같은 배당수익률에서도 받는 배당 금액이 매년 늘어납니다. 10년, 20년 단위로 보면 재투자 여부가 최종 자산을 크게 좌우합니다.",
            },
            {
              q: "실제로 세금은 반영되나요?",
              a: "이 시뮬레이터는 배당을 전액 재투자한다는 이상적인 가정으로 계산합니다. 실제로는 배당에 세금(국내 15.4%, 미국 15%)이 붙어 재투자 가능한 금액이 줄어들 수 있으므로, 세후 실수령액은 배당소득세 계산기에서 별도로 확인하는 것이 좋습니다.",
            },
            {
              q: "배당수익률은 얼마로 넣는 게 현실적인가요?",
              a: "대표적으로 SCHD·배당성장형은 3~4%, JEPI·커버드콜형 고배당은 7~10% 수준입니다. 다만 고배당일수록 주가 성장이 낮은 경향이 있으므로, 실제 종목의 최근 배당수익률을 참고해 보수적으로 입력하는 것을 권장합니다.",
            },
          ]}
        />

        <div className="mt-10">
          <Link
            href="/tools/dividend-goal"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-primary/30 transition-all"
          >
            월 배당금 목표 계산기도 써보기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
