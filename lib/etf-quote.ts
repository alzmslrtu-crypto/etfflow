// ETF 시세·배당 데이터 조회 (Yahoo Finance + 한국 종목은 네이버 보완)
// API 라우트(/api/stock)와 서버 컴포넌트가 함께 쓴다.
import YahooFinance from "yahoo-finance2"
import { getNaverEtfInfo } from "@/lib/naver-quote"
import { trailingDividendInfo, dividendMonths } from "@/lib/dividend-calc"

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
  /** 최근 1년 배당(annualDividend 합계의 근거). 월별 예상 배당 계산용 */
  trailingDividends: { date: string; amount: number }[]
  /** dividendHistory 조회 시작일(YYYY-01-01). 연도별 차트의 첫해 판정용 */
  dividendHistoryStart: string
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  marketCap: number
  netAssets: number
  expenseRatio: number
  exDividendDate: string | null
}

const sumAmounts = (xs: { amount: number }[]) => xs.reduce((sum, x) => sum + x.amount, 0)

/**
 * 야후 quote의 배당수익률(%).
 * dividendYield는 이미 % 단위(0.46 = 0.46%), trailingAnnualDividendYield는 소수(0.0078 = 0.78%)다.
 * 예전처럼 "1 미만이면 ×100"으로 추정하면 수익률 1% 미만 종목이 100배가 된다(QQQM 0.46% → 46% 실측).
 */
function yahooYieldPercent(quote: object): number {
  const q = quote as { dividendYield?: number; trailingAnnualDividendYield?: number }
  return q.dividendYield || (q.trailingAnnualDividendYield || 0) * 100
}

/** 배당 이력(배당락일, 1주당 금액). 날짜 오름차순, 0원 행 제외. 실패하면 빈 배열. */
async function fetchDividendHistory(symbol: string, period1: string, period2: Date) {
  try {
    const rows = await yahooFinance.historical(symbol, { period1, period2, events: "dividends" })
    return (rows ?? [])
      .map((div) => ({
        date: new Date(div.date).toISOString().split("T")[0],
        amount: (div as unknown as { dividends: number }).dividends || 0,
      }))
      .filter((div) => div.amount > 0)
      .sort((x, y) => x.date.localeCompare(y.date))
  } catch {
    return []
  }
}

/**
 * 배당수익률(%)과 1주당 연 배당금. 상세(getEtfQuote)와 목록(getEtfSummaries)이
 * 같은 종목에 다른 수익률을 보여주지 않도록 한 곳에서 정한다.
 * 우선순위: 실제 지급 이력(최근 1년) → 네이버(국내 ETF) → 야후 quote 제공값.
 * (야후 trailing 값은 갱신이 늦다: VOO 0.79% vs 이력 기준 1.08%, 2026-11 실측)
 */
function resolveDividend(ttm: number, price: number, naverYield: number, yahooYield: number) {
  if (ttm > 0 && price > 0) return { dividendYield: (ttm / price) * 100, annualDividend: ttm }
  const dividendYield = naverYield > 0 ? naverYield : yahooYield
  return { dividendYield, annualDividend: ttm > 0 ? ttm : (dividendYield / 100) * price }
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

  // 배당 이력: 5년 전 1월 1일부터 받는다. 연도별 합계의 첫해가 일부만 잡혀
  // 배당 삭감처럼 보이지 않게 하기 위해서다(5년 전 오늘부터 받으면 첫해는 한두 회차뿐).
  const dividendHistoryStart = `${endDate.getFullYear() - 5}-01-01`
  const dividendHistory = await fetchDividendHistory(symbol, dividendHistoryStart, endDate)

  // 최근 1년 배당·지급 주기 (기준점·경계 처리는 lib/dividend-calc.ts 주석 참고)
  const { trailing: trailingDividends, frequency: yearlyDividendCount } = trailingDividendInfo(dividendHistory, endDate)
  const dividendPaymentMonths = dividendMonths(trailingDividends, yearlyDividendCount)

  const { dividendYield: calculatedYield, annualDividend: finalAnnualDividend } = resolveDividend(
    sumAmounts(trailingDividends),
    quote.regularMarketPrice || 0,
    naverDividendYield,
    yahooYieldPercent(quote),
  )

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
    trailingDividends,
    dividendHistoryStart,
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
  /** 최근 지급 간격으로 판정한 연 지급 횟수(0 = 판정 불가). 디렉터리의 고정 주기 대신 쓴다 */
  yearlyDividendCount: number
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
    out[quote.symbol] = {
      symbol: quote.symbol,
      currency: quote.currency || "USD",
      currentPrice: quote.regularMarketPrice || 0,
      priceChangePercent: quote.regularMarketChangePercent || 0,
      dividendYield: yahooYieldPercent(quote), // 아래에서 지급 이력·네이버 기준으로 다시 정한다
      expenseRatio: etf.netExpenseRatio || 0,
      netAssets: etf.netAssets || etf.totalAssets || quote.marketCap || 0,
      yearlyDividendCount: 0,
    }
  }

  // 배당수익률은 상세 페이지와 같은 방식(최근 1년 실제 지급 이력)으로 계산한다.
  // 야후 동시 호출 제한을 피하려고 5개씩 나눠 조회한다.
  const now = new Date()
  const historyStart = `${now.getFullYear() - 5}-01-01`
  const found = Object.keys(out)
  for (let i = 0; i < found.length; i += 5) {
    await Promise.all(
      found.slice(i, i + 5).map(async (symbol) => {
        const base = out[symbol]
        const history = await fetchDividendHistory(symbol, historyStart, now)
        const { trailing, frequency } = trailingDividendInfo(history, now)
        const ttm = sumAmounts(trailing)
        base.yearlyDividendCount = frequency

        // 한국 상장 ETF는 야후에 보수·순자산이 비어 있어 네이버로 보완한다.
        let naverYield = 0
        if (symbol.endsWith(".KS") || symbol.endsWith(".KQ")) {
          try {
            const naver = await getNaverEtfInfo(symbol)
            naverYield = naver.dividendYield
            if (naver.expenseRatio > 0) base.expenseRatio = naver.expenseRatio
            if (naver.netAssets > 0) base.netAssets = naver.netAssets
          } catch {
            // 네이버 실패 시 야후 값 유지
          }
        }
        base.dividendYield = resolveDividend(ttm, base.currentPrice, naverYield, base.dividendYield).dividendYield
      }),
    )
  }

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
