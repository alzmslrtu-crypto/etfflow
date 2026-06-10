// 웹 성능 측정 및 최적화
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics로 전송
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'web_vitals',
        value: Math.round(metric.value),
        event_label: metric.id,
      })
    }

    // 콘솔에도 출력 (디버깅용)
    console.log('[v0] Web Vital:', metric.name, metric.value)
  }
}

// 이미지 최적화 설정
export const imageOptimizationConfig = {
  formats: ['image/avif', 'image/webp'],
  sizes: [320, 640, 960, 1200, 1600],
  deviceSizes: [320, 640, 960, 1200, 1600],
  quality: 85,
  blurDataURL: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect fill="%23f5f5f5"/%3E%3C/svg%3E',
}

// 페이지 미리로드 설정
export const preloadConfig = [
  {
    href: '/api/stock?symbols=SCHD,JEPI,VOO,QQQ',
    as: 'fetch',
  },
]
