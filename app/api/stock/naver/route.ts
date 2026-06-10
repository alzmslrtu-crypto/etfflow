import { NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

// Initialize Redis for caching (환경변수가 없으면 비활성화 - 로컬 개발 시 캐시 없이 동작)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

// Cache TTL: 10 minutes
const CACHE_TTL = 600

// Fetch Korean ETF/Stock data from Naver Finance Mobile API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get("symbol")

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
  }

  // Extract stock code from symbol (e.g., "161510.KS" -> "161510")
  const stockCode = symbol.replace(/\.(KS|KQ)$/, "")
  const cacheKey = `naver:${stockCode}`

  // Try to get from cache first
  if (redis) {
    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        return NextResponse.json(cached)
      }
    } catch {
      // Cache miss or Redis error, continue to fetch
    }
  }

  try {
    // Fetch both APIs in parallel
    const [integrationResponse, etfBasicResponse] = await Promise.all([
      // Integration API - for expense ratio (펀드보수)
      fetch(`https://m.stock.naver.com/api/stock/${stockCode}/integration`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
          "Accept": "application/json",
        },
      }),
      // ETF Basic API - for marketValue (순자산/시가총액)
      fetch(`https://m.stock.naver.com/api/etf/${stockCode}/basic`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
          "Accept": "application/json",
        },
      }),
    ])

    let expenseRatio = 0
    let netAssets = 0
    let dividendYield = 0
    let fundManager = ""
    let stockName = ""

    // Parse ETF Basic data for marketValue (순자산)
    if (etfBasicResponse.ok) {
      try {
        const etfData = await etfBasicResponse.json()
        stockName = etfData.stockName || ""

        // marketValue contains the net assets like "2조 8,130억"
        if (etfData.marketValue) {
          netAssets = parseKoreanNumber(etfData.marketValue)
        }
      } catch {
        // ETF basic API might fail for non-ETF stocks
      }
    }

    // Parse integration data for expense ratio (펀드보수), 배당수익률
    if (integrationResponse.ok) {
      try {
        const data = await integrationResponse.json()

        // Direct properties (newer API format)
        if (data.fundPay) {
          const match = data.fundPay.match(/([\d.]+)/)
          if (match) {
            expenseRatio = parseFloat(match[1])
          }
        }

        if (data.issueName) {
          fundManager = data.issueName
        }

        if (!stockName && data.stockName) {
          stockName = data.stockName
        }

        // etfKeyIndicator: 가장 신뢰도 높은 ETF 핵심 지표 (배당수익률·순자산·운용보수)
        const ki = data.etfKeyIndicator
        if (ki) {
          // dividendYieldTtm: 최근 1년 배당수익률(%)
          if (typeof ki.dividendYieldTtm === "number" && ki.dividendYieldTtm > 0) {
            dividendYield = ki.dividendYieldTtm
          }
          // totalFee: 총보수(%)
          if (expenseRatio === 0 && typeof ki.totalFee === "number" && ki.totalFee > 0) {
            expenseRatio = ki.totalFee
          }
          // marketValue: 순자산 (basic API 실패 시 보완)
          if (netAssets === 0 && ki.marketValue) {
            netAssets = parseKoreanNumber(ki.marketValue)
          }
          if (!fundManager && ki.issuerName) {
            fundManager = ki.issuerName
          }
        }

        // Also check totalInfos array (some responses use this format)
        if (data.totalInfos && Array.isArray(data.totalInfos)) {
          for (const info of data.totalInfos) {
            if ((info.code === "fundPay" || info.key === "펀드보수") && expenseRatio === 0) {
              const match = info.value?.match(/([\d.]+)/)
              if (match) {
                expenseRatio = parseFloat(match[1])
              }
            }

            if ((info.code === "issueName" || info.key === "운용사") && !fundManager) {
              fundManager = info.value || ""
            }
          }
        }
      } catch {
        // Integration API parsing failed
      }
    }

    const result = {
      symbol: stockCode,
      name: stockName,
      expenseRatio,
      netAssets,
      dividendYield,
      fundManager,
      source: "naver",
    }

    // Cache the result
    if (redis) {
      try {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result))
      } catch {
        // Cache write failed, continue anyway
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Naver Finance API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch data from Naver Finance", expenseRatio: 0, netAssets: 0 },
      { status: 200 }
    )
  }
}

// Parse Korean number format (e.g., "2조 8,130억", "6,951억", "18,682백만")
function parseKoreanNumber(str: string): number {
  if (!str) return 0

  let total = 0
  
  // Remove commas
  const cleaned = str.replace(/,/g, "")
  
  // Match 조 (trillion = 1,000,000,000,000)
  const joMatch = cleaned.match(/([\d.]+)\s*조/)
  if (joMatch) {
    total += parseFloat(joMatch[1]) * 1_000_000_000_000
  }
  
  // Match 억 (hundred million = 100,000,000)
  const ukMatch = cleaned.match(/([\d.]+)\s*억/)
  if (ukMatch) {
    total += parseFloat(ukMatch[1]) * 100_000_000
  }
  
  // Match 백만 (million = 1,000,000)
  const baekmanMatch = cleaned.match(/([\d.]+)\s*백만/)
  if (baekmanMatch) {
    total += parseFloat(baekmanMatch[1]) * 1_000_000
  }
  
  // Match 만 (ten thousand = 10,000) - but not if 백만 already matched
  if (!baekmanMatch) {
    const manMatch = cleaned.match(/([\d.]+)\s*만/)
    if (manMatch) {
      total += parseFloat(manMatch[1]) * 10_000
    }
  }

  return total
}
