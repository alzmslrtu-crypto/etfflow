import { ETFComparison } from "@/components/etf-comparison"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"
import { ETF_DIRECTORY, resolveEtfInfo } from "@/lib/etf-directory"
import { FAQ_ITEMS } from "@/lib/faq"
import { getEtfSummaries } from "@/lib/etf-quote"
import { getDividendSafetyBatch } from "@/lib/dividend-safety"
import { TickerSearch } from "@/components/ticker-search"
import { AdFit } from "@/components/adfit"

// 시세 데이터를 1시간마다 갱신 (ISR)
export const revalidate = 3600

// 홈에 배당 성장/삭감 대비가 드러나는 대표 종목만 싣는다. 전체는 /dividend-safety.
const SAFETY_PREVIEW = ["SCHD", "VOO", "JEPI", "JEPQ", "QYLD"]

export default async function Page() {
  // 인기 ETF 그리드에 실시간 지표를 함께 렌더한다(크롤러가 읽을 수 있게 HTML에 포함).
  const popular = ETF_DIRECTORY.slice(0, 12)
  const [live, safetyRows] = await Promise.all([
    getEtfSummaries(popular.map((e) => e.symbol)),
    getDividendSafetyBatch(SAFETY_PREVIEW),
  ])
  const safety = safetyRows
    .filter((r) => r.sufficient)
    .sort((a, b) => (b.cagr ?? -999) - (a.cagr ?? -999))

  return (
    <main className="min-h-screen bg-background">
      {/* Hero — 검색을 중심에 둔 프리미엄 핀테크 레이아웃 */}
      <div className="relative overflow-hidden border-b border-border">
        {/* 은은한 인디고 방사형 배경 */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(60rem 30rem at 50% -8rem, color-mix(in srgb, var(--primary) 14%, transparent), transparent)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-stock-up" />
            실시간 배당 데이터 · 국내외 {ETF_DIRECTORY.length}개 종목
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 leading-[1.1] tracking-[-0.035em]">
            배당금이 얼마나,<br />
            <span className="text-primary">언제, 계속</span> 들어오는지
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            종목만 검색하면 배당 성장률·삭감 이력·세후 수령액까지.
            국내·미국 ETF와 배당주를 실제 지급 기록으로 확인하세요.
          </p>
          <div className="max-w-xl mx-auto text-left">
            <TickerSearch />
          </div>
        </div>
      </div>

      {/* 히어로와 비교 도구 사이 광고 (PC 전용) */}
      <div className="max-w-6xl mx-auto px-4">
        <AdFit unit="DAN-iD54RiHVYbJNWsS9" width={728} height={90} className="hidden md:flex py-8" />
      </div>

      {/* ETF Comparison Tool */}
      <div id="compare" className="max-w-6xl mx-auto px-4 pb-12 sm:pb-16">
        <ETFComparison />
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
          데이터 출처: 미국 상장 ETF는 Yahoo Finance, 국내 상장 ETF는 네이버 금융. 시세는 최대 1시간 지연될 수 있으며
          배당수익률은 최근 1년 실지급 배당 기준입니다. 표시 금액은 세전이며, 세후 실수령액은{' '}
          <Link href="/tools/tax" className="text-primary hover:underline">배당소득세 계산기</Link>에서 확인하세요.
          모든 정보는 투자 권유가 아닙니다.
        </p>
      </div>

      {/* 배당 지속성 — 자기소개 대신 실제 지급 이력을 보여준다 */}
      <div className="py-16 sm:py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            이 ETF는 배당을 늘렸을까, 줄였을까
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            지금 배당수익률이 높다는 것과 앞으로도 그 배당이 나온다는 것은 다릅니다.
            실제 지급 이력만 놓고 계산한 최근 배당 성장률입니다.
          </p>

          {safety.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left font-medium p-3">ETF</th>
                    <th className="text-right font-medium p-3">배당 성장률</th>
                    <th className="text-right font-medium p-3">삭감</th>
                    <th className="text-right font-medium p-3">주가 변동</th>
                  </tr>
                </thead>
                <tbody>
                  {safety.map((r) => (
                    <tr key={r.symbol} className="border-b border-border last:border-0">
                      <td className="p-3">
                        <Link
                          href={`/etf/${encodeURIComponent(r.symbol)}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {resolveEtfInfo(r.symbol).name}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.from}~{r.to} 연평균</div>
                      </td>
                      <td className={`p-3 text-right tabular-nums font-semibold ${
                        r.cagr === null ? "text-muted-foreground" : r.cagr >= 0 ? "text-foreground" : "text-red-600"
                      }`}>
                        {r.cagr === null ? "—" : `${r.cagr >= 0 ? "+" : ""}${r.cagr.toFixed(1)}%`}
                      </td>
                      <td className="p-3 text-right tabular-nums">
                        {r.cutCount === 0
                          ? <span className="text-muted-foreground">없음</span>
                          : <span className="text-red-600 font-medium">{r.cutCount}회</span>}
                      </td>
                      <td className={`p-3 text-right tabular-nums ${r.priceReturn < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                        {r.priceReturn >= 0 ? "+" : ""}{r.priceReturn.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link
            href="/dividend-safety"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            전체 ETF 배당 삭감 이력 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Popular ETF Detail Links */}
      <div className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              인기 ETF 상세 정보
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              실시간 가격·배당수익률·배당월·운용보수를 종목별로 확인하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popular.map((etf) => {
              const stats = live[etf.symbol]
              return (
                <Link
                  key={etf.symbol}
                  href={`/etf/${encodeURIComponent(etf.symbol)}`}
                  className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <TickerLogo symbol={etf.symbol} label={etf.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground truncate">{etf.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{etf.category}</div>
                    {stats && stats.dividendYield > 0 && (
                      <div className="text-xs mt-1 tabular-nums">
                        <span className="text-primary font-semibold">배당수익률 {stats.dividendYield.toFixed(2)}%</span>
                        {stats.expenseRatio > 0 && (
                          <span className="text-muted-foreground"> · 운용보수 {stats.expenseRatio.toFixed(2)}%</span>
                        )}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-20 sm:py-28 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              배당 투자 가이드
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ETF 초보자부터 경험자까지 모두 배워갈 수 있는 실용적인 정보를 제공합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/blog/etf-beginners-guide" className="group p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                <span className="text-xs font-semibold text-primary">입문</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                배당 ETF 완벽 가이드
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                배당 ETF란 무엇인지, 왜 투자해야 하는지 초보자를 위한 기본을 알아봅니다.
              </p>
              <span className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                자세히 보기 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link href="/blog/schd-vs-jepi" className="group p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                <span className="text-xs font-semibold text-primary">비교</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                SCHD vs JEPI 비교분석
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                인기 배당 ETF들의 수익률, 배당률, 변동성을 상세히 비교 분석합니다.
              </p>
              <span className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                자세히 보기 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link href="/blog/dividend-reinvestment" className="group p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                <span className="text-xs font-semibold text-primary">전략</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                배당금 재투자의 힘
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                복리 효과를 극대화하고 장기적인 자산을 축적하는 전략을 배워봅니다.
              </p>
              <span className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                자세히 보기 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-lg text-muted-foreground">
              배당 ETF 투자에 대해 가장 많이 궁금해하시는 내용을 정리했습니다.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group bg-card rounded-2xl shadow-sm p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-foreground">
                  {item.question}
                  <span className="ml-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto">
            복잡한 ETF 분석은 이제 그만. ETF Flow로 쉽고 빠르게 비교하세요.
          </p>
          <Link 
            href="#compare"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-full font-bold hover:shadow-lg transition-all"
          >
            ETF 비교 시작하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
