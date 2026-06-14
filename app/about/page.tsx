import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ETF Flow에 대해 | 배당 ETF 비교 분석 플랫폼',
  description: 'ETF Flow는 배당 ETF 투자자들을 위한 실시간 비교 분석 플랫폼입니다.',
  alternates: {
    canonical: 'https://www.etfflow.kr/about',
  },
}

export default function About() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">ETF Flow에 대해</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">ETF Flow는?</h2>
            <p>
              ETF Flow는 배당 ETF 투자자들을 위한 실시간 비교 분석 플랫폼입니다. 
              SCHD, JEPI, JEPQ, VOO, QQQ 등 인기 ETF의 배당수익률, 배당금, 자산배분을 
              한눈에 비교하고 투자 수익을 실시간으로 계산할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">우리의 목표</h2>
            <p>
              복잡한 금융 정보를 단순하고 명확하게 제시하여, 개인 투자자들이 더 나은
              투자 결정을 내릴 수 있도록 도움을 드리는 것입니다. 데이터 기반의 투명한 정보 제공으로
              신뢰받는 플랫폼이 되고자 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">왜 만들었나</h2>
            <p>
              배당 ETF에 직접 투자하면서, 미국 ETF와 한국 상장 ETF의 배당수익률·운용보수·배당 지급월을
              한 화면에서 비교하기가 의외로 번거롭다는 점이 불편했습니다. 특히 한국 투자자 입장에서는
              환율 환산과 세금(배당소득세)까지 고려해야 실제 받는 금액을 알 수 있는데, 이를 한 번에
              계산해 주는 도구가 마땅치 않았습니다. ETF Flow는 그 불편을 직접 겪으며 만든 도구로,
              "투자금을 넣으면 세후 실수령 배당금이 매월 얼마인지"를 누구나 쉽게 확인할 수 있도록
              만드는 데 집중하고 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">핵심 기능</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>실시간 ETF 가격 및 배당수익률 비교</li>
              <li>투자금액별 예상 배당금 자동 계산</li>
              <li>월별 배당금 달력 및 일정 관리</li>
              <li>ETF 자산배분 분석</li>
              <li>개인화된 포트폴리오 시뮬레이션</li>
            </ul>
          </section>

          <section className="bg-muted/30 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-3">데이터 출처</h2>
            <p className="mb-3">
              ETF Flow의 모든 데이터는 신뢰할 수 있는 금융 데이터 제공자로부터 실시간으로 수집됩니다:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Yahoo Finance</strong> - 미국 ETF 가격, 배당금, 재무 데이터</li>
              <li><strong>네이버 금융</strong> - 실시간 원/달러 환율</li>
              <li><strong>각 ETF 운용사 공시자료</strong> - 배당 일정 및 구성종목</li>
            </ul>
            <p className="mt-3 text-xs">
              데이터는 정확성을 위해 정기적으로 검증되며, API 응답은 캐싱되어 빠른 응답 속도를 제공합니다.
            </p>
          </section>

          <section className="bg-muted/30 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-3">운영 정보</h2>
            <ul className="space-y-2">
              <li><strong>운영자:</strong> 개인 운영</li>
              <li><strong>서비스 시작:</strong> 2025년</li>
              <li><strong>서버 위치:</strong> Vercel (글로벌 CDN)</li>
              <li><strong>문의:</strong> <a href="/contact" className="text-primary hover:underline">피드백 페이지</a></li>
            </ul>
            <p className="mt-3 text-xs">
              서비스 개선을 위한 피드백은 언제나 환영합니다. 오류 신고, 기능 제안, 데이터 정정 요청 등을 보내주세요.
            </p>
          </section>

          <section className="border border-yellow-500/30 bg-yellow-500/10 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-3">투자 면책사항</h2>
            <p className="mb-3">
              <strong>ETF Flow에서 제공하는 모든 정보는 교육 및 정보 제공 목적으로만 제공됩니다.</strong>
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>본 서비스는 투자 자문, 투자 권유, 금융 상품 추천을 제공하지 않습니다.</li>
              <li>모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.</li>
              <li>투자 전 반드시 공인된 금융 전문가와 상담하시기 바랍니다.</li>
              <li>과거 수익률은 미래 성과를 보장하지 않습니다.</li>
              <li>ETF 투자에는 원금 손실 위험이 있습니다.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
