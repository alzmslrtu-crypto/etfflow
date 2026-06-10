"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function won(v: number): string {
  if (!isFinite(v)) return "-"
  if (v >= 1e8) return `${(v / 1e8).toFixed(1)}억원`
  if (v >= 1e4) return `${Math.round(v / 1e4).toLocaleString()}만원`
  return `${Math.round(v).toLocaleString()}원`
}

type NumFieldProps = {
  label: string
  value: number
  onChange: (v: number) => void
  suffix?: string
  step?: number
}

function NumField({ label, value, onChange, suffix }: NumFieldProps) {
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
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  )
}

export function DripSimulator() {
  const [initial, setInitial] = useState(10000000)
  const [monthly, setMonthly] = useState(500000)
  const [dividendYield, setDividendYield] = useState(4)
  const [priceGrowth, setPriceGrowth] = useState(5)
  const [years, setYears] = useState(20)

  // 연도별 복리 시뮬레이션 (배당 재투자 가정)
  const data: { year: number; 자산: number; 납입원금: number }[] = [
    { year: 0, 자산: initial, 납입원금: initial },
  ]
  let balance = initial
  let invested = initial
  const yrs = Math.min(Math.max(Math.round(years), 1), 50)
  for (let y = 1; y <= yrs; y++) {
    invested += monthly * 12
    balance += monthly * 12
    const dividend = balance * (dividendYield / 100)
    balance = balance * (1 + priceGrowth / 100) + dividend
    data.push({ year: y, 자산: Math.round(balance), 납입원금: Math.round(invested) })
  }

  const finalBalance = balance
  const totalInvested = invested
  const profit = finalBalance - totalInvested
  const finalAnnualDividend = finalBalance * (dividendYield / 100)

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="rounded-2xl border border-border bg-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumField label="초기 투자금" value={initial} onChange={setInitial} suffix="원" />
        <NumField label="매월 추가 투자" value={monthly} onChange={setMonthly} suffix="원" />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            연 배당수익률 <span className="text-primary font-bold">{dividendYield}%</span>
          </label>
          <input type="range" min={0} max={15} step={0.5} value={dividendYield}
            onChange={(e) => setDividendYield(parseFloat(e.target.value))} className="w-full accent-primary mt-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            연 주가 성장률 <span className="text-primary font-bold">{priceGrowth}%</span>
          </label>
          <input type="range" min={0} max={15} step={0.5} value={priceGrowth}
            onChange={(e) => setPriceGrowth(parseFloat(e.target.value))} className="w-full accent-primary mt-3" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            투자 기간 <span className="text-primary font-bold">{yrs}년</span>
          </label>
          <input type="range" min={1} max={40} step={1} value={years}
            onChange={(e) => setYears(parseInt(e.target.value))} className="w-full accent-primary" />
        </div>
      </div>

      {/* 결과 요약 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ResultCard label={`${yrs}년 후 자산`} value={won(finalBalance)} accent />
        <ResultCard label="총 납입 원금" value={won(totalInvested)} />
        <ResultCard label="평가 수익" value={won(profit)} />
        <ResultCard label={`${yrs}년차 연 배당금`} value={won(finalAnnualDividend)} />
      </div>

      {/* 차트 */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-sm font-semibold text-foreground mb-4">자산 성장 추이 (배당 재투자)</div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false}
                axisLine={{ stroke: "var(--border)" }} tickFormatter={(v) => `${v}년`} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={52}
                tickFormatter={(v) => (v >= 1e8 ? `${(v / 1e8).toFixed(0)}억` : `${Math.round(v / 1e4).toLocaleString()}만`)} />
              <Tooltip
                formatter={(v: number, name) => [won(v), name as string]}
                labelFormatter={(l) => `${l}년차`}
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="자산" stroke="var(--primary)" strokeWidth={2} fill="url(#balGrad)" />
              <Area type="monotone" dataKey="납입원금" stroke="var(--muted-foreground)" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        배당을 전액 재투자(DRIP)하고 매년 일정 수익률이 유지된다고 가정한 단순 모델입니다. 세금·환율·수익률 변동은 반영하지 않았으며 실제 결과와 다를 수 있습니다.
      </p>
    </div>
  )
}

function ResultCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? "bg-primary/5 border-primary/20" : "bg-secondary/30 border-border"}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-base sm:text-lg font-bold tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  )
}
