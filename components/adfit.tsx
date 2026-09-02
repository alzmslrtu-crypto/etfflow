'use client'

import { useEffect, useRef } from 'react'

interface AdFitProps {
  unit: string
  width: number
  height: number
  className?: string
}

/**
 * 카카오 애드핏 광고 단위.
 * ba.min.js는 로드 시점에만 .kakao_ad_area를 훑기 때문에,
 * SPA 라우팅에서도 뜨도록 ins 바로 뒤에 스크립트를 매번 새로 붙인다.
 */
export function AdFit({ unit, width, height, className }: AdFitProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const script = document.createElement('script')
    script.src = '//t1.kakaocdn.net/kas/static/ba.min.js'
    script.async = true
    el.appendChild(script)
    return () => {
      script.remove()
    }
  }, [unit])

  return (
    <div
      ref={ref}
      className={`flex justify-center overflow-hidden ${className ?? ''}`}
      style={{ minHeight: height }}
    >
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={unit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
      />
    </div>
  )
}
