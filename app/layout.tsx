import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  // 기본 SEO
  title: 'ETF 비교 대시보드 | 배당 수익률 실시간 계산',
  description: '배당 ETF 수익률 비교 분석. SCHD, JEPI, VOO, QQQ 실시간 가격, 배당금, 월별 수익 시뮬레이션. 투자금액별 예상 배당금 자동 계산.',
  keywords: ['ETF 비교', 'ETF 수익률', '배당 ETF', 'SCHD', 'JEPI', 'JEPQ', 'VOO', 'QQQ', 'SPY', '배당금 계산기', 'ETF 배당수익률', '미국 ETF', '미국 ETF 추천', '월배당 ETF', '고배당 ETF', 'ETF 투자', '배당주 추천', 'S&P500 ETF', '나스닥 ETF', '투자 시뮬레이션', 'ETF 배당금', 'ETF 분석'],
  authors: [{ name: 'ETF Flow' }],
  creator: 'ETF Flow',
  publisher: 'ETF Flow',
  robots: 'index, follow',
  
  // Open Graph (카카오톡, 페이스북 공유용)
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.etfflow.kr',
    siteName: 'ETF Flow',
    title: 'ETF 비교 대시보드 | 배당 수익률 실시간 비교',
    description: '배당 및 자산 성장 분석 대시보드 - ETF 수익 비교.',
    images: [
      {
        url: 'https://www.etfflow.kr/etf-flow-logo.png',
        width: 1000,
        height: 1000,
        alt: 'ETF Flow - ETF 비교 분석 서비스',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ETF 비교 대시보드 | 배당 수익률 실시간 비교',
    description: '배당 및 자산 성장 분석 대시보드 - ETF 수익 비교.',
    images: ['https://www.etfflow.kr/etf-flow-logo.png'],
  },
  
  // 기타
  metadataBase: new URL('https://www.etfflow.kr'),
  alternates: {
    canonical: 'https://www.etfflow.kr',
  },
  verification: {
    google: 'ayK0cKwfSC7T9bxHxbFjSD85KeslW1KUBc8wFO52Vqs',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ETF Flow - ETF 비교 분석',
    description: 'ETF 수익률 비교, 배당금 계산, 투자 시뮬레이션 서비스',
    url: 'https://www.etfflow.kr',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'SCHD와 JEPI 중 어떤 ETF를 선택해야 하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SCHD는 배당 성장 중심의 분기 배당 ETF이며, JEPI는 월배당으로 더 높은 배당률을 제공합니다. 장기 자산 성장을 원하면 SCHD, 월간 현금흐름이 중요하면 JEPI를 선택하세요.',
        },
      },
      {
        '@type': 'Question',
        name: 'ETF 배당수익률은 어떻게 계산하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '배당수익률은 (연간 배당금 ÷ 현재 가격) × 100 으로 계산됩니다. 본 서비스에서는 실시간 가격과 배당 기록을 바탕으로 자동으로 계산해드립니다.',
        },
      },
      {
        '@type': 'Question',
        name: '100만원을 배당 ETF에 투자하면 월 수익이 얼마나 되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ETF와 배당수익률에 따라 다릅니다. 예를 들어 4% 배당수익률이면 월 약 3,300원 수익입니다. 본 서비스의 투자 시뮬레이션으로 정확히 계산할 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: 'VOO와 QQQ의 차이점은?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'VOO는 S&P500 지수(전체 미국 대형주), QQQ는 나스닥100(기술주 중심)을 추종합니다. VOO가 더 안정적이고 배당률이 높으며, QQQ는 성장성이 높습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '배당 ETF 투자 시 세금은 얼마나 들나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '미국 ETF 배당금은 국내에서 15.4% 세금(배당소득세 14% + 지방소득세 10%)이 자동으로 원천징수됩니다.',
        },
      },
    ],
  }

  return (
    <html lang="ko" className={`bg-background ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2046210707085888"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
