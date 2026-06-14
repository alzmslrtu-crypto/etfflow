"use client"

import { useState, useEffect } from "react"
import { ArrowDownUp, Loader2 } from "lucide-react"

export function ExchangeCalculator() {
  const [rate, setRate] = useState(1380)
  const [loading, setLoading] = useState(true)
  // krw 기준 입력값, 방향
  const [krw, setKrw] = useState(1000000)
  const [usd, setUsd] = useState(1000000 / 1380)
  const [base, setBase] = useState<"KRW" | "USD">("KRW")

  useEffect(() => {
    let active = true
    fetch("/api/stock?exchangeRate=1")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d?.exchangeRate) {
          setRate(d.exchangeRate)
          setUsd(krw / d.exchangeRate)
        }
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onKrw = (v: number) => {
    setKrw(v)
    setUsd(rate > 0 ? v / rate : 0)
  }
  const onUsd = (v: number) => {
    setUsd(v)
    setKrw(v * rate)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        {/* 원화 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">원화 (KRW)</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={Math.round(krw).toLocaleString()}
              onChange={(e) => onKrw(parseFloat(e.target.value.replace(/[^0-9]/g, "")) || 0)}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-background text-lg font-bold tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ArrowDownUp className="w-4 h-4" />
          </div>
        </div>

        {/* 달러 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">미국 달러 (USD)</label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={usd.toFixed(2)}
              onChange={(e) => onUsd(parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0)}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-background text-lg font-bold tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">적용 환율</span>
        <span className="font-bold text-primary tabular-nums flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          1 USD = ₩{Math.round(rate).toLocaleString()}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        환율은 실시간(네이버 금융 기준)으로 불러옵니다. 실제 매매 시에는 증권사·은행의 환전 수수료와 스프레드가 추가되어 차이가 날 수 있습니다.
      </p>
    </div>
  )
}
