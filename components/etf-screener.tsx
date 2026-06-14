"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, Loader2, TrendingUp, TrendingDown } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"

type EtfListItem = {
  symbol: string
  code: string
  name: string
  price: number
  changeRate: number
  return3m: number
  nav: number
  marketSum: number
  category: string
  tab: number
}

type Sort = "marketSum" | "return3m" | "changeRate" | "name"

const CATEGORIES = ["전체", "국내 시장지수", "국내 업종·테마", "국내 파생", "해외 주식", "원자재", "채권", "기타·혼합"]
const SORTS: { key: Sort; label: string }[] = [
  { key: "marketSum", label: "시가총액순" },
  { key: "return3m", label: "3개월 수익률순" },
  { key: "changeRate", label: "등락률순" },
  { key: "name", label: "이름순" },
]
const PER_PAGE = 30

// marketSum 단위는 억원 (예: 39010 = 3.9조). 조/억원으로 포맷
function aum(marketSumEok: number): string {
  if (marketSumEok >= 10000) return `${(marketSumEok / 10000).toFixed(1)}조원`
  if (marketSumEok >= 1) return `${Math.round(marketSumEok).toLocaleString()}억원`
  return "-"
}

export function EtfScreener() {
  const [items, setItems] = useState<EtfListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("전체")
  const [sort, setSort] = useState<Sort>("marketSum")
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true
    fetch("/api/etf/list")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (active) setItems(d.items || [])
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  // 필터 바뀌면 1페이지로
  useEffect(() => setPage(1), [query, category, sort])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = items.filter((e) => {
      if (category !== "전체" && e.category !== category) return false
      if (q && !(`${e.code} ${e.name}`.toLowerCase().includes(q))) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "return3m") return b.return3m - a.return3m
      if (sort === "changeRate") return b.changeRate - a.changeRate
      return b.marketSum - a.marketSum
    })
    return list
  }, [items, query, category, sort])

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
      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ETF 검색 (예: KODEX 200, 반도체, 미국배당)"
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* 필터 */}
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

      {/* 결과 수 */}
      <div className="text-sm text-muted-foreground">
        총 <span className="font-semibold text-foreground">{filtered.length.toLocaleString()}</span>개 ETF
        {totalPages > 1 && <span className="ml-1">· {page}/{totalPages} 페이지</span>}
      </div>

      {/* 목록 */}
      <div className="space-y-2">
        {pageItems.map((e) => {
          const up = e.changeRate >= 0
          return (
            <Link
              key={e.symbol}
              href={`/etf/${encodeURIComponent(e.symbol)}`}
              className="flex items-center gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
            >
              <TickerLogo symbol={e.symbol} label={e.name} size={36} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground truncate">{e.name}</div>
                <div className="text-xs text-muted-foreground">{e.code} · {e.category}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-foreground tabular-nums text-sm">
                  ₩{e.price.toLocaleString()}
                </div>
                <div className={`text-xs font-medium tabular-nums flex items-center justify-end gap-0.5 ${up ? "text-stock-up" : "text-stock-down"}`}>
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {up ? "+" : ""}{e.changeRate.toFixed(2)}%
                </div>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block w-24">
                <div className="text-[11px] text-muted-foreground">3개월</div>
                <div className={`text-sm font-medium tabular-nums ${e.return3m >= 0 ? "text-stock-up" : "text-stock-down"}`}>
                  {e.return3m >= 0 ? "+" : ""}{e.return3m.toFixed(1)}%
                </div>
              </div>
              <div className="text-right flex-shrink-0 hidden md:block w-24">
                <div className="text-[11px] text-muted-foreground">시가총액</div>
                <div className="text-sm font-medium text-foreground tabular-nums">{aum(e.marketSum)}</div>
              </div>
            </Link>
          )
        })}
        {pageItems.length === 0 && (
          <div className="text-center text-muted-foreground py-12">조건에 맞는 ETF가 없습니다.</div>
        )}
      </div>

      {/* 페이지네이션 */}
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
