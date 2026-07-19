// ETF 시세·배당 데이터 조회 (Yahoo Finance + 한국 종목은 네이버 보완)
// API 라우트(/api/stock)와 서버 컴포넌트가 함께 쓴다.
import YahooFinance from "yahoo-finance2"
import { getNaverEtfInfo } from "@/lib/naver-quote"

// Initialize Yahoo Finance v3 instance with ETF data support
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey", "ripHistorical"] })

export type EtfQuote = {
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
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  marketCap: number
  netAssets: number
  expenseRatio: number
  exDividendDate: string | null
}

export async function getEtfQuote(symbol: string, period = "1Y"): Promise<EtfQuote> {
  // Calculate date range based on period
  const endDate = new Date()
  const startDate = new Date()

  switch (period) {
    case "1M":
      startDate.setMonth(startDate.getMonth() - 1)
      break
    case "3M":
      startDate.setMonth(startDate.getMonth() - 3)
      break
    case "6M":
      startDate.setMonth(startDate.getMonth() - 6)
      break
    case "YTD":
      startDate.setMonth(0)
      startDate.setDate(1)
      break
    case "1Y":
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
    case "3Y":
      startDate.setFullYear(startDate.getFullYear() - 3)
      break
    case "5Y":
      startDate.setFullYear(startDate.getFullYear() - 5)
      break
    case "10Y":
      startDate.setFullYear(startDate.getFullYear() - 10)
      break
    case "MAX":
      startDate.setFullYear(1990)
      break
    default:
      startDate.setFullYear(startDate.getFullYear() - 1)
  }

  // Fetch historical data
  const historical = await yahooFinance.chart(symbol, {
    period1: startDate,
    period2: endDate,
    interval: period === "1M" || period === "3M" ? "1d" : "1wk",
  })

  // Fetch quote for current price and dividend info
  const quote = await yahooFinance.quote(symbol)

  // Extract ETF-specific data (available for quoteType: "ETF")
  const etfQuote = quote as unknown as {
    netAssets?: number
    netExpenseRatio?: number
    totalAssets?: number
  }
  let netAssets = etfQuote.netAssets || etfQuote.totalAssets || quote.marketCap || 0
  let expenseRatio = etfQuote.netExpenseRatio || 0
  // 네이버에서 가져온 한국 ETF 배당수익률(%) - 야후 데이터가 비어있을 때 사용
  let naverDividendYield = 0

  // For Korean stocks (.KS or .KQ), fetch additional data from Naver Finance
  const isKoreanStock = symbol.endsWith(".KS") || symbol.endsWith(".KQ")
  if (isKoreanStock) {
    try {
      const naverData = await getNaverEtfInfo(symbol)
      if (naverData.netAssets && naverData.netAssets > 0) {
        netAssets = naverData.netAssets
      }
      if (naverData.expenseRatio && naverData.expenseRatio > 0) {
        expenseRatio = naverData.expenseRatio
      }
      if (naverData.dividendYield && naverData.dividendYield > 0) {
        naverDividendYield = naverData.dividendYield
      }
    } catch {
      // Naver data fetch failed, continue with Yahoo data
    }
  }

  // Format historical data - filter out entries with null/zero close price
  const chartData = historical.quotes
    .filter((item) => item.close != null && item.close > 0)
    .map((item) => ({
      date: new Date(item.date).toISOString().split("T")[0],
      price: item.close as number,
    }))

  // Calculate total return normalized from start
  const startPrice = chartData[0]?.price || 1
  const normalizedData = chartData.map((item) => ({
    ...item,
    totalReturn: Math.round(((item.price - startPrice) / startPrice) * 10000) / 100,
  }))

  // Get dividend info from Yahoo Finance
  const annualDividendRate = quote.trailingAnnualDividendRate ?? quote.dividendRate ?? 0
  const dividendYieldRaw = quote.trailingAnnualDividendYield ?? quote.dividendYield ?? 0

  // Yahoo returns yield as decimal (0.0123 = 1.23%), convert to percentage if needed
  // If value is already > 1, it's likely already a percentage
  let dividendYieldPercent = 0
  if (dividendYieldRaw > 0) {
    dividendYieldPercent = dividendYieldRaw < 1 ? dividendYieldRaw * 100 : dividendYieldRaw
  }

  // Fetch dividend history using historical API for accurate dividend dates
  let dividendHistory: { date: string; amount: number }[] = []
  let dividendPaymentMonths: number[] = []
  let yearlyDividendCount = 0

  try {
    // For dividend history, always fetch last 5 years for complete dividend pattern
    // This ensures we get all dividend months regardless of the selected chart period
    const dividendStartDate = new Date()
    dividendStartDate.setFullYear(dividendStartDate.getFullYear() - 5)

    const divHistory = await yahooFinance.historical(symbol, {
      period1: dividendStartDate,
      period2: endDate,
      events: "dividends",
    })

    if (divHistory && divHistory.length > 0) {
      dividendHistory = divHistory.map((div) => ({
        date: new Date(div.date).toISOString().split("T")[0],
        amount: (div as unknown as { dividends: number }).dividends || 0,
      }))

      // Get all dividend months from dividend history (not filtering by year)
      // This shows all months the company pays dividends
      if (dividendHistory.length > 0) {
        dividendPaymentMonths = dividendHistory
          .map((div) => new Date(div.date).getMonth() + 1)
          .filter((v, i, a) => a.indexOf(v) === i) // unique months
          .sort((a, b) => a - b)

        // Calculate yearly dividend count based on actual dividend frequency
        const uniqueMonthCount = dividendPaymentMonths.length

        // Count dividends in the last 12 months for frequency validation
        const oneYearAgoForCount = new Date()
        oneYearAgoForCount.setFullYear(oneYearAgoForCount.getFullYear() - 1)
        const lastYearDividendCount = dividendHistory.filter(
          (div) => new Date(div.date) >= oneYearAgoForCount
        ).length

        // Determine payment frequency based on actual pattern
        if (uniqueMonthCount === 12 || (uniqueMonthCount >= 11 && lastYearDividendCount >= 11)) {
          yearlyDividendCount = 12 // Monthly payer (JEPI, JEPQ, etc.)
          // For monthly payers, ensure all 12 months are shown
          dividendPaymentMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        } else if (uniqueMonthCount === 4 || (uniqueMonthCount >= 3 && lastYearDividendCount >= 3)) {
          yearlyDividendCount = 4 // Quarterly payer (SCHD, VOO, QQQ, etc.)
        } else if (uniqueMonthCount === 2 || (uniqueMonthCount >= 1 && lastYearDividendCount >= 2)) {
          yearlyDividendCount = 2 // Semi-annual payer
        } else if (uniqueMonthCount === 1 || lastYearDividendCount === 1) {
          yearlyDividendCount = 1 // Annual payer
        } else {
          yearlyDividendCount = Math.max(uniqueMonthCount, lastYearDividendCount, 1)
        }
      }
    }
  } catch {
    // Dividend history might not be available for all stocks
  }

  // Calculate 1-year total dividend from history
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const lastYearDividends = dividendHistory.filter((div) => new Date(div.date) >= oneYearAgo)
  const totalDividendLastYear = lastYearDividends.reduce((sum, div) => sum + div.amount, 0)

  // Calculate actual dividend yield from history if available
  const currentPrice = quote.regularMarketPrice || 0
  const actualAnnualDividend = totalDividendLastYear || annualDividendRate
  let calculatedYield =
    currentPrice > 0 && actualAnnualDividend > 0
      ? (actualAnnualDividend / currentPrice) * 100
      : dividendYieldPercent

  // 한국 ETF는 야후 배당 데이터가 비어있는 경우가 많아 네이버 배당수익률로 보완
  let finalAnnualDividend = actualAnnualDividend
  if ((calculatedYield === 0 || actualAnnualDividend === 0) && naverDividendYield > 0) {
    calculatedYield = naverDividendYield
    // 배당수익률과 현재가로 1주당 연 배당금 역산
    if (currentPrice > 0) {
      finalAnnualDividend = (naverDividendYield / 100) * currentPrice
    }
  }

  return {
    symbol: quote.symbol,
    name: quote.shortName || quote.longName || symbol,
    currency: quote.currency || "USD",
    currentPrice: quote.regularMarketPrice || 0,
    previousClose: quote.regularMarketPreviousClose || 0,
    priceChange: (quote.regularMarketPrice || 0) - (quote.regularMarketPreviousClose || 0),
    priceChangePercent: quote.regularMarketChangePercent || 0,
    dividendYield: calculatedYield,
    dividendPerShare: finalAnnualDividend,
    annualDividend: finalAnnualDividend,
    dividendPaymentMonths,
    yearlyDividendCount,
    chartData: normalizedData,
    dividendHistory,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
    marketCap: quote.marketCap || 0,
    netAssets: netAssets,
    expenseRatio: expenseRatio,
    exDividendDate: quote.exDividendDate
      ? new Date(quote.exDividendDate).toISOString().split("T")[0]
      : null,
  }
}

