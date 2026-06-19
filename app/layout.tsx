import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { FAQ_ITEMS } from '@/lib/faq'
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
    // og:image는 app/opengraph-image.tsx에서 동적 생성
  },

  // Twitter Card (twitter:image는 app/twitter-image.tsx에서 생성)
  twitter: {
    card: 'summary_large_image',
    title: 'ETF 비교 대시보드 | 배당 수익률 실시간 비교',
    description: '배당 및 자산 성장 분석 대시보드 - ETF 수익 비교.',
  },
  
  // 기타
  metadataBase: new URL('https://www.etfflow.kr'),
  alternates: {
    canonical: 'https://www.etfflow.kr',
    types: {
      'application/rss+xml': 'https://www.etfflow.kr/rss',
    },
  },
  verification: {
    google: 'ayK0cKwfSC7T9bxHxbFjSD85KeslW1KUBc8wFO52Vqs',
    other: {
      'naver-site-verification': '1684eb32379cccd57905509b2bcd6781595eec43',
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
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
