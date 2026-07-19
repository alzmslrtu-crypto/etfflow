import { NextRequest, NextResponse } from "next/server"
import { getEtfQuote, getExchangeRate } from "@/lib/etf-quote"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const period = searchParams.get("period") || "1Y"
  const exchangeRateQuery = searchParams.get("exchangeRate")

  // 환율 조회 요청
  if (exchangeRateQuery === "1") {
    return NextResponse.json({ exchangeRate: await getExchangeRate() })
  }

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
  }

  try {
    return NextResponse.json(await getEtfQuote(symbol, period))
  } catch (error) {
    console.error("Yahoo Finance API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    )
  }
}
