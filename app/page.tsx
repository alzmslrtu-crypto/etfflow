import { ETFComparison } from "@/components/etf-comparison"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"
import { ETF_DIRECTORY, resolveEtfInfo } from "@/lib/etf-directory"
import { FAQ_ITEMS } from "@/lib/faq"
import { getEtfSummaries } from "@/lib/etf-quote"
import { getDividendSafetyBatch } from "@/lib/dividend-safety"
import { TickerSearch } from "@/components/ticker-search"

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
      {/* 첫 화면은 문구가 아니라 기입란이다. 사용자는 이미 찾을 종목을 알고 온다. */}
      <div className="pt-12 pb-10 sm:pt-20 sm:pb-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-3 tracking-[-0.03em] leading-[1.15]">
            배당금이 얼마나,<br />언제, 계속 들어오는지
          </h1>
          <p className="text-base text-muted-foreground mb-10">
            국내·미국 ETF와 배당주의 실제 지급 기록.
          </p>
          <TickerSearch />
        </div>
      </div>

      {/* ETF Comparison Tool */}
      <div id="compare" className="max-w-3xl mx-auto px-4 pb-12 sm:pb-16">
        <ETFComparison />
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
          데이터 출처: 미국 상장 ETF는 Yahoo Finance, 국내 상장 ETF는 네이버 금융. 시세는 최대 1시간 지연될 수 있으며
          배당수익률은 최근 1년 실지급 배당 기준입니다. 표시 금액은 세전이며, 세후 실수령액은{' '}
          <Link href="/tools/tax" className="text-primary hover:underline">배당소득세 계산기</Link>에서 확인하세요.
          모든 정보는 투자 권유가 아닙니다.
        </p>
      </div>

      {/* 배당 지속성 — 통장 내역처럼 괘선 위에 앉힌다 */}
      <div className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="rule-double pt-3 mb-1 flex items-baseline justify-between">
            <span className="eyebrow">배당 지속성</span>
            <span className="eyebrow">
              {safety.length > 0 ? `${safety[0].from}—${safety[0].to}` : "연평균"}
            </span>
          </div>

          <div className="bg-card border border-border">
            {safety.map((r) => (
              <Link
                key={r.symbol}
                href={`/etf/${encodeURIComponent(r.symbol)}`}
                className="ledger-row grid-cols-[1fr_auto] sm:grid-cols-[1fr_7rem_6rem] border-b border-border last:border-0 hover:bg-secondary transition-colors group"
              >
                <div className="min-w-0">
                  <div className="font-mono font-semibold text-foreground group-hover:text-primary transition-colors">
                    {r.symbol.replace(/\.(KS|KQ)$/, "")}
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {resolveEtfInfo(r.symbol).name}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`figure text-2xl sm:text-3xl leading-none ${
                      r.cagr === null ? "text-muted-foreground" : r.cagr >= 0 ? "text-primary" : "text-stock-down"
                    }`}
                  >
                    {r.cagr === null ? "—" : `${r.cagr >= 0 ? "+" : "−"}${Math.abs(r.cagr).toFixed(1)}`}
                    <span className="text-base">%</span>
                  </div>
                  <div className="eyebrow mt-1.5">배당 성장</div>
                </div>

                <div className="hidden sm:block text-right">
                  <div className={`figure text-lg leading-none ${r.cutCount === 0 ? "text-muted-foreground" : "text-stock-down"}`}>
                    {r.cutCount === 0 ? "없음" : `${r.cutCount}회`}
                  </div>
                  <div className="eyebrow mt-1.5">삭감</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              1주당 배당금이 매년 몇 퍼센트씩 변했는지. 주가와 무관한 값입니다.
            </p>
            <Link
              href="/dividend-safety"
              className="eyebrow whitespace-nowrap text-foreground hover:text-primary transition-colors"
            >
              전체 보기 →
            </Link>
          </div>
        </div>
      </div>

      {/* Popular ETF Detail Links */}
      <div className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="rule-double pt-3 mb-1 flex items-baseline justify-between">
            <span className="eyebrow">인기 종목</span>
            <span className="eyebrow">배당수익률 · 운용보수</span>
          </div>

          <div className="bg-card border border-border">
            {popular.map((etf) => {
              const stats = live[etf.symbol]
              return (
                <Link
                  key={etf.symbol}
                  href={`/etf/${encodeURIComponent(etf.symbol)}`}
                  className="ledger-row grid-cols-[auto_1fr_auto] border-b border-border last:border-0 hover:bg-secondary transition-colors group"
                >
                  <TickerLogo symbol={etf.symbol} label={etf.name} size={28} />
                  <div className="min-w-0 self-center">
                    <div className="font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {etf.symbol.replace(/\.(KS|KQ)$/, "")}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{etf.name}</div>
                  </div>
                  <div className="text-right self-center">
                    {stats && stats.dividendYield > 0 ? (
                      <>
                        <div className="figure text-lg leading-none text-foreground">
                          {stats.dividendYield.toFixed(2)}<span className="text-xs">%</span>
                        </div>
                        {stats.expenseRatio > 0 && (
                          <div className="eyebrow mt-1">보수 {stats.expenseRatio.toFixed(2)}%</div>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="rule-double pt-3 mb-4">
            <span className="eyebrow">배당 투자 가이드</span>
            </div>
          
          <div className="bg-card border border-border">
            {[
              { href: "/blog/etf-beginners-guide", tag: "입문", title: "배당 ETF 완벽 가이드", desc: "배당 ETF란 무엇인지, 왜 투자하는지 기본부터." },
              { href: "/blog/schd-vs-jepi", tag: "비교", title: "SCHD vs JEPI", desc: "배당은 2배인데 총수익은 더 낮았던 이유." },
              { href: "/blog/dividend-reinvestment", tag: "전략", title: "배당금 재투자의 힘", desc: "받은 배당을 다시 넣으면 얼마나 달라지는지." },
            ].map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="ledger-row grid-cols-[3.5rem_1fr] border-b border-border last:border-0 hover:bg-secondary transition-colors group"
              >
                <span className="eyebrow self-center">{post.tag}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{post.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
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
                className="group bg-card border border-border p-5 [&_summary::-webkit-details-marker]:hidden"
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

    </main>
  )
}
