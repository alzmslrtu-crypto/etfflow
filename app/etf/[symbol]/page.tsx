import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"
import { EtfLiveStats } from "@/components/etf-live-stats"
import { ETF_DIRECTORY, getEtfInfo, getRelatedEtfs, resolveEtfInfo } from "@/lib/etf-directory"
import { getEtfQuote, type EtfQuote } from "@/lib/etf-quote"
import { getDividendSafety } from "@/lib/dividend-safety"

const BASE_URL = "https://www.etfflow.kr"

// 시세·배당 데이터를 1시간마다 갱신 (ISR)
export const revalidate = 3600

// 디렉터리에 있는 종목들은 미리 정적 생성 (SEO/색인)
export function generateStaticParams() {
  return ETF_DIRECTORY.map((e) => ({ symbol: e.symbol }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>
}): Promise<Metadata> {
  const { symbol } = await params
  const decoded = decodeURIComponent(symbol)
  const info = resolveEtfInfo(decoded)
  const title = `${info.name} 배당금·배당수익률·정보 | ETF Flow`
  const description = info.summary
  const url = `${BASE_URL}/etf/${encodeURIComponent(info.symbol)}`

  // 이 라우트는 임의의 티커를 다 받는다(dynamicParams). 디렉터리에 없는 종목은
  // 설명이 비어 있어 숫자만 있는 얇은 페이지가 되므로 색인에서 뺀다.
  // 색인시키면 무한한 자동 생성 페이지가 되어 scaled content로 평가된다.
  const isCurated = Boolean(getEtfInfo(decoded))

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    // 디렉터리 종목은 실시간 지표를 서버 렌더해 고유 데이터가 있으므로 색인 허용.
    // (compare/glossary 개별 페이지는 아직 얇아서 noindex 유지)
    robots: isCurated ? undefined : { index: false, follow: true },
  }
}

