import { NextRequest, NextResponse } from "next/server"
import { getNaverEtfInfo } from "@/lib/naver-quote"

// Fetch Korean ETF/Stock data from Naver Finance Mobile API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get("symbol")

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
  }

  try {
    return NextResponse.json(await getNaverEtfInfo(symbol))
  } catch (error) {
    console.error("Naver Finance API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch data from Naver Finance", expenseRatio: 0, netAssets: 0 },
      { status: 200 }
    )
  }
}
