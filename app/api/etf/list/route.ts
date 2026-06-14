import { NextResponse } from "next/server"

// 네이버 전체 국내 ETF 목록 (약 1,100개)
const NAVER_ETF_LIST = "https://finance.naver.com/api/sise/etfItemList.nhn"

// etfTabCode -> 카테고리 라벨
const CATEGORY: Record<number, string> = {
  1: "국내 시장지수",
  2: "국내 업종·테마",
  3: "국내 파생",
  4: "해외 주식",
  5: "원자재",
  6: "채권",
  7: "기타·혼합",
}

type NaverEtfItem = {
  itemcode: string
  itemname: string
  nowVal: number
  changeRate: number
  threeMonthEarnRate: number
  nav: number
  marketSum: number
  etfTabCode: number
}

export type EtfListItem = {
  symbol: string // 야후/내부 심볼 (xxxxxx.KS)
  code: string
  name: string
  price: number
  changeRate: number
  return3m: number
  nav: number
  // 순자산(백만원 단위 추정) - 정렬·표시용
  marketSum: number
  category: string
  tab: number
}

async function fetchNaverList(): Promise<NaverEtfItem[]> {
  const res = await fetch(NAVER_ETF_LIST, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      Referer: "https://finance.naver.com/",
      Accept: "application/json",
    },
    next: { revalidate: 600 },
  })
  if (!res.ok) throw new Error("naver fetch failed")
  // 네이버 레거시 API는 EUC-KR 인코딩이라 UTF-8로 읽으면 한글이 깨진다.
  const buffer = await res.arrayBuffer()
  const text = new TextDecoder("euc-kr").decode(buffer)
  const data = JSON.parse(text)
  return data?.result?.etfItemList ?? []
}

export async function GET() {
  try {
    // 콜드스타트/일시적 지연 대비 1회 재시도
    let raw: NaverEtfItem[] = []
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        raw = await fetchNaverList()
        if (raw.length > 0) break
      } catch {
        if (attempt === 1) throw new Error("retry failed")
      }
    }

    const items: EtfListItem[] = raw.map((it) => ({
      symbol: `${it.itemcode}.KS`,
      code: it.itemcode,
      name: it.itemname,
      price: Number(it.nowVal) || 0,
      changeRate: Number(it.changeRate) || 0,
      return3m: Number(it.threeMonthEarnRate) || 0,
      nav: Number(it.nav) || 0,
      marketSum: Number(it.marketSum) || 0,
      category: CATEGORY[it.etfTabCode] || "기타",
      tab: it.etfTabCode,
    }))

    return NextResponse.json({ items, total: items.length })
  } catch {
    return NextResponse.json({ items: [], error: "error" }, { status: 200 })
  }
}