export default async function EtfDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>
}) {
  const { symbol: rawSymbol } = await params
  const symbol = decodeURIComponent(rawSymbol)
  const info = resolveEtfInfo(symbol)
  const related = getRelatedEtfs(symbol)
  const isKR = info.region === "KR"

  // 시세·배당 지표를 서버에서 미리 받아 첫 HTML에 포함시킨다.
  // 실패해도 페이지는 살아야 하므로 클라이언트 fetch로 폴백한다.
  let quote: EtfQuote | undefined
  try {
    quote = await getEtfQuote(info.symbol, "5Y")
  } catch {
    quote = undefined
  }

  // 배당수익률 바로 다음에 "그 배당이 유지됐나"를 보여준다.
  // 수익률 숫자 하나만으로는 좋은 신호인지 나쁜 신호인지 구분되지 않는다.
  const safety = await getDividendSafety(info.symbol)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/#compare" className="hover:text-primary transition-colors">ETF 비교</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{info.symbol.replace(/\.(KS|KQ)$/, "")}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <TickerLogo symbol={info.symbol} label={info.name} size={56} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{info.name}</h1>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${isKR ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
              >
                {isKR ? "🇰🇷 한국 상장" : "🇺🇸 미국 상장"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {info.symbol.replace(/\.(KS|KQ)$/, "")} · {info.category}
              {info.issuer !== "-" && ` · ${info.issuer}`}
            </div>
          </div>
        </div>

        {/* 요약 */}
        <p className="text-base text-foreground/90 leading-relaxed mb-8">{info.summary}</p>

        {/* 실시간 지표 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-4">실시간 시세 · 배당 정보</h2>
          <EtfLiveStats symbol={info.symbol} initialData={quote} />
        </section>

        {/* 배당 지속성 — 실지급 이력으로 계산 */}
        {safety?.sufficient && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-1">배당을 계속 줬을까</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {safety.from}~{safety.to}년 실제로 지급된 배당만 놓고 계산한 값입니다.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">배당 성장률</div>
                <div
                  className={`text-xl font-bold tabular-nums ${
                    safety.cagr === null ? "text-muted-foreground" : safety.cagr >= 0 ? "text-stock-up" : "text-stock-down"
                  }`}
                >
                  {safety.cagr === null ? "—" : `${safety.cagr >= 0 ? "+" : ""}${safety.cagr.toFixed(1)}%`}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">연평균</div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">배당 삭감</div>
                <div className={`text-xl font-bold tabular-nums ${safety.cutCount === 0 ? "text-stock-up" : "text-stock-down"}`}>
                  {safety.cutCount === 0 ? "없음" : `${safety.cutCount}회`}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {safety.cutCount === 0 ? "한 해도 줄지 않음" : `최대 −${safety.worstCut.toFixed(0)}%`}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">주가 변동</div>
                <div className={`text-xl font-bold tabular-nums ${safety.priceReturn >= 0 ? "text-stock-up" : "text-stock-down"}`}>
                  {safety.priceReturn >= 0 ? "+" : ""}{safety.priceReturn.toFixed(1)}%
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">기간 전체</div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">받은 배당 + 주가</div>
                <div className={`text-xl font-bold tabular-nums ${safety.totalReturn >= 0 ? "text-stock-up" : "text-stock-down"}`}>
                  {safety.totalReturn >= 0 ? "+" : ""}{safety.totalReturn.toFixed(1)}%
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">배당 {safety.dividendReturn.toFixed(1)}% 포함</div>
              </div>
            </div>

            {/* 연도별 실지급 배당 — 통장 내역처럼 */}
            <div className="rounded-xl border border-border bg-card overflow-hidden mb-3">
              {safety.years.map((y, i) => {
                const prev = i > 0 ? safety.years[i - 1].total : null
                const change = prev && prev > 0 ? ((y.total - prev) / prev) * 100 : null
                return (
                  <div
                    key={y.year}
                    className="flex items-baseline justify-between gap-4 px-4 py-2.5 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-muted-foreground tabular-nums">{y.year}</span>
                    <span className="flex-1 border-b border-dotted border-border/70" />
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {y.total.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      <span className="text-xs text-muted-foreground ml-1">{isKR ? "원" : "달러"}</span>
                    </span>
                    <span
                      className={`text-xs tabular-nums w-16 text-right ${
                        change === null ? "text-muted-foreground" : change >= 0 ? "text-stock-up" : "text-stock-down"
                      }`}
                    >
                      {change === null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`}
                    </span>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              1주당 연간 배당 합계입니다. 올해는 배당이 아직 다 지급되지 않아 제외했습니다.
              세전·환율 미반영이며 배당 재투자는 가정하지 않았습니다.{" "}
              <Link href="/dividend-safety" className="text-primary hover:underline">
                다른 ETF와 비교
              </Link>
            </p>
          </section>
        )}

        {/* 상세 설명 */}
        {info.description && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-3">{info.name} 알아보기</h2>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed whitespace-pre-line">
              {info.description}
            </p>
          </section>
        )}

        {/* 비교 CTA */}
        <Link
          href="/#compare"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all mb-12"
        >
          다른 ETF와 비교하기
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* 관련 ETF */}
        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4">함께 보면 좋은 ETF</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((e) => (
                <Link
                  key={e.symbol}
                  href={`/etf/${encodeURIComponent(e.symbol)}`}
                  className="flex items-center gap-3 p-4 rounded-2xl shadow-sm bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <TickerLogo symbol={e.symbol} label={e.name} size={36} />
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground truncate">{e.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{e.category}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 면책 */}
        <div className="rounded-lg bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed mb-8">
          본 페이지의 정보는 교육 및 정보 제공 목적이며 투자 권유가 아닙니다. 시세·배당 데이터는 Yahoo Finance·네이버 금융 기준으로 지연되거나 실제와 차이가 있을 수 있습니다. 모든 투자 결정과 책임은 본인에게 있습니다.
        </div>

        <Link href="/#compare" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          ETF 비교로 돌아가기
        </Link>
      </div>
    </main>
  )
}
