import { NextRequest, NextResponse } from "next/server"
import YahooFinance from "yahoo-finance2"

// Initialize Yahoo Finance v3 instance
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] })

interface SearchQuote {
  symbol?: string
  shortname?: string
  longname?: string
  exchange?: string
  quoteType?: string
}

type StockResult = {
  symbol: string
  name: string
  exchange: string
  type: string
  region: "KR" | "US"
}

// 한글 포함 여부
function hasHangul(str: string): boolean {
  return /[가-힣㄰-㆏]/.test(str)
}

// 정규화 (소문자 + 공백 제거) - 부분검색 비교용
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "")
}

// 인기 한국 배당/지수 ETF 사전 (네이버 자동완성은 접두어 매칭만 되어
// "미국배당", "배당", "리츠" 같은 중간 단어 검색이 안 되므로 이를 보완한다.
// 코드는 네이버 API로 검증된 실제 종목코드)
const KR_ETF_DICT: Array<{ code: string; name: string; keywords: string[] }> = [
  { code: "458730", name: "TIGER 미국배당다우존스", keywords: ["미국배당", "배당", "다우존스", "schd", "월배당"] },
  { code: "446720", name: "SOL 미국배당다우존스", keywords: ["미국배당", "배당", "다우존스", "schd", "월배당"] },
  { code: "402970", name: "ACE 미국배당다우존스", keywords: ["미국배당", "배당", "다우존스", "schd"] },
  { code: "441640", name: "KODEX 미국배당커버드콜액티브", keywords: ["미국배당", "배당", "커버드콜", "월배당"] },
  { code: "429000", name: "TIGER 미국S&P500배당귀족", keywords: ["미국배당", "배당", "배당귀족", "sp500"] },
  { code: "210780", name: "TIGER 코스피고배당", keywords: ["고배당", "배당", "코스피"] },
  { code: "279530", name: "KODEX 고배당주", keywords: ["고배당", "배당"] },
  { code: "329200", name: "TIGER 리츠부동산인프라", keywords: ["리츠", "부동산", "인프라", "배당"] },
  { code: "360750", name: "TIGER 미국S&P500", keywords: ["미국", "sp500", "에스앤피"] },
  { code: "133690", name: "TIGER 미국나스닥100", keywords: ["미국", "나스닥", "나스닥100"] },
  { code: "069500", name: "KODEX 200", keywords: ["코스피", "코스피200", "지수"] },
]

// 사전에서 부분검색 (이름 또는 키워드에 검색어가 포함되면 매칭)
function searchKrDict(query: string): StockResult[] {
  const q = norm(query)
  if (q.length < 2) return []
  return KR_ETF_DICT.filter(
    (etf) => norm(etf.name).includes(q) || etf.keywords.some((kw) => kw.includes(q)),
  ).map((etf) => ({
    symbol: `${etf.code}.KS`,
    name: etf.name,
    exchange: "코스피",
    type: "STOCK",
    region: "KR" as const,
  }))
}

// 네이버 자동완성 typeCode -> 야후 심볼 접미사
function naverSuffix(typeCode: string): string | null {
  switch (typeCode) {
    case "KOSPI":
      return ".KS"
    case "KOSDAQ":
      return ".KQ"
    default:
      return null // KONEX 등은 야후 데이터가 없어 제외
  }
}

// 네이버 자동완성 검색 (한국 주식/ETF)
async function searchNaver(query: string): Promise<StockResult[]> {
  try {
    const res = await fetch(
      `https://ac.stock.naver.com/ac?q=${encodeURIComponent(query)}&target=stock,index,etf`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
          Accept: "application/json",
        },
      },
    )
    if (!res.ok) return []
    const data = await res.json()
    const items: Array<{
      code?: string
      name?: string
      typeCode?: string
      typeName?: string
      nationCode?: string
    }> = Array.isArray(data?.items) ? data.items : []

    const out: StockResult[] = []
    for (const item of items) {
      if (item.nationCode !== "KOR" || !item.code) continue
      const suffix = naverSuffix(item.typeCode || "")
      if (!suffix) continue
      out.push({
        symbol: `${item.code}${suffix}`,
        name: item.name || item.code || "",
        exchange: item.typeName || "코스피",
        type: "STOCK",
        region: "KR",
      })
    }
    return out
  } catch {
    return []
  }
}

// 야후 검색 (미국/해외 주식·ETF)
async function searchYahoo(query: string): Promise<StockResult[]> {
  try {
    const results = await yahooFinance.search(
      query,
      { quotesCount: 10, newsCount: 0 },
      {
        // Yahoo가 OPTION 등 라이브러리 스키마에 없는 타입을 반환하면
        // 검증 오류로 전체 검색이 실패하므로 결과 검증을 비활성화한다.
        validateResult: false,
      },
    )

    const rawQuotes: SearchQuote[] = Array.isArray((results as { quotes?: unknown })?.quotes)
      ? (results as { quotes: SearchQuote[] }).quotes
      : []

    return rawQuotes
      .filter((item) => item.quoteType === "ETF" || item.quoteType === "EQUITY")
      .map((item) => {
        const symbol = item.symbol || ""
        const isKR = symbol.endsWith(".KS") || symbol.endsWith(".KQ")
        return {
          symbol,
          name: item.shortname || item.longname || symbol,
          exchange: item.exchange || "",
          type: item.quoteType || "",
          region: (isKR ? "KR" : "US") as "KR" | "US",
        }
      })
      .filter((item) => item.symbol)
  } catch (error) {
    console.error("Yahoo Finance search error:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] })
  }

  // 한국 주식과 해외 주식을 동시에 검색
  const [naverResults, yahooResults] = await Promise.all([
    searchNaver(query),
    searchYahoo(query),
  ])

  // 인기 한국 ETF 사전에서 부분검색 보완 (네이버 자동완성의 접두어 매칭 한계 보완)
  const dictResults = searchKrDict(query)

  // 한글 검색이면 한국(네이버+사전) 결과를 먼저, 영문 검색이면 해외 결과를 먼저 보여준다
  const koreanFirst = hasHangul(query)
  const ordered = koreanFirst
    ? [...naverResults, ...dictResults, ...yahooResults]
    : [...yahooResults, ...naverResults, ...dictResults]

  // 심볼 기준 중복 제거 (먼저 들어온 결과 우선)
  const seen = new Set<string>()
  const merged: StockResult[] = []
  for (const item of ordered) {
    if (seen.has(item.symbol)) continue
    seen.add(item.symbol)
    merged.push(item)
  }

  return NextResponse.json({ results: merged.slice(0, 12) })
}
