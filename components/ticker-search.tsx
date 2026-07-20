'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { TickerLogo } from '@/components/ticker-logo'

type Result = {
  symbol: string
  name: string
  exchange: string
  region: 'KR' | 'US'
}

// 검색어 없이 열었을 때 보여줄 자주 찾는 종목
const SUGGESTED = ['SCHD', 'JEPI', '458730.KS', 'O', 'QQQ', 'MO']

/**
 * 종목 상세로 보내는 검색창. 홈 첫 화면의 주인공이다.
 * 비교 도구 안의 검색(종목 추가)은 차트에 선을 더하는 용도라 목적이 다르다.
 */
export function TickerSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([])
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/stock/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(Array.isArray(data.results) ? data.results.slice(0, 8) : [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const go = (symbol: string) => router.push(`/etf/${encodeURIComponent(symbol)}`)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (c + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (c - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[cursor].symbol)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative" ref={boxRef}>
      <label htmlFor="ticker-search" className="block text-sm text-muted-foreground mb-2">
        종목 검색
      </label>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          id="ticker-search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setCursor(0)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="SCHD, TIGER 미국배당, 삼성전자"
          autoComplete="off"
          className="w-full h-14 pl-12 pr-4 text-lg bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {open && (query.length > 0 || results.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-5 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : results.length > 0 ? (
            <div className="ledger">
              {results.map((r, i) => (
                <button
                  key={r.symbol}
                  onClick={() => go(r.symbol)}
                  onMouseEnter={() => setCursor(i)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                    i === cursor ? 'bg-secondary' : 'hover:bg-secondary/60'
                  }`}
                >
                  <TickerLogo symbol={r.symbol} label={r.name} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground truncate tabular-nums">
                      {r.symbol.replace(/\.(KS|KQ)$/, '')} · {r.exchange}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {r.region === 'KR' ? '한국' : '미국'}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-5 text-sm text-muted-foreground text-center">
              찾는 종목이 없습니다. 티커나 종목명을 다시 입력해 보세요.
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">자주 찾는 종목</span>
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => go(s)}
            className="text-xs px-2 py-1 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors tabular-nums"
          >
            {s.replace(/\.(KS|KQ)$/, '')}
          </button>
        ))}
      </div>
    </div>
  )
}
