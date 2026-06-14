import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"
import { ETF_DIRECTORY, type EtfInfo } from "@/lib/etf-directory"

export const metadata: Metadata = {
  title: "배당 ETF 모음·추천 리스트 | ETF Flow",
  description:
    "월배당 ETF, 미국 배당성장 ETF, 고배당 ETF, 한국 상장 배당 ETF를 종류별로 모았습니다. 각 종목의 실시간 배당수익률·배당월·운용보수를 확인하세요.",
  alternates: { canonical: "https://www.etfflow.kr/etf" },
}

type Group = { title: string; desc: string; filter: (e: EtfInfo) => boolean }

const GROUPS: Group[] = [
  {
    title: "월배당 ETF",
    desc: "매월 분배금을 지급하는 ETF — 매달 현금흐름을 원하는 투자자에게 인기",
    filter: (e) => e.dividendCycle === "월",
  },
  {
    title: "미국 배당성장 ETF",
    desc: "배당을 꾸준히 늘려온 미국 우량 기업에 투자 (SCHD 계열 등)",
    filter: (e) => e.category.includes("배당성장"),
  },
  {
    title: "미국 고배당 ETF",
    desc: "평균보다 높은 배당수익률을 추구하는 ETF",
    filter: (e) => e.category.includes("고배당"),
  },
  {
    title: "커버드콜 ETF",
    desc: "옵션 전략으로 높은 분배율을 노리는 ETF (변동성 유의)",
    filter: (e) => e.category.includes("커버드콜"),
  },
  {
    title: "한국 상장 ETF",
    desc: "환전 없이 원화로 투자 — 연금·ISA 계좌 활용 가능",
    filter: (e) => e.region === "KR",
  },
  {
    title: "대표 지수 ETF",
    desc: "S&P 500·나스닥 100·코스피 등 시장 전체에 투자하는 코어 자산",
    filter: (e) => /지수|S&P|나스닥|200/.test(e.category),
  },
]

function EtfCard({ etf }: { etf: EtfInfo }) {
  return (
    <Link
      href={`/etf/${encodeURIComponent(etf.symbol)}`}
      className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <TickerLogo symbol={etf.symbol} label={etf.name} size={40} />
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-foreground truncate">{etf.name}</div>
        <div className="text-xs text-muted-foreground truncate">
          {etf.dividendCycle !== "비정기" ? `${etf.dividendCycle} 배당 · ` : ""}{etf.issuer}
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </Link>
  )
}

export default function EtfIndexPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <span className="text-foreground font-medium">ETF 모음</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">배당 ETF 모음</h1>
        <p className="text-base text-muted-foreground mb-5 max-w-2xl">
          유형별로 정리한 인기 배당 ETF입니다. 종목을 누르면 실시간 가격·배당수익률·배당월·운용보수를 확인하고, 비교 도구에 바로 담을 수 있습니다.
        </p>
        <Link
          href="/etf/screener"
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-10 bg-card border border-border rounded-full font-semibold text-sm text-foreground hover:border-primary/50 transition-all"
        >
          🔍 ETF 파인더 — 조건별로 찾기
          <ArrowRight className="w-4 h-4 text-primary" />
        </Link>

        <div className="space-y-12">
          {GROUPS.map((group) => {
            const items = ETF_DIRECTORY.filter(group.filter)
            if (items.length === 0) return null
            return (
              <section key={group.title}>
                <h2 className="text-xl font-bold text-foreground mb-1">{group.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{group.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((etf) => (
                    <EtfCard key={etf.symbol} etf={etf} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-12">
          <Link
            href="/#compare"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            여러 ETF 한눈에 비교하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
