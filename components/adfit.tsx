'use client'

import { useEffect, useRef } from 'react'

const SDK_SRC = '//t1.kakaocdn.net/kas/static/ba.min.js'

interface AdFitProps {
  unit: string
  width: number
  height: number
  className?: string
}

/**
 * 카카오 애드핏 광고 단위.
 * ba.min.js는 로드 시점에만 .kakao_ad_area를 훑기 때문에,
 * SPA 라우팅에서도 뜨도록 마운트 시 스크립트를 새로 붙인다.
 * 한 페이지에 광고단위가 여러 개여도 스크립트는 한 번만 넣는다(중복 로드 방지).
 * ins의 단위 ID·사이즈는 애드핏 발급 스크립트 그대로 둔다(수정 시 광고 요청 실패).
 */
export function AdFit({ unit, width, height, className }: AdFitProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (document.querySelector(`script[src="${SDK_SRC}"]`)) return
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = SDK_SRC
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
