import { ImageResponse } from "next/og"

export const alt = "ETF Flow — 배당 ETF 비교·세후 배당 계산"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

async function loadFont(weight: 400 | 700): Promise<ArrayBuffer> {
  const url = `https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-${weight}-normal.woff`
  const res = await fetch(url)
  return res.arrayBuffer()
}

export default async function OgImage() {
  const [regular, bold] = await Promise.all([loadFont(400), loadFont(700)])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#ffffff",
          fontFamily: "NotoKR",
        }}
      >
        {/* 상단: 브랜드 */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
            <div style={{ width: "16px", height: "26px", borderRadius: "4px", background: "#93c5fd" }} />
            <div style={{ width: "16px", height: "42px", borderRadius: "4px", background: "#3b82f6" }} />
            <div style={{ width: "16px", height: "60px", borderRadius: "4px", background: "#0047FF" }} />
          </div>
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 700, color: "#0047FF" }}>ETF Flow</div>
        </div>

        {/* 중앙: 헤드라인 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: "74px", fontWeight: 700, color: "#0B1220", lineHeight: 1.25 }}>
            배당 ETF, 세후까지
          </div>
          <div style={{ display: "flex", fontSize: "74px", fontWeight: 700, color: "#0047FF", lineHeight: 1.25 }}>
            한눈에 비교
          </div>
          <div style={{ display: "flex", fontSize: "32px", fontWeight: 400, color: "#5f6368", marginTop: "26px" }}>
            실시간 비교 · 세후 배당 계산 · 배당 캘린더
          </div>
        </div>

        {/* 하단: 도메인 */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "28px", fontWeight: 700, color: "#0B1220" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "9999px", background: "#0047FF" }} />
          www.etfflow.kr
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "NotoKR", data: regular, weight: 400, style: "normal" },
        { name: "NotoKR", data: bold, weight: 700, style: "normal" },
      ],
    },
  )
}
