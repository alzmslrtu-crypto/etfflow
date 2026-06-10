import { NextRequest, NextResponse } from "next/server"
import YahooFinance from "yahoo-finance2"

// Initialize Yahoo Finance v3 instance with ETF data support
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey", "ripHistorical"] })

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const period = searchParams.get("period") || "1Y"
  const exchangeRateQuery = searchParams.get("exchangeRate")

  // 환율 조회 요청
  if (exchangeRateQuery === "1") {
    try {
      // Yahoo Finance에서 KRW=X (USD/KRW) 환율 조회
      const quoteData = await yahooFinance.quote("KRW=X")
      const currentRate = quoteData?.regularMarketPrice || 1280 // 기본값 1280원
      return NextResponse.json({ exchangeRate: currentRate })
    } catch (error) {
      // 환율 조회 실패 시 기본값 반환
      return NextResponse.json({ exchangeRate: 1280 })
    }
  }

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
  }

  try {
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
      netAssets?: number; 
      netExpenseRatio?: number;
      totalAssets?: number;
    }
    let netAssets = etfQuote.netAssets || etfQuote.totalAssets || quote.marketCap || 0
    let expenseRatio = etfQuote.netExpenseRatio || 0
    // 네이버에서 가져온 한국 ETF 배당수익률(%) - 야후 데이터가 비어있을 때 사용
    let naverDividendYield = 0

    // For Korean stocks (.KS or .KQ), fetch additional data from Naver Finance
    const isKoreanStock = symbol.endsWith(".KS") || symbol.endsWith(".KQ")
    if (isKoreanStock) {
      try {
        const baseUrl = request.headers.get("host") || "localhost:3000"
        const protocol = baseUrl.includes("localhost") ? "http" : "https"
        const naverResponse = await fetch(`${protocol}://${baseUrl}/api/stock/naver?symbol=${symbol}`)
        if (naverResponse.ok) {
          const naverData = await naverResponse.json()
          if (naverData.netAssets && naverData.netAssets > 0) {
            netAssets = naverData.netAssets
          }
          if (naverData.expenseRatio && naverData.expenseRatio > 0) {
            expenseRatio = naverData.expenseRatio
          }
          if (naverData.dividendYield && naverData.dividendYield > 0) {
            naverDividendYield = naverData.dividendYield
          }
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
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
          const lastYearDividendCount = dividendHistory.filter(
            (div) => new Date(div.date) >= oneYearAgo
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
    const lastYearDividends = dividendHistory.filter(
      (div) => new Date(div.date) >= oneYearAgo
    )
    const totalDividendLastYear = lastYearDividends.reduce((sum, div) => sum + div.amount, 0)

    // Calculate actual dividend yield from history if available
    const currentPrice = quote.regularMarketPrice || 0
    const actualAnnualDividend = totalDividendLastYear || annualDividendRate
    let calculatedYield = currentPrice > 0 && actualAnnualDividend > 0
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

    return NextResponse.json({
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
      exDividendDate: quote.exDividendDate ? new Date(quote.exDividendDate).toISOString().split("T")[0] : null,
    })
  } catch (error) {
    console.error("Yahoo Finance API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    )
  }
}
