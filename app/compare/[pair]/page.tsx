import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"
import { CompareLive } from "@/components/compare-live"
import { COMPARE_PAIRS, pairSlug, parsePairSlug, resolveEtfInfo } from "@/lib/etf-directory"
import { getDividendSafety, type DividendSafety } from "@/lib/dividend-safety"

// 배당 이력은 자주 바뀌지 않는다. 하루 한 번 갱신.
export const revalidate = 86400

const BASE_URL = "https://www.etfflow.kr"

export function generateStaticParams() {
  return COMPARE_PAIRS.map(([a, b]) => ({ pair: pairSlug(a, b) }))
}

/** COMPARE_PAIRS에 있는 조합인지(순서 무관). 색인 여부를 가른다. */
function isCuratedPair(x: string, y: string): boolean {
  return COMPARE_PAIRS.some(
    ([a, b]) => (a === x && b === y) || (a === y && b === x),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>
}): Promise<Metadata> {
  const { pair } = await params
  const parsed = parsePairSlug(decodeURIComponent(pair))
  if (!parsed) return { title: "ETF 비교 | ETF Flow" }
  const a = resolveEtfInfo(parsed[0])
  const b = resolveEtfInfo(parsed[1])
  const ca = a.symbol.replace(/\.(KS|KQ)$/, "")
  const cb = b.symbol.replace(/\.(KS|KQ)$/, "")
  const title = `${ca} vs ${cb} 비교 — 배당 삭감 이력·성장률·운용보수 | ETF Flow`
  const description = `${a.name}과 ${b.name} 중 어느 쪽이 배당을 늘려왔는지 실제 지급 이력으로 비교합니다. 배당 성장률, 삭감 횟수, 운용보수, 순자산을 나란히 확인하세요.`
  const url = `${BASE_URL}/compare/${pairSlug(a.symbol, b.symbol)}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    // 실지급 배당 이력(성장률·삭감)을 쌍마다 서버 렌더하므로 고유 데이터가 있다 → 색인 허용.
    // 단 이 라우트도 임의 조합을 다 받으므로(dynamicParams), 큐레이션한 쌍만 색인한다.
    // 아니면 종목 수의 제곱만큼 자동 생성 페이지가 생겨 scaled content가 된다.
    robots: isCuratedPair(parsed[0], parsed[1]) ? undefined : { index: false, follow: true },
  }
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ pair: string }>
}) {
  const { pair } = await params
  const parsed = parsePairSlug(decodeURIComponent(pair))

  if (!parsed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">올바른 비교 주소가 아닙니다.</p>
          <Link href="/#compare" className="text-primary font-semibold">ETF 비교로 가기 →</Link>
        </div>
      </main>
    )
  }

  const a = resolveEtfInfo(parsed[0])
  const b = resolveEtfInfo(parsed[1])
  const ca = a.symbol.replace(/\.(KS|KQ)$/, "")
  const cb = b.symbol.replace(/\.(KS|KQ)$/, "")

  // 이 페이지의 존재 이유는 "어느 쪽이 배당을 더 잘 지켰나"다.
  // 실시간 시세는 홈 비교 도구에도 있지만, 실지급 이력 대조는 여기에만 있다.
  const [sa, sb] = await Promise.all([
    getDividendSafety(a.symbol),
    getDividendSafety(b.symbol),
  ])
  const bothRated = Boolean(sa?.sufficient && sb?.sufficient)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/etf" className="hover:text-primary transition-colors">ETF 모음</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{ca} vs {cb}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {ca} vs {cb} 비교
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          {a.name}과(와) {b.name}의 배당·수수료·순자산을 실시간으로 비교합니다.
        </p>

        {/* 두 ETF 카드 */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[a, b].map((etf) => (
            <Link
              key={etf.symbol}
              href={`/etf/${encodeURIComponent(etf.symbol)}`}
              className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all"
            >
              <TickerLogo symbol={etf.symbol} label={etf.name} size={40} />
              <div className="min-w-0">
                <div className="font-bold text-foreground truncate">{etf.symbol.replace(/\.(KS|KQ)$/, "")}</div>
                <div className="text-xs text-muted-foreground truncate">{etf.category}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* 실시간 비교표 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-4">실시간 비교</h2>
          <CompareLive symbolA={a.symbol} symbolB={b.symbol} />
        </section>

        {/* 배당 지속성 대조 — 이 페이지에만 있는 데이터 */}
        {bothRated && sa && sb && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-1">어느 쪽이 배당을 지켰나</h2>
            <p className="text-sm text-muted-foreground mb-4">
              실제로 지급된 배당만 놓고 계산했습니다. 두 종목의 평가 구간이 다르면 합계를 직접 비교하지 마세요.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-border bg-card mb-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-medium p-3 text-muted-foreground w-[38%]">항목</th>
                    <th className="text-right font-medium p-3 text-foreground">{ca}</th>
                    <th className="text-right font-medium p-3 text-foreground">{cb}</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    {
                      label: "평가 구간",
                      render: (s: DividendSafety) => `${s.from}~${s.to}`,
                      plain: true,
                    },
                    {
                      label: "배당 성장률 (연평균)",
                      render: (s: DividendSafety) =>
                        s.cagr === null ? "—" : `${s.cagr >= 0 ? "+" : ""}${s.cagr.toFixed(1)}%`,
                      good: (s: DividendSafety) => (s.cagr ?? 0) >= 0,
                    },
                    {
                      label: "배당 삭감",
                      render: (s: DividendSafety) =>
                        s.cutCount === 0 ? "없음" : `${s.cutCount}회 (최대 −${s.worstCut.toFixed(0)}%)`,
                      good: (s: DividendSafety) => s.cutCount === 0,
                    },
                    {
                      label: "주가 변동",
                      render: (s: DividendSafety) => `${s.priceReturn >= 0 ? "+" : ""}${s.priceReturn.toFixed(1)}%`,
                      good: (s: DividendSafety) => s.priceReturn >= 0,
                    },
                    {
                      label: "받은 배당",
                      render: (s: DividendSafety) => `+${s.dividendReturn.toFixed(1)}%`,
                      plain: true,
                    },
                    {
                      label: "합계 (주가 + 배당)",
                      render: (s: DividendSafety) => `${s.totalReturn >= 0 ? "+" : ""}${s.totalReturn.toFixed(1)}%`,
                      good: (s: DividendSafety) => s.totalReturn >= 0,
                    },
                  ] as const).map((row) => (
                    <tr key={row.label} className="border-b border-border last:border-0">
                      <td className="p-3 text-muted-foreground">{row.label}</td>
                      {[sa, sb].map((s, i) => {
                        const plain = "plain" in row && row.plain
                        const ok = !plain && "good" in row ? row.good(s) : null
                        return (
                          <td
                            key={i}
                            className={`p-3 text-right tabular-nums font-semibold ${
                              ok === null ? "text-foreground" : ok ? "text-stock-up" : "text-stock-down"
                            }`}
                          >
                            {row.render(s)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              배당 성장률은 1주당 배당금이 매년 몇 퍼센트씩 변했는지로, 주가와 무관한 값입니다.
              배당수익률이 높아도 이 값이 마이너스면 배당이 줄고 있다는 뜻입니다.
              세전·환율 미반영이며 배당 재투자는 가정하지 않았습니다.{" "}
              <Link href="/dividend-safety" className="text-primary hover:underline">
                전체 ETF 배당 삭감 이력
              </Link>
            </p>
          </section>
        )}

        {/* 각 ETF 설명 */}
        <section className="mb-10 space-y-6">
          {[a, b].map((etf) =>
            etf.description ? (
              <div key={etf.symbol}>
                <h3 className="text-base font-bold text-foreground mb-2">{etf.name}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{etf.description}</p>
              </div>
            ) : null,
          )}
        </section>

        {/* CTA */}
        <Link
          href="/#compare"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all mb-10"
        >
          비교 도구에서 직접 담아보기
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* 면책 */}
        <div className="rounded-xl bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
          본 페이지는 정보 제공 목적이며 투자 권유가 아닙니다. 데이터는 Yahoo Finance·네이버 금융 기준으로 지연되거나 실제와 차이가 있을 수 있습니다.
        </div>
      </div>
    </main>
  )
}
