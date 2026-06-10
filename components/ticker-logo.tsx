"use client"

import { useState, useEffect } from "react"

type TickerLogoProps = {
  symbol: string
  /** 픽셀 크기 (정사각형) */
  size?: number
  /** 로고를 못 불러왔을 때 표시할 모노그램 배경색 */
  fallbackColor?: string
  /** 모노그램(대체 표시)에 쓸 이름. 한국 ETF처럼 코드가 숫자일 때 브랜드 약자(TIGER→TI)를 보여주기 위함 */
  label?: string
  className?: string
}

// 거래소 접미사 제거 (예: "005930.KS" -> "005930", "AAPL" -> "AAPL")
function baseSymbol(symbol: string): string {
  return symbol.replace(/\.(KS|KQ|KN)$/i, "")
}

// 모노그램용 약자: label(이름)이 있으면 첫 단어(브랜드) 앞 2글자, 없으면 심볼 앞 2글자
function monogram(symbol: string, label?: string): string {
  const base = baseSymbol(symbol)
  // 코드가 숫자로만 되어 있고 label이 있으면 브랜드 약자 사용 (예: 458730 + "TIGER ..." -> "TI")
  if (label && /^\d/.test(base)) {
    const firstWord = label.trim().split(/\s+/)[0]
    if (firstWord) return firstWord.slice(0, 2).toUpperCase()
  }
  return base.slice(0, 2).toUpperCase()
}

// parqet 무료 로고 CDN (미국·한국 종목 지원, 인증 불필요)
function logoUrl(symbol: string): string {
  return `https://assets.parqet.com/logos/symbol/${encodeURIComponent(symbol)}?format=png`
}

export function TickerLogo({ symbol, size = 40, fallbackColor = "#64748b", label, className }: TickerLogoProps) {
  const [errored, setErrored] = useState(false)

  // 심볼이 바뀌면 에러 상태 초기화
  useEffect(() => {
    setErrored(false)
  }, [symbol])

  // 로고 로딩 실패 시: 색상 동그라미 + 약자
  if (errored) {
    return (
      <div
        className={`flex items-center justify-center rounded-full text-white font-bold flex-shrink-0 ${className ?? ""}`}
        style={{
          width: size,
          height: size,
          backgroundColor: fallbackColor,
          fontSize: Math.round(size * 0.36),
        }}
        aria-label={label || symbol}
      >
        {monogram(symbol, label)}
      </div>
    )
  }

  return (
    <img
      src={logoUrl(symbol)}
      alt={`${symbol} 로고`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`rounded-full object-contain bg-white border border-border/40 flex-shrink-0 ${className ?? ""}`}
      style={{ width: size, height: size }}
    />
  )
}
