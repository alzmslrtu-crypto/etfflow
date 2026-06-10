"use client"

import { useState, useEffect } from "react"
import { Loader2, TrendingUp, TrendingDown } from "lucide-react"

type StockData = {
  symbol: string
  currency: string
  currentPrice: number
  priceChangePercent: number
  dividendYield: number
  annualDividend: number
  dividendPaymentMonths: number[]
  yearlyDividendCount: number
  expenseRatio: number
  netAssets: number
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

const CYCLE: Record<number, string> = { 12: "매월", 4: "분기", 2: "반기", 1: "연 1회" }

async function fetchOne(symbol: string): Promise<StockData | null> {
  try {
    const res = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}&period=1Y`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export function CompareLive({ symbolA, symbolB }: { symbolA: string; symbolB: string }) {
  const [a, setA] = useState<StockData | null>(null)
  const [b, setB] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([fetchOne(symbolA), fetchOne(symbolB)]).then(([da, db]) => {
      if (!active) return
      setA(da)
      setB(db)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [symbolA, symbolB])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const ca = symbolA.replace(/\.(KS|KQ)$/, "")
  const cb = symbolB.replace(/\.(KS|KQ)$/, "")

  const rows: { label: string; a: React.ReactNode; b: React.ReactNode }[] = [
    {
      label: "현재가",
      a: a ? money(a.currentPrice, a.currency) : "-",
      b: b ? money(b.currentPrice, b.currency) : "-",
    },
    {
      label: "등락률",
      a: a ? <Change v={a.priceChangePercent} /> : "-",
      b: b ? <Change v={b.priceChangePercent} /> : "-",
    },
    {
      label: "배당수익률",
      a: a && a.dividendYield > 0 ? `${a.dividendYield.toFixed(2)}%` : "-",
      b: b && b.dividendYield > 0 ? `${b.dividendYield.toFixed(2)}%` : "-",
    },
    {
      label: "1주당 연 배당금",
      a: a ? money(a.annualDividend, a.currency) : "-",
      b: b ? money(b.annualDividend, b.currency) : "-",
    },
    {
      label: "배당 주기",
      a: a ? CYCLE[a.yearlyDividendCount] || (a.yearlyDividendCount > 0 ? `연 ${a.yearlyDividendCount}회` : "-") : "-",
      b: b ? CYCLE[b.yearlyDividendCount] || (b.yearlyDividendCount > 0 ? `연 ${b.yearlyDividendCount}회` : "-") : "-",
    },
    {
      label: "운용보수",
      a: a && a.expenseRatio > 0 ? `${a.expenseRatio.toFixed(2)}%` : "-",
      b: b && b.expenseRatio > 0 ? `${b.expenseRatio.toFixed(2)}%` : "-",
    },
    {
      label: "순자산",
      a: a ? assets(a.netAssets, a.currency) : "-",
      b: b ? assets(b.netAssets, b.currency) : "-",
    },
  ]

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[120px]">지표</th>
            <th className="p-4 text-center font-bold text-foreground">{ca}</th>
            <th className="p-4 text-center font-bold text-foreground">{cb}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={`border-t border-border ${i % 2 === 1 ? "bg-secondary/20" : ""}`}>
              <td className="p-4 text-xs font-medium text-muted-foreground whitespace-nowrap">{row.label}</td>
              <td className="p-4 text-center font-semibold text-foreground tabular-nums">{row.a}</td>
              <td className="p-4 text-center font-semibold text-foreground tabular-nums">{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Change({ v }: { v: number }) {
  const pos = v >= 0
  return (
    <span className={`inline-flex items-center justify-center gap-1 ${pos ? "text-stock-up" : "text-stock-down"}`}>
      {pos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {pos ? "+" : ""}{v.toFixed(2)}%
    </span>
  )
}
