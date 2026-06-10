"use client"

import { useState } from "react"

const YIELD_PRESETS = [
  { label: "안정형 3%", value: 3 },
  { label: "균형형 4%", value: 4 },
  { label: "고배당 7%", value: 7 },
  { label: "커버드콜 10%", value: 10 },
]

function won(v: number): string {
  if (!isFinite(v) || v <= 0) return "-"
  if (v >= 1e8) return `${(v / 1e8).toFixed(1)}억원`
  if (v >= 1e4) return `${Math.round(v / 1e4).toLocaleString()}만원`
  return `${Math.round(v).toLocaleString()}원`
}

export function DividendGoalCalculator() {
  const [monthlyGoal, setMonthlyGoal] = useState(1000000)
  const [dividendYield, setDividendYield] = useState(4)

  const annualGoal = monthlyGoal * 12
  const requiredInvestment = dividendYield > 0 ? annualGoal / (dividendYield / 100) : 0

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">목표 월 배당금</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={monthlyGoal.toLocaleString()}
              onChange={(e) => setMonthlyGoal(parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0)}
              className="w-full h-12 px-4 pr-10 rounded-xl border border-border bg-background text-lg font-bold tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">원</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[500000, 1000000, 2000000, 3000000].map((v) => (
              <button
                key={v}
                onClick={() => setMonthlyGoal(v)}
                className="flex-1 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {won(v)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            예상 배당수익률 <span className="text-primary font-bold">{dividendYield}%</span>
          </label>
          <input
            type="range"
            min={1}
            max={15}
            step={0.5}
            value={dividendYield}
            onChange={(e) => setDividendYield(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {YIELD_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setDividendYield(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  dividendYield === p.value ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <div className="text-sm text-muted-foreground mb-2">필요한 총 투자금</div>
        <div className="text-4xl font-bold text-primary tabular-nums mb-1">{won(requiredInvestment)}</div>
        <div className="text-sm text-muted-foreground">
          연 {won(annualGoal)} 배당을 받으려면 배당수익률 {dividendYield}% 기준 약 {requiredInvestment > 0 ? `₩${Math.round(requiredInvestment).toLocaleString()}` : "-"} 필요
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        세전 기준 개략 계산입니다. 실제로는 배당소득세(국내 15.4%·미국 15%), 환율, 배당 변동 등에 따라 달라집니다. 종목별 실제 배당수익률은 ETF 상세 페이지에서 확인하세요.
      </p>
    </div>
  )
}
