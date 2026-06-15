"use client"

import { useState, useEffect, useCallback, useRef, type KeyboardEvent } from "react"
import { TickerLogo } from "@/components/ticker-logo"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Loader2, Plus, TrendingUp, TrendingDown } from "lucide-react"

const PERIODS = ["1M", "3M", "6M", "YTD", "1Y", "3Y", "5Y", "10Y", "MAX"]
const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"]
const STORAGE_KEY = "etf-comparison-symbols"

// 종목의 원래 통화 금액을 사용자가 선택한 표시 통화로 환산한다.
// nativeCurrency: 종목의 실제 통화 (USD / KRW), rate: 1달러당 원화
function convertCurrency(
  amount: number,
  nativeCurrency: string,
  displayCurrency: "KRW" | "USD",
  rate: number,
): number {
  const krw = nativeCurrency === "KRW" ? amount : amount * rate
  return displayCurrency === "KRW" ? krw : krw / rate
}

// 가격·배당금 등을 표시 통화 기호와 함께 포맷
function formatMoney(
  amount: number,
  nativeCurrency: string,
  displayCurrency: "KRW" | "USD",
  rate: number,
): string {
  const v = convertCurrency(amount, nativeCurrency, displayCurrency, rate)
  return displayCurrency === "KRW"
    ? `₩${Math.round(v).toLocaleString()}`
    : `$${v.toFixed(2)}`
}

// 순자산처럼 큰 금액을 조/억(원화) 또는 T/B/M(달러)로 축약 포맷
function formatAssets(
  amount: number,
  nativeCurrency: string,
  displayCurrency: "KRW" | "USD",
  rate: number,
): string {
  const v = convertCurrency(amount, nativeCurrency, displayCurrency, rate)
  if (displayCurrency === "KRW") {
    if (v >= 1e12) return `${(v / 1e12).toFixed(1)}조원`
    if (v >= 1e8) return `${Math.round(v / 1e8).toLocaleString()}억원`
    if (v >= 1e4) return `${Math.round(v / 1e4).toLocaleString()}만원`
    return `₩${Math.round(v).toLocaleString()}`
  }
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
  return `$${Math.round(v).toLocaleString()}`
}

function CustomTooltip({ active, payload, label, type }: any) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground mb-1.5 font-medium">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-foreground font-semibold">{entry.name}</span>
          <span className="tabular-nums ml-auto pl-3" style={{ color: entry.color }}>
            {type === "returns"
              ? `${entry.value >= 0 ? "+" : ""}${Number(entry.value).toFixed(2)}%`
              : `$${Number(entry.value).toFixed(2)}`}
          </span>
        </div>
      ))}
    </div>
  )
}

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
  chartData: { date: string; price: number; totalReturn: number }[]
  dividendHistory: { date: string; amount: number }[]
  exDividendDate: string | null
  netAssets: number
  expenseRatio: number
  marketCap: number
}

type SearchResult = {
  symbol: string
  name: string
  exchange: string
  type: string
  region?: "KR" | "US"
}

// 검색창이 비어있을 때 보여주는 인기 종목 (미국 + 한국)
const POPULAR_TICKERS: SearchResult[] = [
  { symbol: "SCHD", name: "Schwab US Dividend Equity ETF", exchange: "NYSEArca", type: "ETF", region: "US" },
  { symbol: "JEPI", name: "JPMorgan Equity Premium Income ETF", exchange: "NYSEArca", type: "ETF", region: "US" },
  { symbol: "JEPQ", name: "JPMorgan Nasdaq Equity Premium Income", exchange: "NASDAQ", type: "ETF", region: "US" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", exchange: "NYSEArca", type: "ETF", region: "US" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", exchange: "NASDAQ", type: "ETF", region: "US" },
  { symbol: "458730.KS", name: "TIGER 미국배당다우존스", exchange: "코스피", type: "STOCK", region: "KR" },
  { symbol: "133690.KS", name: "TIGER 미국나스닥100", exchange: "코스피", type: "STOCK", region: "KR" },
  { symbol: "360750.KS", name: "TIGER 미국S&P500", exchange: "코스피", type: "STOCK", region: "KR" },
]

// 배당소득세율: 국내 상장 ETF 15.4%(지방세 포함), 미국 상장 15%(현지 원천징수)
function dividendTaxRate(symbol: string): number {
  return symbol.endsWith(".KS") || symbol.endsWith(".KQ") ? 0.154 : 0.15
}

// 세후 표시일 때 곱할 계수 (세전이면 1)
function afterTaxFactor(symbol: string, afterTax: boolean): number {
  return afterTax ? 1 - dividendTaxRate(symbol) : 1
}

