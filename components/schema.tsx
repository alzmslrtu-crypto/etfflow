'use client'

export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ETF 비교 대시보드',
    description: '배당 및 자산 성장 분석 대시보드 - ETF 수익 비교. 실시간 가격, 배당금, 투자 시뮬레이션',
    url: 'https://www.etfflow.kr',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    author: {
      '@type': 'Organization',
      name: 'ETF Flow',
      url: 'https://www.etfflow.kr',
    },
    creator: {
      '@type': 'Organization',
      name: 'ETF Flow',
    },
    inLanguage: 'ko-KR',
    isAccessibleForFree: true,
    keywords: 'ETF 비교, ETF 수익률, 배당 ETF, SCHD, JEPI, JEPQ, VOO, QQQ, SPY',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ETF 비교 대시보드는 무엇인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SCHD, JEPI, VOO, QQQ 등 인기 ETF를 실시간 가격, 배당금, 수익률로 비교할 수 있는 무료 서비스입니다.',
        },
      },
      {
        '@type': 'Question',
        name: '투자 시뮬레이션은 어떻게 사용하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '각 종목에 투자하고 싶은 금액을 입력하면 예상 배당금이 실시간으로 계산되어 표시됩니다.',
        },
      },
      {
        '@type': 'Question',
        name: 'API 비용은 없나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네, 완전 무료이며 가입 없이 바로 사용할 수 있습니다. 모든 데이터는 Yahoo Finance에서 제공됩니다.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
