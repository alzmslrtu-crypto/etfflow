import { NextRequest, NextResponse } from "next/server"
import { getEtfQuote, getExchangeRate } from "@/lib/etf-quote"

// 같은 요청은 Vercel CDN이 10분간 대신 응답 (Yahoo 429·함수 호출 감소). 에러 응답엔 안 붙인다.
const CACHE = { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const period = searchParams.get("period") || "1Y"
  const exchangeRateQuery = searchParams.get("exchangeRate")

  // 환율 조회 요청
  if (exchangeRateQuery === "1") {
    return NextResponse.json({ exchangeRate: await getExchangeRate() }, { headers: CACHE })
  }

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
  }

  try {
    return NextResponse.json(await getEtfQuote(symbol, period), { headers: CACHE })
  } catch (error) {
    console.error("Yahoo Finance API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    )
  }
}
