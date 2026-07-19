import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ETF_DIRECTORY, resolveEtfInfo } from "@/lib/etf-directory"
import { getEtfQuote } from "@/lib/etf-quote"
import { ToolArticle } from "@/components/tool-article"

export const metadata: Metadata = {
  title: "분배율 vs 실제 수익률 — 커버드콜 ETF 총수익 점검 | ETF Flow",
  description:
    "분배율 10%인 커버드콜 ETF는 정말 연 10%를 벌어줬을까? 실제 주가 변동과 지급된 분배금을 합친 총수익률을 계산해 분배율과 나란히 비교합니다.",
  alternates: { canonical: "https://www.etfflow.kr/tools/real-return" },
}

// 시세를 1시간마다 갱신 (ISR)
export const revalidate = 3600

// 커버드콜(고분배) ETF + 비교 기준이 되는 일반 배당·지수 ETF
const COVERED_CALL = ETF_DIRECTORY.filter((e) => e.category.includes("커버드콜")).map((e) => e.symbol)
const BENCHMARKS = ["SCHD", "VOO"]

type Row = {
  symbol: string
  name: string
  currency: string
  startDate: string
  years: number
  priceReturn: number
  distributions: number
  totalReturn: number
  annualized: number
  currentYield: number
}

async function buildRow(symbol: string): Promise<Row | null> {
  let quote
  try {
    quote = await getEtfQuote(symbol, "5Y")
  } catch {
    return null
  }

  const chart = quote.chartData
  if (chart.length < 2) return null

  const start = chart[0]
  const end = chart[chart.length - 1]
  if (!start.price || !end.price) return null

  // 차트 구간 안에 지급된 분배금만 합산한다(구간 밖 배당을 더하면 수익률이 부풀려진다).
  const distributions = quote.dividendHistory
    .filter((d) => d.date >= start.date && d.date <= end.date)
    .reduce((sum, d) => sum + d.amount, 0)

  const years = (new Date(end.date).getTime() - new Date(start.date).getTime()) / (365.25 * 24 * 3600 * 1000)
  if (years <= 0) return null

  const priceReturn = ((end.price - start.price) / start.price) * 100
  const totalReturn = ((end.price - start.price + distributions) / start.price) * 100
  const annualized = (Math.pow(1 + totalReturn / 100, 1 / years) - 1) * 100

  return {
    symbol,
    name: resolveEtfInfo(symbol).name,
    currency: quote.currency,
    startDate: start.date,
    years,
    priceReturn,
    distributions,
    totalReturn,
    annualized,
    currentYield: quote.dividendYield,
  }
}

