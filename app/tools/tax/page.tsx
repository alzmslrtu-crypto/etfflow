import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TaxCalculator } from "@/components/tax-calculator"
import { ToolArticle } from "@/components/tool-article"

export const metadata: Metadata = {
  title: "배당소득세 계산기 — 세후 실수령 배당금 | ETF Flow",
  description:
    "배당금에서 세금을 떼면 실제로 얼마를 받을까요? 국내·미국 상장 구분에 따라 배당소득세(15.4%·15%)를 적용한 세후 실수령액과 금융소득종합과세 여부를 계산합니다.",
  alternates: { canonical: "https://www.etfflow.kr/tools/tax" },
}

export default function TaxToolPage() {
  return (
    <main className="min-h-screen bg-background">
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

        <ToolArticle
          sections={[
            {
              heading: "배당소득세, 왜 세후로 계산해야 하나요?",
              body: (
                <>
                  <p>
                    광고나 종목 정보에 표시되는 배당률은 대부분 <strong className="text-foreground">세전(세금을 떼기 전)</strong> 기준입니다.
                    하지만 실제로 통장에 들어오는 금액은 세금을 뗀 <strong className="text-foreground">세후 실수령액</strong>입니다.
                    특히 배당수익률이 높은 커버드콜·고배당 ETF일수록 떼이는 세금의 절대액이 커지기 때문에,
                    현금흐름을 계획할 때는 반드시 세후 기준으로 봐야 합니다.
                  </p>
                  <p>
                    이 계산기는 연간 배당금과 상장 구분(국내/미국)을 입력하면 세금을 적용한 세후 실수령액을 즉시 보여주고,
                    금융소득종합과세 대상 여부까지 함께 알려 드립니다.
                  </p>
                </>
              ),
            },
            {
              heading: "배당소득세 세율과 계산 방법",
              body: (
                <>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>
                      <strong className="text-foreground">국내 상장 ETF</strong>(TIGER·KODEX·SOL 등): 배당소득세{" "}
                      <strong className="text-foreground">15.4%</strong> (배당소득세 14% + 지방소득세 1.4%)
                    </li>
                    <li>
                      <strong className="text-foreground">미국 상장 ETF</strong>(SCHD·JEPI·VOO 등): 미국 현지 원천징수{" "}
                      <strong className="text-foreground">15%</strong> (한·미 조세협약 적용)
                    </li>
                    <li>
                      연간 금융소득(이자 + 배당)이 <strong className="text-foreground">2,000만원</strong>을 초과하면
                      초과분은 <strong className="text-foreground">금융소득종합과세</strong> 대상이 되어 다른 소득과 합산 과세됩니다.
                    </li>
                  </ul>
                  <p className="mt-3">
                    세후 실수령액 = 세전 배당금 × (1 − 세율) 로 계산합니다. 예를 들어 국내 상장 ETF에서 세전 배당금이
                    연 100만원이면, 세후 실수령액은 100만원 × (1 − 0.154) = <strong className="text-foreground">84만 6천원</strong>입니다.
                  </p>
                </>
              ),
            },
          ]}
          faqs={[
            {
              q: "국내 상장과 미국 상장 ETF 중 세금 면에서 무엇이 유리한가요?",
              a: "일반 계좌 기준으로는 세율이 15% vs 15.4%라 미국 상장이 미세하게 유리합니다. 하지만 국내 상장 ETF는 연금저축·IRP·ISA 같은 절세 계좌에서 세금을 미루거나 줄일 수 있어, 절세 계좌를 활용하면 국내 상장이 더 유리해지는 경우가 많습니다.",
            },
            {
              q: "미국 ETF 배당은 국내에서 또 세금을 내나요?",
              a: "미국에서 15%를 먼저 원천징수하며, 한·미 조세협약에 따라 국내 배당소득세율(14%)보다 높아 추가 납부는 없는 것이 일반적입니다. 다만 금융소득이 연 2,000만원을 넘으면 종합과세 대상이 될 수 있습니다.",
            },
            {
              q: "금융소득종합과세는 무엇인가요?",
              a: "연간 이자와 배당을 합한 금융소득이 2,000만원을 초과하면, 초과분을 근로·사업 소득 등과 합산해 누진세율(최고 45%)로 과세하는 제도입니다. 배당 규모가 큰 투자자는 세후 수령액이 더 줄 수 있으므로 미리 확인하는 것이 좋습니다.",
            },
          ]}
        />

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
