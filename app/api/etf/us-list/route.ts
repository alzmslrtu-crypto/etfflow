import { NextResponse } from "next/server"
import usList from "@/lib/us-etf-list.json"

// 미국 상장 ETF 목록 (심볼+이름, 약 3,900개)
// 나스닥 스크리너에서 수집해 정적 번들 — 런타임 외부 의존 없이 안정적.
// 실시간 시세는 종목 상세(/etf/[symbol])에서 야후로 불러온다.
export async function GET() {
  return NextResponse.json({ items: usList, total: (usList as unknown[]).length })
}
