"use client"

import { useState } from "react"

function won(v: number): string {
  return `${Math.round(v).toLocaleString()}원`
}

export function TaxCalculator() {
  const [annualDividend, setAnnualDividend] = useState(5000000)
  const [market, setMarket] = useState<"KR" | "US">("KR")

  const rate = market === "KR" ? 0.154 : 0.15
  const tax = annualDividend * rate
  const afterTax = annualDividend - tax
  const overThreshold = annualDividend > 20000000

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">연간 배당금 (세전)</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={annualDividend.toLocaleString()}
              onChange={(e) => setAnnualDividend(parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0)}
              className="w-full h-12 px-4 pr-10 rounded-xl border border-border bg-background text-lg font-bold tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">원</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[1000000, 5000000, 10000000, 20000000].map((v) => (
              <button
                key={v}
                onClick={() => setAnnualDividend(v)}
                className="flex-1 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {v >= 1e8 ? `${v / 1e8}억` : `${v / 1e4}만`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">상장 구분</label>
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            <button
              onClick={() => setMarket("KR")}
              className={`flex-1 h-9 rounded-md text-sm font-medium transition-colors ${market === "KR" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              국내 상장 (15.4%)
            </button>
            <button
              onClick={() => setMarket("US")}
              className={`flex-1 h-9 rounded-md text-sm font-medium transition-colors ${market === "US" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              미국 상장 (15%)
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <span className="text-sm text-muted-foreground">세전 배당금</span>
          <span className="font-semibold text-foreground tabular-nums">{won(annualDividend)}</span>
        </div>
        <div className="flex justify-between items-center p-4 border-b border-border">
          <span className="text-sm text-muted-foreground">배당소득세 ({(rate * 100).toFixed(1)}%)</span>
          <span className="font-semibold text-stock-down tabular-nums">- {won(tax)}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-primary/5">
          <span className="text-sm font-medium text-foreground">세후 실수령액</span>
          <span className="text-xl font-bold text-primary tabular-nums">{won(afterTax)}</span>
        </div>
      </div>

      {overThreshold && (
        <div className="rounded-xl border border-stock-down/30 bg-stock-down/5 p-4">
          <p className="text-sm text-foreground leading-relaxed">
            <strong className="text-stock-down">⚠️ 금융소득종합과세 주의</strong><br />
            연 금융소득(이자+배당)이 2,000만원을 초과하면, 초과분이 다른 소득과 합산되어 누진세율로 종합과세될 수 있습니다.
            이 경우 실제 세 부담은 위 계산보다 커질 수 있으니 절세 계좌(연금·ISA) 활용을 검토하세요.
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        개략 계산입니다. 국내 상장 ETF·국내 주식 배당은 15.4%(배당소득세 14% + 지방소득세 1.4%), 미국 상장 ETF는 현지 원천징수 15% 기준입니다.
        실제 세금은 계좌 종류·총 금융소득·환율 등에 따라 달라지며 투자·세무 자문이 아닙니다.
      </p>
    </div>
  )
}