export function ETFComparison() {
  const [exchangeRate, setExchangeRate] = useState(1280)
  const [symbols, setSymbols] = useState<string[]>([])
  const [stockDataMap, setStockDataMap] = useState<Record<string, StockData | null>>({})
  const [period, setPeriod] = useState("1Y")
  const [investmentAmount, setInvestmentAmount] = useState<string>("10000000")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [dividendChartType, setDividendChartType] = useState<"yearly" | "monthly">("yearly")
  const [chartType, setChartType] = useState<"returns" | "dividends">("returns")
  const [displayCurrency, setDisplayCurrency] = useState<"KRW" | "USD">("KRW")
  // 세후(배당소득세 반영) 배당금 표시 여부
  const [afterTax, setAfterTax] = useState(false)

  // 투자 시뮬레이션 상태
  const [investmentAmounts, setInvestmentAmounts] = useState<Record<string, string>>({})
  
  // 검색 상태
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // 드롭다운에 표시할 목록: 검색어가 있으면 검색결과, 없으면 인기 종목
  const displayList: SearchResult[] = searchQuery.length > 0 ? searchResults : POPULAR_TICKERS

  // 검색창 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 검색어가 바뀌면 하이라이트 초기화
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchQuery])

  // 환율 로드
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await fetch("/api/stock?exchangeRate=1")
        if (res.ok) {
          const data = await res.json()
          if (data.exchangeRate) {
            setExchangeRate(data.exchangeRate)
          }
        }
      } catch (error) {
        console.error("환율 조회 실패:", error)
        // 기본값 1280 사용
      }
    }
    fetchExchangeRate()
  }, [])

  // localStorage에서 저장된 종목 불러오기
  useEffect(() => {
    // 기본 종목: 미국 대표 배당 ETF(SCHD) + 한국 대표 배당 ETF(TIGER 미국배당다우존스)
    const DEFAULT_SYMBOLS = ["SCHD", "458730.KS"]
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSymbols(parsed)
        } else {
          setSymbols(DEFAULT_SYMBOLS)
        }
      } catch {
        setSymbols(DEFAULT_SYMBOLS)
      }
    } else {
      setSymbols(DEFAULT_SYMBOLS)
    }
    setIsInitialized(true)
  }, [])

  // 종목 변경 시 localStorage에 저장
  useEffect(() => {
    if (isInitialized && symbols.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols))
      // 종목 변경 시 investmentAmounts 초기화 - 주가 기반 실제 매수 가능 금액으로 설정
      const newAmounts: Record<string, string> = {}
      const defaultAmounts: Record<string, string> = {
        SPY: "5000000",  // 500만
        SCHD: "3000000", // 300만
        QQQ: "2500000",  // 250만
        JEPI: "2000000", // 200만
        VOO: "4000000",  // 400만
      }
      symbols.forEach((symbol) => {
        const existing = investmentAmounts[symbol]
        const rawAmount = existing || defaultAmounts[symbol] || "1000000"
        const data = stockDataMap[symbol]
        // 주가 데이터가 있고, 아직 조정되지 않은 값(기본값이거나 새로 추가된 종목)만 조정
        const isDefault = !existing || rawAmount === defaultAmounts[symbol] || rawAmount === "1000000"
        if (data && data.currentPrice > 0 && isDefault) {
          const isUSStock = data.currency === "USD"
          const pricePerShare = displayCurrency === "KRW"
            ? (isUSStock ? data.currentPrice * exchangeRate : data.currentPrice)
            : (isUSStock ? data.currentPrice : data.currentPrice / exchangeRate)
          const shares = Math.floor(parseFloat(rawAmount) / pricePerShare)
          newAmounts[symbol] = String(Math.round(shares * pricePerShare))
        } else {
          newAmounts[symbol] = rawAmount
        }
      })
      setInvestmentAmounts(newAmounts)
    }
    }, [symbols, isInitialized, stockDataMap])

  // 검색 API 호출
  useEffect(() => {
    if (searchQuery.length < 1) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/stock/search?q=${encodeURIComponent(searchQuery)}`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.results || [])
        }
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      }
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // 주식 데이터 가져오기
  const fetchStockData = useCallback(async (symbol: string, p: string): Promise<StockData | null> => {
    try {
      const res = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}&period=${p}`)
      if (!res.ok) return null
      return await res.json()
    } catch (error) {
      console.error(`Failed to fetch ${symbol}:`, error)
      return null
    }
  }, [])

  // 데이터 로드
  useEffect(() => {
    if (!isInitialized || symbols.length === 0) return

    async function loadData() {
      setIsLoading(true)
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          const data = await fetchStockData(symbol, period)
          return { symbol, data }
        })
      )
      const newMap: Record<string, StockData | null> = {}
      results.forEach(({ symbol, data }) => {
        newMap[symbol] = data
      })
      setStockDataMap(newMap)
      setIsLoading(false)
    }

    loadData()
  }, [symbols, period, fetchStockData, isInitialized])

  // 종목 추가
  const addSymbol = (symbol: string) => {
    if (symbols.length >= 5) return
    if (symbols.includes(symbol)) return
    setSymbols([...symbols, symbol])
    // 새 종목에 100만원 기본값 설정 (데이터 로드 후 useEffect에서 주가에 맞게 조정됨)
    setInvestmentAmounts({
      ...investmentAmounts,
      [symbol]: "1000000"
    })
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  // 종목 제거
  const removeSymbol = (symbol: string) => {
    if (symbols.length <= 1) return
    setSymbols(symbols.filter((s) => s !== symbol))
  }

  // 검색창 키보드 조작 (위/아래 화살표, 엔터, ESC)
  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen || displayList.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.min(prev + 1, displayList.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const target = displayList[highlightedIndex >= 0 ? highlightedIndex : 0]
      if (target && !symbols.includes(target.symbol) && symbols.length < 5) {
        addSymbol(target.symbol)
      }
    } else if (e.key === "Escape") {
      setIsSearchOpen(false)
    }
  }

  // 수익률 차트 데이터 병합 - 모든 종목의 날짜를 기준으로 정규화
  const chartData = (() => {
    // 각 종목별로 날짜-수익률 맵 생성
    const stockDateMaps: Record<string, Map<string, number>> = {}
    let allDates = new Set<string>()

    symbols.forEach((symbol) => {
      const data = stockDataMap[symbol]
      if (data?.chartData && data.chartData.length > 0) {
        const dateMap = new Map<string, number>()
        data.chartData.forEach((d) => {
          dateMap.set(d.date, d.totalReturn)
          allDates.add(d.date)
        })
        stockDateMaps[symbol] = dateMap
      }
    })

    // 날짜 정렬
    const sortedDates = Array.from(allDates).sort()
    if (sortedDates.length === 0) return []

    // 각 종목에 대해 누락된 날짜의 값을 보간 (이전 값 사용)
    const result: Record<string, unknown>[] = []
    const lastValues: Record<string, number> = {}

    // 초기화: 각 종목의 첫 번째 값을 찾아서 설정
    symbols.forEach((symbol) => {
      lastValues[symbol] = 0
    })

    sortedDates.forEach((date) => {
      const entry: Record<string, unknown> = { date }
      
      symbols.forEach((symbol) => {
        const dateMap = stockDateMaps[symbol]
        if (dateMap) {
          if (dateMap.has(date)) {
            lastValues[symbol] = dateMap.get(date)!
          }
          entry[symbol] = lastValues[symbol]
        }
      })

      result.push(entry)
    })

    // 데이터 포인트 샘플링 (최대 100개)
    const step = Math.max(1, Math.floor(result.length / 100))
    return result.filter((_, i) => i % step === 0 || i === result.length - 1)
  })()

  // 월별 배당금 차트 데이터
  const monthlyDividendChartData = (() => {
    const monthlyData: Record<string, Record<string, number>> = {}
    const currentYear = new Date().getFullYear()
    
    const periodYears: Record<string, number> = {
      "1Y": 1,
      "3Y": 3,
      "5Y": 5,
      "10Y": 10,
      "MAX": 100
    }
    const yearsToShow = periodYears[period] || 5
    const startYear = currentYear - yearsToShow
    
    symbols.forEach((symbol) => {
      const data = stockDataMap[symbol]
      if (data?.dividendHistory) {
        data.dividendHistory.forEach((div) => {
          const date = new Date(div.date)
          const year = date.getFullYear()
          if (year >= startYear) {
            const month = date.getMonth() + 1
            const key = `${year}-${String(month).padStart(2, '0')}`
            if (!monthlyData[key]) monthlyData[key] = {}
            monthlyData[key][symbol] = (monthlyData[key][symbol] || 0) + div.amount
          }
        })
      }
    })
    
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({ 
        month: month.slice(5), // MM 형식
        fullMonth: month,
        ...values 
      }))
  })()
  const dividendChartData = (() => {
    const yearlyDividends: Record<string, Record<string, number>> = {}
    const currentYear = new Date().getFullYear()
    
    // period에 따른 시작 연도 계산
    const periodYears: Record<string, number> = {
      "1Y": 1,
      "3Y": 3,
      "5Y": 5,
      "10Y": 10,
      "MAX": 100
    }
    const yearsToShow = periodYears[period] || 5
    const startYear = currentYear - yearsToShow
    
    symbols.forEach((symbol) => {
      const data = stockDataMap[symbol]
      if (data?.dividendHistory) {
        data.dividendHistory.forEach((div) => {
          const year = parseInt(div.date.substring(0, 4))
          // 선택한 기간 내의 데이터만 포함
          if (year >= startYear) {
            const yearStr = year.toString()
            if (!yearlyDividends[yearStr]) yearlyDividends[yearStr] = {}
            yearlyDividends[yearStr][symbol] = (yearlyDividends[yearStr][symbol] || 0) + div.amount
          }
        })
      }
    })
    return Object.entries(yearlyDividends)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, values]) => ({ year, ...values }))
  })()

  // 당일 수익률 (종목 추가 탭에서 사용)
  const getDayReturn = (symbol: string): number => {
    const data = stockDataMap[symbol]
    return data?.priceChangePercent ?? 0
  }

  // 기간 수익률 (차트에 따라 선택한 기간의 수익률)
  const getPeriodReturn = (symbol: string): number => {
    const data = stockDataMap[symbol]
    if (!data?.chartData || data.chartData.length === 0) return 0
    
    // 마지막 값을 사용하되, -100% 같은 이상 값은 무시
    const lastItem = data.chartData[data.chartData.length - 1]
    const returnValue = lastItem?.totalReturn ?? 0
    
    // 데이터 유효성 검증: 단순히 -100%가 나오는 경우 처리
    // 가장 최근의 유효한 데이터 찾기
    if (returnValue <= -100) {
      for (let i = data.chartData.length - 1; i >= 0; i--) {
        const value = data.chartData[i]?.totalReturn ?? 0
        if (value > -100) {
          return value
        }
      }
      return 0
    }
    
    return returnValue
  }

  // 기존 호환성 유지
  const getReturns = (symbol: string): number => getPeriodReturn(symbol)

  // 투자 계산 (종목별 개별 금액) - displayCurrency 기준
  const calculateInvestment = (symbol: string, data: StockData | null) => {
    if (!data) return { shares: 0, annualDividend: 0, actualInvested: 0, remainder: 0 }
    const investmentNum = parseFloat(investmentAmounts[symbol]) || 0
    if (investmentNum === 0) return { shares: 0, annualDividend: 0, actualInvested: 0, remainder: 0 }
    
    // 사용자가 KRW로 보고 있으면, 입력값은 원화이므로 달러로 환산해서 주식수 계산
    const isUSStock = data.currency === "USD"
    let shares = 0
    let pricePerShare = 0
    
    if (displayCurrency === "KRW") {
      // 입력값: 원화, 주가를 원화로 변환해서 계산
      pricePerShare = isUSStock ? data.currentPrice * exchangeRate : data.currentPrice
      shares = Math.floor(investmentNum / pricePerShare)
    } else {
      // 입력값: 달러
      pricePerShare = isUSStock ? data.currentPrice : data.currentPrice / exchangeRate
      shares = Math.floor(investmentNum / pricePerShare)
    }
    
    // 실제 투자금 = 주수 * 주당 가격 (정수 주만 구매 가능)
    const actualInvested = Math.round(shares * pricePerShare)
    const remainder = Math.round(investmentNum - actualInvested)
    
    // 연 배당금 계산 (원화 기준)
    const dividendPerShareKRW = isUSStock ? data.annualDividend * exchangeRate : data.annualDividend
    const annualDividend = Math.round(shares * dividendPerShareKRW)
    
    return { shares, annualDividend, actualInvested, remainder }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">ETF 비교</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* 적용 환율 안내 */}
            <span className="text-xs text-muted-foreground tabular-nums hidden sm:inline">
              적용 환율 1달러 = ₩{Math.round(exchangeRate).toLocaleString()}
            </span>
            {/* Currency Toggle */}
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <Button
                variant={displayCurrency === "KRW" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDisplayCurrency("KRW")}
                className="h-8 px-3 text-xs font-medium"
              >
                원화
              </Button>
              <Button
                variant={displayCurrency === "USD" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDisplayCurrency("USD")}
                className="h-8 px-3 text-xs font-medium"
              >
                달러
              </Button>
            </div>
          </div>
        </div>

        {/* Search & Selected Section */}
        <div className="mb-6">
          <div className="mb-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">종목 추가</label>
            <div className="relative" ref={searchContainerRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="종목명·티커 검색 (예: 삼성전자, SCHD, TIGER 미국배당)"
                className="pl-10 h-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                disabled={symbols.length >= 5}
              />
              {symbols.length >= 5 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-destructive font-medium">
                  최대 5개
                </span>
              )}

              {/* Search Dropdown */}
              {isSearchOpen && symbols.length < 5 && (
                <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-xl max-h-[340px] overflow-y-auto">
                  {/* 검색어가 없을 때: 인기 종목 헤더 */}
                  {searchQuery.length === 0 && (
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-secondary/30 border-b border-border">
                      인기 종목
                    </div>
                  )}
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    </div>
                  ) : displayList.length > 0 ? (
                    displayList.map((result, idx) => {
                      const added = symbols.includes(result.symbol)
                      const isHighlighted = idx === highlightedIndex
                      return (
                        <button
                          key={result.symbol}
                          onClick={() => addSymbol(result.symbol)}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          disabled={added}
                          className={`w-full px-3 py-2.5 text-left flex items-center gap-3 transition-colors disabled:opacity-50 border-b border-border last:border-0 ${
                            isHighlighted ? "bg-secondary/60" : "hover:bg-secondary/50"
                          }`}
                        >
                          <TickerLogo symbol={result.symbol} label={result.name} size={32} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground truncate">
                                {result.region === "KR" ? result.name : result.symbol}
                              </span>
                              <span
                                className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${
                                  result.region === "KR"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {result.region === "KR" ? "🇰🇷 한국" : "🇺🇸 미국"}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {result.region === "KR"
                                ? `${result.symbol.replace(/\.(KS|KQ)$/, "")} · ${result.exchange}`
                                : result.name}
                            </div>
                          </div>
                          {!added && <Plus className="h-4 w-4 text-primary flex-shrink-0" />}
                        </button>
                      )
                    })
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      검색 결과가 없습니다
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Selected Symbols - Enhanced Display */}
          {symbols.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">선택된 종목 ({symbols.length}/5)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                {symbols.map((symbol, index) => {
                  const data = stockDataMap[symbol]
                  const dayReturn = getDayReturn(symbol)
                  const isPositive = dayReturn >= 0
                  return (
                    <div
                      key={symbol}
                      className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors min-w-0"
                    >
                      <TickerLogo symbol={symbol} label={data?.name} size={28} fallbackColor={COLORS[index]} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <span className="font-bold text-foreground text-sm truncate">{symbol}</span>
                          {symbols.length > 1 && (
                            <button
                              onClick={() => removeSymbol(symbol)}
                              className="text-muted-foreground hover:text-destructive transition-colors ml-auto flex-shrink-0"
                              aria-label={`${symbol} 제거`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate" title={data?.name}>
                          {data?.name || " "}
                        </div>
                        {data && (
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-foreground tabular-nums">
                              {formatMoney(data.currentPrice, data.currency, displayCurrency, exchangeRate)}
                            </span>
                            <span className={`text-xs font-semibold tabular-nums ${isPositive ? "text-stock-up" : "text-stock-down"}`}>
                              {isPositive ? "+" : ""}{dayReturn.toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <Card className="bg-card border-border mb-8">
          <CardContent className="p-3 sm:p-6">
            {/* Chart Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
                <Button
                  variant={chartType === "returns" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType("returns")}
                  className="text-sm font-medium h-8"
                >
                  수익률
                </Button>
                <Button
                  variant={chartType === "dividends" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType("dividends")}
                  className="text-sm font-medium h-8"
                >
                  배당금
                </Button>
              </div>
              
              {chartType === "returns" && (
                <div className="flex flex-wrap items-center gap-1 bg-secondary/50 rounded-lg p-1">
                  {PERIODS.map((p) => (
                    <Button
                      key={p}
                      variant={period === p ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPeriod(p)}
                      className={`text-xs font-medium h-7 px-2 ${period === p ? "" : "text-muted-foreground"}`}
                      disabled={isLoading}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              )}
              {chartType === "dividends" && (
                <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
                  <Button
                    variant={dividendChartType === "yearly" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setDividendChartType("yearly")}
                    className="text-xs font-medium h-8"
                  >
                    연간
                  </Button>
                  <Button
                    variant={dividendChartType === "monthly" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setDividendChartType("monthly")}
                    className="text-xs font-medium h-8"
                  >
                    월별
                  </Button>
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="h-[280px] sm:h-[380px] w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : chartType === "returns" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getFullYear().toString().slice(2)}/${String(date.getMonth() + 1).padStart(2, "0")}`
                      }}
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                      minTickGap={40}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      domain={["auto", "auto"]}
                      width={45}
                    />
                    <Tooltip content={<CustomTooltip type="returns" />} />
                    {symbols.map((symbol, index) => (
                      <Line
                        key={symbol}
                        type="natural"
                        dataKey={symbol}
                        stroke={COLORS[index]}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                        name={symbol}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={dividendChartType === "yearly" ? dividendChartData : monthlyDividendChartData} 
                    margin={{ top: 30, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
                    <XAxis
                      dataKey={dividendChartType === "yearly" ? "year" : "month"}
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
                      width={50}
                    />
                    <Tooltip content={<CustomTooltip type="dividend" />} />
                    {symbols.map((symbol, index) => (
                      <Line
                        key={symbol}
                        type="natural"
                        dataKey={symbol}
                        stroke={COLORS[index]}
                        strokeWidth={2.5}
                        dot={(props: any) => {
                          const { cx, cy, payload } = props
                          const value = payload[symbol]
                          if (!value) return <g />
                          return (
                            <g key={`${symbol}-dot-${payload.year || payload.month}`}>
                              <circle
                                cx={cx}
                                cy={cy}
                                r={4}
                                fill={COLORS[index]}
                                stroke="var(--card)"
                                strokeWidth={2}
                              />
                              <text
                                x={cx}
                                y={cy - 12}
                                textAnchor="middle"
                                fill={COLORS[index]}
                                fontSize="11"
                                fontWeight="600"
                              >
                                ${value.toFixed(2)}
                              </text>
                            </g>
                          )
                        }}
                        name={symbol}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Stats - Mobile: Cards, Desktop: Table */}
            <div className="mt-6 pt-6 border-t border-border">
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-4">
                {symbols.map((symbol, index) => {
                  const data = stockDataMap[symbol]
                  const returns = getReturns(symbol)
                  const isPositive = returns >= 0
                  return (
                    <div
                      key={symbol}
                      className="rounded-xl p-4 border-2 bg-card"
                      style={{ borderColor: COLORS[index] + "40" }}
                    >
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index] }} />
                          <TickerLogo symbol={symbol} label={data?.name} size={28} fallbackColor={COLORS[index]} />
                          <div className="min-w-0">
                            <span className="font-bold text-lg text-foreground block leading-tight">{symbol}</span>
                            {data?.name && (
                              <span className="text-[11px] text-muted-foreground truncate block leading-tight" title={data.name}>
                                {data.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`text-xl font-bold tabular-nums flex-shrink-0 ${isPositive ? "text-stock-up" : "text-stock-down"}`}>
                          {isPositive ? "+" : ""}{returns.toFixed(2)}%
                        </div>
                      </div>
                      {data && (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">현재가</span>
                            <span className="font-semibold tabular-nums">
                              {formatMoney(data.currentPrice, data.currency, displayCurrency, exchangeRate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">등락률</span>
                            <span className={`font-semibold tabular-nums ${data.priceChangePercent >= 0 ? "text-stock-up" : "text-stock-down"}`}>
                              {data.priceChangePercent >= 0 ? "+" : ""}{data.priceChangePercent.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">배당수익률</span>
                            <span className="font-bold text-foreground tabular-nums">{data.dividendYield.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">배당금</span>
                            <span className="font-semibold tabular-nums">{formatMoney(data.dividendPerShare, data.currency, displayCurrency, exchangeRate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">수수료</span>
                            <span className="font-semibold tabular-nums">{data.expenseRatio.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">배당횟수</span>
                            <span className="font-semibold">연 {Math.round(data.yearlyDividendCount)}회</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm border-collapse table-fixed">
                  <thead>
                    <tr>
                      <th className="text-left pb-3 pr-4 w-[100px] align-bottom">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">지표</span>
                      </th>
                      {symbols.map((symbol, index) => {
                        const data = stockDataMap[symbol]
                        const returns = getReturns(symbol)
                        const isPositive = returns >= 0
                        return (
                          <th key={symbol} className="pb-3 px-2 w-[160px] text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-0.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                              <TickerLogo symbol={symbol} label={data?.name} size={20} fallbackColor={COLORS[index]} />
                              <span className="font-bold text-foreground text-sm">{symbol}</span>
                            </div>
                            {data?.name && (
                              <div className="text-[10px] text-muted-foreground truncate mb-1 px-1" title={data.name}>
                                {data.name}
                              </div>
                            )}
                            <div className={`text-xl font-bold tabular-nums ${isPositive ? "text-stock-up" : "text-stock-down"}`}>
                              {isPositive ? "+" : ""}{returns.toFixed(2)}%
                            </div>
                            <div className="text-[10px] text-muted-foreground">{period}</div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        label: "현재가",
                        render: (symbol: string, data: any) => data
                          ? formatMoney(data.currentPrice, data.currency, displayCurrency, exchangeRate)
                          : "-",
                      },
                      {
                        label: "등락률",
                        render: (symbol: string, data: any) => {
                          if (!data) return "-"
                          const isPos = data.priceChangePercent >= 0
                          return (
                            <span className={`flex items-center justify-center gap-1 font-semibold tabular-nums ${isPos ? "text-stock-up" : "text-stock-down"}`}>
                              {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {isPos ? "+" : ""}{data.priceChangePercent.toFixed(2)}%
                            </span>
                          )
                        },
                      },
                      {
                        label: "배당수익률",
                        render: (symbol: string, data: any) => data && data.dividendYield > 0
                          ? <span className="text-foreground font-bold">{data.dividendYield.toFixed(2)}%</span>
                          : "-",
                      },
                      {
                        label: "1주당 배당금",
                        render: (symbol: string, data: any) => data && data.dividendPerShare > 0
                          ? formatMoney(data.dividendPerShare, data.currency, displayCurrency, exchangeRate)
                          : "-",
                      },
                      {
                        label: "운용 수수료",
                        render: (symbol: string, data: any) => data && data.expenseRatio > 0
                          ? `${data.expenseRatio.toFixed(2)}%`
                          : "-",
                      },
                      {
                        label: "순자산",
                        render: (symbol: string, data: any) => data && data.netAssets > 0
                          ? formatAssets(data.netAssets, data.currency, displayCurrency, exchangeRate)
                          : "-",
                      },
                      {
                        label: "배당 횟수",
                        render: (symbol: string, data: any) => data && data.yearlyDividendCount > 0
                          ? `연 ${Math.round(data.yearlyDividendCount)}회`
                          : "-",
                      },
                      {
                        label: "배당월",
                        render: (symbol: string, data: any) => {
                          if (!data || data.dividendPaymentMonths.length === 0) return "-"
                          const months: number[] = data.dividendPaymentMonths
                          // 매월(12개월)은 길어서 '매월'로 축약
                          const text = months.length === 12 ? "매월" : months.map((m) => `${m}월`).join(", ")
                          return (
                            <span className="block text-[11px] text-muted-foreground leading-snug break-keep" title={months.map((m) => `${m}월`).join(", ")}>
                              {text}
                            </span>
                          )
                        },
                      },
                    ].map((row, rowIdx) => (
                      <tr
                        key={row.label}
                        className={`border-t border-border ${rowIdx % 2 === 0 ? "bg-transparent" : "bg-secondary/20"}`}
                      >
                        <td className="py-3 pr-4 text-xs font-medium text-muted-foreground whitespace-nowrap">{row.label}</td>
                        {symbols.map((symbol) => {
                          const data = stockDataMap[symbol]
                          return (
                            <td key={symbol} className="py-3 px-2 text-sm font-semibold text-foreground tabular-nums text-center">
                              {row.render(symbol, data)}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unified Investment Simulator + Monthly Dividend */}
        <Card className="bg-card border-border mt-6">
          <CardContent className="p-3 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-border gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">투자 시뮬레이션 · 예상 배당금</h2>
                <p className="text-xs text-muted-foreground hidden sm:block">종목별 투자금액을 입력하면 월별 예상 배당금이 실시간으로 반영됩니다</p>
              </div>
              {/* 세전/세후 토글 */}
              <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 flex-shrink-0">
                <Button
                  variant={!afterTax ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setAfterTax(false)}
                  className="h-8 px-3 text-xs font-medium"
                >
                  세전
                </Button>
                <Button
                  variant={afterTax ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setAfterTax(true)}
                  className="h-8 px-3 text-xs font-medium"
                >
                  세후
                </Button>
              </div>
            </div>

            {/* Investment Simulation - Toss Style with Quantity Control */}
            <div className="space-y-6">
              {/* Portfolio Summary Bar - 결론 숫자 모음 */}
              {(() => {
                let totalInvested = 0
                let totalDividend = 0
                symbols.forEach((symbol) => {
                  const data = stockDataMap[symbol]
                  if (!data) return
                  const { shares } = calculateInvestment(symbol, data)
                  if (shares <= 0) return
                  totalInvested += shares * convertCurrency(data.currentPrice, data.currency, "KRW", exchangeRate)
                  totalDividend += shares * convertCurrency(data.annualDividend, data.currency, "KRW", exchangeRate) * afterTaxFactor(symbol, afterTax)
                })
                totalInvested = Math.round(totalInvested)
                totalDividend = Math.round(totalDividend)
                const portfolioYield = totalInvested > 0 ? (totalDividend / totalInvested) * 100 : 0
                const monthlyAvg = Math.round(totalDividend / 12)

                const items = [
                  { label: "총 투자금액", value: `₩${totalInvested.toLocaleString()}`, accent: false },
                  { label: "연 예상 배당금", value: `₩${totalDividend.toLocaleString()}`, accent: true },
                  { label: "배당수익률", value: `${portfolioYield.toFixed(2)}%`, accent: false },
                  { label: "월 평균", value: `₩${monthlyAvg.toLocaleString()}`, accent: false },
                ]

                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                    {items.map((it) => (
                      <div
                        key={it.label}
                        className={`rounded-xl p-3 sm:p-4 border ${it.accent ? "bg-primary/5 border-primary/20" : "bg-secondary/30 border-border"}`}
                      >
                        <div className="text-[11px] sm:text-xs text-muted-foreground mb-1">{it.label}</div>
                        <div className={`text-base sm:text-xl font-bold tabular-nums truncate ${it.accent ? "text-primary" : "text-foreground"}`}>
                          {it.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}

              {/* Stock Investment Cards - Toss Style */}
              <div className="space-y-2.5">
                {symbols.map((symbol, index) => {
                  const data = stockDataMap[symbol]
                  const { shares, annualDividend, actualInvested } = calculateInvestment(symbol, data)
                  // 1주 가격을 원화로 (한국 종목은 이미 원화이므로 환율을 곱하지 않음)
                  const pricePerShareKRW = data?.currentPrice
                    ? Math.round(convertCurrency(data.currentPrice, data.currency, "KRW", exchangeRate))
                    : 0
                  
                  // Function to update shares directly
                  const updateShares = (newShares: number) => {
                    if (newShares < 0) newShares = 0
                    const newAmount = newShares * pricePerShareKRW
                    setInvestmentAmounts({ ...investmentAmounts, [symbol]: String(newAmount) })
                  }
                  
                  return (
                    <div
                      key={symbol}
                      className="rounded-xl bg-card border border-border p-3.5"
                    >
                      {/* Header + 수량 조절 (한 줄) */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <TickerLogo symbol={symbol} label={data?.name} size={32} fallbackColor={COLORS[index]} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground leading-tight truncate">{symbol}</div>
                            <div className="text-[11px] text-muted-foreground leading-tight">
                              1주 ₩{pricePerShareKRW.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* 수량 컨트롤 */}
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <button
                            onClick={() => updateShares(shares - 1)}
                            disabled={shares <= 0}
                            className="w-7 h-7 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          </button>
                          <input
                            type="text"
                            value={shares}
                            onChange={(e) => {
                              const val = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0
                              updateShares(val)
                            }}
                            className="w-11 h-7 text-center bg-transparent text-base font-bold tabular-nums text-foreground focus:outline-none"
                          />
                          <button
                            onClick={() => updateShares(shares + 1)}
                            className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* 빠른 추가 (얇게) */}
                      <div className="flex gap-1.5 mt-2.5">
                        {[1, 5, 10, 50].map((qty) => (
                          <button
                            key={qty}
                            onClick={() => updateShares(shares + qty)}
                            className="flex-1 py-1 rounded-md bg-muted/30 hover:bg-muted/50 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                          >
                            +{qty}
                          </button>
                        ))}
                      </div>

                      {/* 결과 (한 줄) */}
                      {shares > 0 && (
                        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border/60 text-xs">
                          <span className="text-muted-foreground">
                            투자 <span className="text-foreground font-semibold tabular-nums">₩{actualInvested.toLocaleString()}</span>
                          </span>
                          <span className="text-muted-foreground">
                            연 배당{afterTax ? "(세후)" : ""}{" "}
                            <span className="text-primary font-bold tabular-nums text-sm">
                              ₩{Math.round(annualDividend * afterTaxFactor(symbol, afterTax)).toLocaleString()}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Monthly Dividend Section - Only months with dividends */}
              <div className="rounded-2xl bg-card border border-border p-5">
                <div className="text-base font-semibold text-foreground mb-5">배당금은 이렇게 들어와요</div>
                {(() => {
                  const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
                  const chartData = months.map((month, idx) => {
                    const bySymbol: Record<string, number> = {}
                    let monthKRWTotal = 0
                    symbols.forEach((symbol) => {
                      const data = stockDataMap[symbol]
                      const { shares } = calculateInvestment(symbol, data)
                      if (data?.dividendHistory && shares > 0) {
                        const dividendPerShare = data.dividendHistory
                          .filter(d => parseInt(d.date.substring(5, 7)) === idx + 1)
                          .reduce((sum, d) => sum + d.amount, 0)
                        // 종목별 통화를 원화로 환산 (한국 종목은 이미 원화) + 세후 반영
                        const dividendKRW = convertCurrency(dividendPerShare, data.currency, "KRW", exchangeRate)
                        const symbolKRW = shares * dividendKRW * afterTaxFactor(symbol, afterTax)
                        if (symbolKRW > 0) {
                          bySymbol[symbol] = symbolKRW
                          monthKRWTotal += symbolKRW
                        }
                      }
                    })
                    return { month, monthKRW: Math.round(monthKRWTotal), bySymbol }
                  })

                  // 배당이 있는 종목만 범례에 표시
                  const contributingSymbols = symbols.filter((symbol) =>
                    chartData.some((d) => (d.bySymbol[symbol] || 0) > 0),
                  )

                  const monthsWithDividend = chartData.filter(d => d.monthKRW > 0)
                  const totalAnnual = chartData.reduce((sum, d) => sum + d.monthKRW, 0)
                  const maxMonthAmount = Math.max(...chartData.map(d => d.monthKRW), 1)
                  const monthsCount = monthsWithDividend.length

                  if (monthsWithDividend.length === 0) {
                    return (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        투자 금액을 입력하면 배당금을 확인할 수 있어요
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-3">
                      {/* Schedule label + 종목별 색상 범례 */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div className="text-xs font-medium text-foreground">
                          {(() => {
                            const dividendMonths = monthsWithDividend.map(d => {
                              const dateStr = d.month
                              const monthNum = parseInt(dateStr.substring(0, dateStr.indexOf('월')))
                              return monthNum
                            })

                            if (monthsCount === 12) return "매월 배당"
                            if (monthsCount === 4 && JSON.stringify(dividendMonths.sort((a,b) => a-b)) === JSON.stringify([3,6,9,12])) return "분기 배당"
                            if (monthsCount === 11 && !dividendMonths.includes(1)) return "11개월 배당 (1월 제외)"
                            return `${monthsCount}개월 배당`
                          })()}
                        </div>
                        {contributingSymbols.length > 1 && (
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            {contributingSymbols.map((symbol) => (
                              <span key={symbol} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[symbols.indexOf(symbol)] }} />
                                {symbol}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Only show months with dividends - 종목별 색상 누적 막대 */}
                      {monthsWithDividend.map((d) => (
                        <div key={d.month} className="flex items-center gap-4">
                          <div className="w-12 text-sm font-medium text-muted-foreground">{d.month}</div>
                          <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden flex">
                            {symbols.map((symbol) => {
                              const v = d.bySymbol[symbol] || 0
                              if (v <= 0) return null
                              return (
                                <div
                                  key={symbol}
                                  className="h-full transition-all"
                                  style={{ width: `${(v / maxMonthAmount) * 100}%`, backgroundColor: COLORS[symbols.indexOf(symbol)] }}
                                  title={`${symbol} ₩${Math.round(v).toLocaleString()}`}
                                />
                              )
                            })}
                          </div>
                          <div className="w-28 text-right text-base font-semibold text-foreground tabular-nums">
                            ₩{d.monthKRW.toLocaleString()}
                          </div>
                        </div>
                      ))}

                      {/* Total Summary */}
                      <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">연간 총 배당금{afterTax ? " (세후)" : ""}</span>
                        <span className="text-xl font-bold text-primary tabular-nums">₩{totalAnnual.toLocaleString()}</span>
                      </div>

                      {afterTax && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                          세후 기준: 국내 상장 ETF 배당소득세 15.4%, 미국 상장 ETF 현지 원천징수 15% 적용(개략치). 금융소득종합과세·환율 등은 미반영이며 실제와 차이가 있을 수 있습니다.
                        </p>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
