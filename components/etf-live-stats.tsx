"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Loader2, Plus, Check, TrendingUp, TrendingDown } from "lucide-react"

const STORAGE_KEY = "etf-comparison-symbols"

type StockData = {
  symbol: string
  name: string
  currency: string
  currentPrice: number
  previousClose: number
  priceChange: number
  priceChangePercent: number
  dividendYield: number
  dividendPerShare: number
  annualDividend: number
  dividendPaymentMonths: number[]
  yearlyDividendCount: number
  dividendHistory: { date: string; amount: number }[]
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  netAssets: number
  expenseRatio: number
  exDividendDate: string | null
}

function money(v: number, currency: string): string {
  if (!v) return "-"
  return currency === "KRW" ? `₩${Math.round(v).toLocaleString()}` : `$${v.toFixed(2)}`
}

function assets(v: number, currency: string): string {
  if (!v) return "-"
  if (currency === "KRW") {
    if (v >= 1e12) return `${(v / 1e12).toFixed(1)}조원`
    if (v >= 1e8) return `${Math.round(v / 1e8).toLocaleString()}억원`
    return `₩${Math.round(v).toLocaleString()}`
  }
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
  return `$${Math.round(v).toLocaleString()}`
}

const CYCLE_LABEL: Record<number, string> = { 12: "매월", 4: "분기", 2: "반기", 1: "연 1회" }

export function EtfLiveStats({ symbol }: { symbol: string }) {
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}&period=5Y`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((d: StockData) => {
        if (active) setData(d)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [symbol])

  // 비교 도구에 종목 추가 후 홈으로 이동
  const addToCompare = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const list: string[] = raw ? JSON.parse(raw) : []
      if (!list.includes(symbol) && list.length < 5) {
        list.push(symbol)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
      }
      setAdded(true)
    } catch {
      // ignore
    }
    window.location.href = "/#compare"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
        실시간 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </div>
    )
  }

  const isPositive = data.priceChangePercent >= 0

  // 연도별 배당금 합계 (최근 5년)
  const yearlyMap: Record<string, number> = {}
  data.dividendHistory?.forEach((d) => {
    const year = d.date.substring(0, 4)
    yearlyMap[year] = (yearlyMap[year] || 0) + d.amount
  })
  const yearlyDividends = Object.entries(yearlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, amount]) => ({ year, amount: Math.round(amount * 100) / 100 }))

  const cycleLabel = CYCLE_LABEL[data.yearlyDividendCount] || (data.yearlyDividendCount > 0 ? `연 ${data.yearlyDividendCount}회` : "-")

  const stats: { label: string; value: string; highlight?: boolean }[] = [
    { label: "현재가", value: money(data.currentPrice, data.currency) },
    { label: "배당수익률", value: data.dividendYield > 0 ? `${data.dividendYield.toFixed(2)}%` : "-", highlight: true },
    { label: "1주당 연 배당금", value: money(data.annualDividend, data.currency) },
    { label: "배당 주기", value: cycleLabel },
    { label: "운용보수", value: data.expenseRatio > 0 ? `${data.expenseRatio.toFixed(2)}%` : "-" },
    { label: "순자산", value: assets(data.netAssets, data.currency) },
    { label: "52주 최고", value: money(data.fiftyTwoWeekHigh, data.currency) },
    { label: "52주 최저", value: money(data.fiftyTwoWeekLow, data.currency) },
  ]

  return (
    <div className="space-y-6">
      {/* 현재가 + 등락 + 비교 추가 */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-3xl font-bold text-foreground tabular-nums">
            {money(data.currentPrice, data.currency)}
          </div>
          <div className={`flex items-center gap-1 text-sm font-semibold tabular-nums mt-1 ${isPositive ? "text-stock-up" : "text-stock-down"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {isPositive ? "+" : ""}{money(data.priceChange, data.currency)} ({isPositive ? "+" : ""}{data.priceChangePercent.toFixed(2)}%)
          </div>
        </div>
        <button
          onClick={addToCompare}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          비교에 추가
        </button>
      </div>

      {/* 핵심 지표 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 sm:p-4">
            <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
            <div className={`text-base font-bold tabular-nums ${s.highlight ? "text-primary" : "text-foreground"}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* 배당 지급월 */}
      {data.dividendPaymentMonths?.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-semibold text-foreground mb-3">배당 지급월</div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const on = data.dividendPaymentMonths.includes(m)
              return (
                <span
                  key={m}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${on ? "bg-primary/10 text-primary" : "bg-muted/40 text-muted-foreground/50"}`}
                >
                  {m}월
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* 연도별 배당금 차트 */}
      {yearlyDividends.length > 1 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-semibold text-foreground mb-4">연도별 1주당 배당금 추이</div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyDividends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={48}
                  tickFormatter={(v) => (data.currency === "KRW" ? `₩${Math.round(v).toLocaleString()}` : `$${v}`)} />
                <Tooltip
                  formatter={(v: number) => [money(v, data.currency), "배당금"]}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
