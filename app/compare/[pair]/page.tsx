import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"
import { CompareLive } from "@/components/compare-live"
import { COMPARE_PAIRS, pairSlug, parsePairSlug, resolveEtfInfo } from "@/lib/etf-directory"

const BASE_URL = "https://www.etfflow.kr"

export function generateStaticParams() {
  return COMPARE_PAIRS.map(([a, b]) => ({ pair: pairSlug(a, b) }))
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
  const title = `${ca} vs ${cb} 비교 — 배당수익률·운용보수·배당월 | ETF Flow`
  const description = `${a.name}과 ${b.name}의 배당수익률, 1주당 배당금, 운용보수, 순자산, 배당 주기를 실시간으로 비교합니다.`
  const url = `${BASE_URL}/compare/${pairSlug(a.symbol, b.symbol)}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    // 자동 생성 비교 페이지는 색인에서 제외(scaled content 감점 방지), 링크는 따라가도록 follow
    robots: { index: false, follow: true },
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