export type EtfSummary = {
  symbol: string
  currency: string
  currentPrice: number
  priceChangePercent: number
  dividendYield: number
  expenseRatio: number
  netAssets: number
}

// 목록·그리드용 경량 조회. 차트·배당이력 없이 핵심 지표만 배치로 가져온다.
// 실패한 종목은 결과에서 빠진다(목록 페이지는 일부만 있어도 렌더돼야 하므로).
export async function getEtfSummaries(symbols: string[]): Promise<Record<string, EtfSummary>> {
  const out: Record<string, EtfSummary> = {}
  if (symbols.length === 0) return out

  let quotes: Awaited<ReturnType<typeof yahooFinance.quote>>[] = []
  try {
    quotes = await yahooFinance.quote(symbols)
  } catch {
    return out
  }

  for (const quote of quotes) {
    if (!quote?.symbol) continue
    const etf = quote as unknown as { netAssets?: number; netExpenseRatio?: number; totalAssets?: number }
    // ?? 가 아니라 || 를 쓴다. 야후는 값이 없을 때 undefined가 아니라 0을 넣어 보내므로
    // ?? 로는 다음 후보(dividendYield)로 넘어가지 못한다.
    const yieldRaw = quote.trailingAnnualDividendYield || quote.dividendYield || 0
    out[quote.symbol] = {
      symbol: quote.symbol,
      currency: quote.currency || "USD",
      currentPrice: quote.regularMarketPrice || 0,
      priceChangePercent: quote.regularMarketChangePercent || 0,
      dividendYield: yieldRaw > 0 ? (yieldRaw < 1 ? yieldRaw * 100 : yieldRaw) : 0,
      expenseRatio: etf.netExpenseRatio || 0,
      netAssets: etf.netAssets || etf.totalAssets || quote.marketCap || 0,
    }
  }

  // 한국 상장 ETF는 야후에 배당수익률·보수가 비어 있어 네이버로 보완한다.
  const koreanSymbols = symbols.filter((s) => s.endsWith(".KS") || s.endsWith(".KQ"))
  await Promise.all(
    koreanSymbols.map(async (symbol) => {
      const base = out[symbol]
      if (!base) return
      try {
        const naver = await getNaverEtfInfo(symbol)
        if (naver.dividendYield > 0) base.dividendYield = naver.dividendYield
        if (naver.expenseRatio > 0) base.expenseRatio = naver.expenseRatio
        if (naver.netAssets > 0) base.netAssets = naver.netAssets
      } catch {
        // 네이버 실패 시 야후 값 유지
      }
    })
  )

  return out
}

// 환율(USD/KRW) 조회. 실패 시 기본값 1280원.
export async function getExchangeRate(): Promise<number> {
  try {
    const quoteData = await yahooFinance.quote("KRW=X")
    return quoteData?.regularMarketPrice || 1280
  } catch {
    return 1280
  }
}
