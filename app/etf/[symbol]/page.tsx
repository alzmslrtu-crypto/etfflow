import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"
import { EtfLiveStats } from "@/components/etf-live-stats"
import { ETF_DIRECTORY, getRelatedEtfs, resolveEtfInfo } from "@/lib/etf-directory"

const BASE_URL = "https://www.etfflow.kr"

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
  const info = resolveEtfInfo(decodeURIComponent(symbol))
  const title = `${info.name} 배당금·배당수익률·정보 | ETF Flow`
  const description = info.summary
  const url = `${BASE_URL}/etf/${encodeURIComponent(info.symbol)}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
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
          <EtfLiveStats symbol={info.symbol} />
        </section>

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
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
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
