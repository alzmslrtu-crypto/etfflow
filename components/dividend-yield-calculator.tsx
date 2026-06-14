"use client"

import { useState } from "react"

function won(v: number): string {
  if (!isFinite(v) || v <= 0) return "-"
  if (v >= 1e8) return `${(v / 1e8).toFixed(1)}억원`
  if (v >= 1e4) return `${Math.round(v / 1e4).toLocaleString()}만원`
  return `${Math.round(v).toLocaleString()}원`
}

export function DividendYieldCalculator() {
  const [price, setPrice] = useState(15000)
  const [dividendPerShare, setDividendPerShare] = useState(450)
  const [shares, setShares] = useState(100)

  const yieldPercent = price > 0 ? (dividendPerShare / price) * 100 : 0
  const annualDividend = dividendPerShare * shares
  const invested = price * shares

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <Field label="현재 주가 (1주)" value={price} onChange={setPrice} suffix="원" />
        <Field label="1주당 연간 배당금" value={dividendPerShare} onChange={setDividendPerShare} suffix="원" />
        <Field label="보유(예정) 주수" value={shares} onChange={setShares} suffix="주" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Result label="배당수익률" value={yieldPercent > 0 ? `${yieldPercent.toFixed(2)}%` : "-"} accent />
        <Result label="연 배당금 총액" value={won(annualDividend)} />
        <Result label="투자 금액" value={won(invested)} />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        배당수익률 = (1주당 연간 배당금 ÷ 현재 주가) × 100. 세전 기준이며, 실제 수령액은 배당소득세(국내 15.4%·미국 15%)가 차감됩니다.
        세후 금액은 <a href="/tools/tax" className="text-primary hover:underline">배당소득세 계산기</a>에서 확인하세요.
      </p>
    </div>
  )
}

function Field({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value.toLocaleString()}
          onChange={(e) => onChange(parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0)}
          className="w-full h-11 px-3 pr-10 rounded-xl border border-border bg-background font-semibold tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>
      </div>
    </div>
  )
}

function Result({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? "bg-primary/5 border-primary/20" : "bg-secondary/30 border-border"}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-lg font-bold tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  )
}
