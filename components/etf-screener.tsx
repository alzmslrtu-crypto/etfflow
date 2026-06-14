"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, Loader2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"

type EtfItem = {
  symbol: string
  code: string
  name: string
  price: number
  changeRate: number
  return3m: number // 국내
  return1y: number // 미국
  marketSum: number // 국내(억원)
  category: string
  listing: "KR" | "US"
}

type Sort = "marketSum" | "return" | "changeRate" | "name"

const CATEGORIES = ["전체", "미국 상장", "국내 시장지수", "국내 업종·테마", "국내 파생", "해외 주식", "원자재", "채권", "기타·혼합"]
const SORTS: { key: Sort; label: string }[] = [
  { key: "marketSum", label: "시가총액순" },
  { key: "return", label: "수익률순" },
  { key: "changeRate", label: "등락률순" },
  { key: "name", label: "이름순" },
]
const PER_PAGE = 30

function aum(eok: number): string {
  if (eok >= 10000) return `${(eok / 10000).toFixed(1)}조원`
  if (eok >= 1) return `${Math.round(eok).toLocaleString()}억원`
  return "-"
}

export function EtfScreener() {
  const [krItems, setKrItems] = useState<EtfItem[]>([])
  const [usItems, setUsItems] = useState<EtfItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("전체")
  const [sort, setSort] = useState<Sort>("marketSum")
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true
    Promise.all([
      fetch("/api/etf/list").then((r) => (r.ok ? r.json() : { items: [] })).catch(() => ({ items: [] })),
      fetch("/api/etf/us-list").then((r) => (r.ok ? r.json() : { items: [] })).catch(() => ({ items: [] })),
    ])
      .then(([kr, us]) => {
        if (!active) return
        const krMapped: EtfItem[] = (kr.items || []).map((e: any) => ({
          symbol: e.symbol,
          code: e.code,
          name: e.name,
          price: e.price,
          changeRate: e.changeRate,
          return3m: e.return3m,
          return1y: 0,
          marketSum: e.marketSum,
          category: e.category,
          listing: "KR" as const,
        }))
        const usMapped: EtfItem[] = (us.items || []).map((e: any) => ({
          symbol: e.symbol,
          code: e.symbol,
          name: e.name,
          price: 0,
          changeRate: 0,
          return3m: 0,
          return1y: 0,
          marketSum: 0,
          category: "미국 상장",
          listing: "US" as const,
        }))
        setKrItems(krMapped)
        setUsItems(usMapped)
        if (krMapped.length === 0 && usMapped.length === 0) setError(true)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  useEffect(() => setPage(1), [query, category, sort])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const match = (e: EtfItem) => !q || `${e.code} ${e.name}`.toLowerCase().includes(q)

    let base: EtfItem[]
    if (category === "미국 상장") {
      base = usItems
    } else if (category === "전체") {
      base = q ? [...krItems, ...usItems] : krItems
    } else {
      base = krItems.filter((e) => e.category === category)
    }

    const list = base.filter(match)
    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "changeRate") return b.changeRate - a.changeRate
      if (sort === "return") {
        const ra = a.listing === "US" ? a.return1y : a.return3m
        const rb = b.listing === "US" ? b.return1y : b.return3m
        return rb - ra
      }
      return b.marketSum - a.marketSum
    })
    return list
  }, [krItems, usItems, query, category, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
        ETF 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ETF 검색 (예: KODEX 200, 반도체, SCHD, 미국배당)"
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <span className="text-xs font-semibold text-muted-foreground w-12 flex-shrink-0 pt-1.5">분류</span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground w-12 flex-shrink-0">정렬</span>
          <div className="flex flex-wrap gap-1.5">
            {SORTS.map((s) => (
              <Chip key={s.key} active={sort === s.key} onClick={() => setSort(s.key)}>{s.label}</Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        총 <span className="font-semibold text-foreground">{filtered.length.toLocaleString()}</span>개 ETF
        {totalPages > 1 && <span className="ml-1">· {page}/{totalPages} 페이지</span>}
      </div>

      <div className="space-y-2">
        {pageItems.map((e) => {
          const up = e.changeRate >= 0
          const isUS = e.listing === "US"
          const ret = isUS ? e.return1y : e.return3m
          return (
            <Link
              key={`${e.listing}-${e.symbol}`}
              href={`/etf/${encodeURIComponent(e.symbol)}`}
              className="flex items-center gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
            >
              <TickerLogo symbol={e.symbol} label={e.name} size={36} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground truncate">{e.name}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${isUS ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                    {isUS ? "🇺🇸" : "🇰🇷"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{e.code} · {e.category}</div>
              </div>
              {isUS ? (
                <div className="flex items-center gap-1 text-xs text-primary font-medium flex-shrink-0">
                  상세 보기 <ArrowRight className="h-3.5 w-3.5" />
                </div>
              ) : (
                <>
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-foreground tabular-nums text-sm">
                      ₩{e.price.toLocaleString()}
                    </div>
                    <div className={`text-xs font-medium tabular-nums flex items-center justify-end gap-0.5 ${up ? "text-stock-up" : "text-stock-down"}`}>
                      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {up ? "+" : ""}{e.changeRate.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block w-20">
                    <div className="text-[11px] text-muted-foreground">3개월</div>
                    <div className={`text-sm font-medium tabular-nums ${ret >= 0 ? "text-stock-up" : "text-stock-down"}`}>
                      {ret >= 0 ? "+" : ""}{ret.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 hidden md:block w-24">
                    <div className="text-[11px] text-muted-foreground">시가총액</div>
                    <div className="text-sm font-medium text-foreground tabular-nums">{aum(e.marketSum)}</div>
                  </div>
                </>
              )}
            </Link>
          )
        })}
        {pageItems.length === 0 && (
          <div className="text-center text-muted-foreground py-12">조건에 맞는 ETF가 없습니다.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-border text-sm text-foreground disabled:opacity-40 hover:bg-secondary/50 transition-colors"
          >
            이전
          </button>
          <span className="text-sm text-muted-foreground tabular-nums">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-border text-sm text-foreground disabled:opacity-40 hover:bg-secondary/50 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}