function pct(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`
}

export default async function RealReturnPage() {
  const symbols = [...COVERED_CALL, ...BENCHMARKS]
  const rows = (await Promise.all(symbols.map(buildRow)))
    .filter((r): r is Row => r !== null)
    .sort((a, b) => b.currentYield - a.currentYield)

  const benchmarkRows = rows.filter((r) => BENCHMARKS.includes(r.symbol))
  const coveredRows = rows.filter((r) => !BENCHMARKS.includes(r.symbol))

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-primary transition-colors">계산기</Link>
          <span>/</span>
          <span className="text-foreground font-medium">분배율 vs 실제 수익률</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          분배율 vs 실제 수익률
        </h1>
        <p className="text-base text-muted-foreground mb-8 leading-relaxed">
          분배율 10%짜리 커버드콜 ETF는 정말 매년 10%를 벌어줬을까요? 분배율은 &ldquo;얼마를 나눠줬는가&rdquo;일 뿐,
          &ldquo;얼마를 벌었는가&rdquo;가 아닙니다. 주가가 그만큼 내려갔다면 내 돈을 돌려받은 것에 가깝습니다.
          아래 표는 <strong className="text-foreground">주가 변동 + 실제 지급된 분배금</strong>을 합쳐 총수익률을 계산합니다.
        </p>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
            데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card mb-4">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left font-medium p-3">ETF</th>
                  <th className="text-right font-medium p-3">현재 분배율</th>
                  <th className="text-right font-medium p-3">주가 변동</th>
                  <th className="text-right font-medium p-3">받은 분배금</th>
                  <th className="text-right font-medium p-3">총수익률</th>
                  <th className="text-right font-medium p-3">연환산</th>
                </tr>
              </thead>
              <tbody>
                {[...coveredRows, ...benchmarkRows].map((r) => {
                  const isBenchmark = BENCHMARKS.includes(r.symbol)
                  return (
                    <tr key={r.symbol} className={`border-b border-border last:border-0 ${isBenchmark ? "bg-secondary/30" : ""}`}>
                      <td className="p-3">
                        <Link href={`/etf/${encodeURIComponent(r.symbol)}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                          {r.name}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {r.startDate} 이후 · {r.years.toFixed(1)}년
                          {isBenchmark && " · 비교 기준"}
                        </div>
                      </td>
                      <td className="p-3 text-right tabular-nums font-semibold text-primary">
                        {r.currentYield.toFixed(2)}%
                      </td>
                      <td className={`p-3 text-right tabular-nums ${r.priceReturn >= 0 ? "text-stock-up" : "text-stock-down"}`}>
                        {pct(r.priceReturn)}
                      </td>
                      <td className="p-3 text-right tabular-nums text-muted-foreground">
                        +{(r.totalReturn - r.priceReturn).toFixed(1)}%
                      </td>
                      <td className="p-3 text-right tabular-nums font-bold text-foreground">
                        {pct(r.totalReturn)}
                      </td>
                      <td className="p-3 text-right tabular-nums font-semibold text-foreground">
                        {pct(r.annualized)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed mb-10">
          기간은 종목마다 다릅니다 — 상장한 지 5년이 안 된 ETF는 상장 이후 구간만 계산하므로, 표의
          &ldquo;{"{"}시작일{"}"} 이후&rdquo;와 연수를 함께 보세요. 서로 다른 기간의 총수익률을 직접 비교하면
          안 됩니다. 연환산 수익률로 비교하는 편이 그나마 공정하지만, 시장 국면이 다르면 이 역시 완전하지 않습니다.
        </p>

        <ToolArticle
          sections={[
            {
              heading: "분배율이 높은데 총수익률이 낮은 이유",
              body: (
                <>
                  <p>
                    커버드콜 ETF는 보유 주식에 콜옵션을 팔아 받은 프리미엄을 분배금으로 나눠줍니다.
                    프리미엄을 받는 대가로 <strong className="text-foreground">주가가 크게 오를 때의 상승분을 포기</strong>합니다.
                    그래서 강세장에서는 분배금은 꼬박꼬박 나오는데 주가는 제자리이거나 오히려 내려가는 일이 생깁니다.
                  </p>
                  <p>
                    여기에 더해, 분배금 중 일부는 운용 성과가 아니라{" "}
                    <strong className="text-foreground">투자자가 넣은 원금에서 나올 수 있습니다</strong>(원금반환, ROC).
                    이 경우 분배금을 받는 만큼 순자산가치(NAV)가 줄어들어, 내 돈을 나눠 받은 것과 다르지 않습니다.
                    분배율만 보고 &ldquo;연 10% 수익&rdquo;이라고 이해하면 안 되는 이유입니다.
                  </p>
                  <p>
                    금융감독원도 2026년 커버드콜 ETF에 대해 소비자경보를 냈습니다. 종목명에 붙은 목표 분배율은
                    <strong className="text-foreground"> 확정 수익률이 아니며</strong>, 달성하지 못할 수도 있고
                    달성하더라도 주가 하락으로 총수익은 마이너스일 수 있습니다.
                  </p>
                </>
              ),
            },
            {
              heading: "이 표는 어떻게 계산했나",
              body: (
                <>
                  <ul className="space-y-2 list-disc list-inside">
                    <li><strong className="text-foreground">주가 변동</strong> = (현재 종가 − 시작일 종가) ÷ 시작일 종가</li>
                    <li><strong className="text-foreground">받은 분배금</strong> = 해당 구간에 실제 지급된 주당 분배금 합계 ÷ 시작일 종가</li>
                    <li><strong className="text-foreground">총수익률</strong> = 주가 변동 + 받은 분배금</li>
                    <li><strong className="text-foreground">연환산</strong> = (1 + 총수익률)<sup>1/보유연수</sup> − 1</li>
                  </ul>
                  <p className="mt-3">
                    <strong className="text-foreground">한계를 분명히 밝힙니다.</strong> 분배금을 받은 즉시 재투자했다고 가정하지 않은
                    단순 합산입니다. 재투자를 반영하면 실제 총수익은 이보다 조금 높아집니다. 또한{" "}
                    <strong className="text-foreground">세금과 거래비용을 반영하지 않은 세전 기준</strong>이며, 환율 변동도 빼고
                    현지 통화 기준으로 계산했습니다. 세후 기준은{" "}
                    <Link href="/tools/tax" className="text-primary hover:underline">배당소득세 계산기</Link>를 함께 보세요.
                  </p>
                  <p className="mt-3">
                    데이터 출처는 Yahoo Finance(미국 상장)와 네이버 금융(국내 상장)이며 1시간마다 갱신됩니다.
                    분배금 이력이 누락된 종목은 총수익률이 실제보다 낮게 나올 수 있습니다.
                  </p>
                </>
              ),
            },
          ]}
          faqs={[
            {
              q: "분배율이 높은 ETF는 무조건 피해야 하나요?",
              a: "아닙니다. 지금 당장 매달 현금흐름이 필요한 사람에게는 유용한 도구입니다. 문제는 '분배율 = 수익률'로 오해하는 것입니다. 자산을 불려야 하는 시기라면 총수익률이 더 높은 배당성장·지수 ETF가 유리한 경우가 많고, 은퇴 후 현금흐름이 목적이라면 커버드콜이 맞을 수 있습니다. 목적에 따라 다릅니다.",
            },
            {
              q: "표의 기간이 종목마다 다른데 그대로 비교해도 되나요?",
              a: "안 됩니다. 상장한 지 얼마 안 된 ETF는 구간이 짧아 시장 국면 하나만 반영합니다. 총수익률 대신 연환산 수익률을 보되, 그것도 '같은 기간'이 아니라는 점을 감안하세요. 정확한 비교를 원하면 두 종목의 공통 구간을 따로 보는 것이 맞습니다.",
            },
            {
              q: "ROC(원금반환) 비율은 왜 표에 없나요?",
              a: "ROC 비율은 운용사가 내는 19a-1 공시나 연말 세무자료(1099-DIV)에 실리며, 실시간 시세 API로는 받을 수 없습니다. 정확하지 않은 추정치를 숫자로 제시하는 대신, 총수익률과 주가 변동을 함께 보여 주가가 얼마나 깎였는지 간접적으로 확인하도록 했습니다. 주가 변동이 크게 마이너스인데 분배금만 많다면 원금반환 비중을 의심해 볼 만합니다.",
            },
          ]}
        />

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/tools/tax"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            세후 실수령액도 계산하기
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/etf"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-card border border-border rounded-full font-semibold text-foreground hover:border-primary/50 transition-all"
          >
            배당 ETF 모음 보기
          </Link>
        </div>
      </div>
    </main>
  )
}
