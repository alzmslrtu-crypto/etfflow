'use client'

import { useEffect, useRef, useState } from 'react'

interface AdFitProps {
  unit: string
  width: number
  height: number
  className?: string
}

declare global {
  interface Window {
    __adfitOnFail?: (el: HTMLElement) => void
  }
}

/**
 * 카카오 애드핏 광고 단위.
 * ba.min.js는 로드 시점에만 .kakao_ad_area를 훑기 때문에,
 * SPA 라우팅에서도 뜨도록 ins 바로 뒤에 스크립트를 매번 새로 붙인다.
 * ins 마크업·사이즈·단위 ID는 애드핏 발급 스크립트 그대로 둔다(수정 시 광고 요청 실패).
 */
export function AdFit({ unit, width, height, className }: AdFitProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    window.__adfitOnFail = () => setFailed(true)
    const script = document.createElement('script')
    script.async = true
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.src = 'https://t1.kakaocdn.net/kas/static/ba.min.js'
    el.appendChild(script)
    return () => {
      script.remove()
    }
  }, [unit])

  if (failed) return null

  return (
    <div
      ref={ref}
      className={`flex justify-center overflow-hidden ${className ?? ''}`}
      style={{ minHeight: height }}
    >
      <ins
        className="kakao_ad_area"
        style={{ display: 'none', width: '100%' }}
        data-ad-unit={unit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
        data-ad-onfail="__adfitOnFail"
      />
    </div>
  )
}
