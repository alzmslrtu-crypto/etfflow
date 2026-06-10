import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | ETF Flow',
  description: 'ETF Flow 이용약관',
  alternates: {
    canonical: 'https://www.etfflow.kr/terms',
  },
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-2">이용약관</h1>
        <p className="text-sm text-muted-foreground mb-6">시행일: 2025년 1월 1일 | 최종 수정: 2025년 4월 1일</p>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. 서비스 개요</h2>
            <p>
              본 이용약관은 ETF Flow 서비스(이하 &quot;서비스&quot;)의 이용 조건과 의무를 규정합니다. 
              서비스에 접속하는 것은 본 약관에 동의하는 것으로 간주됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. 서비스 설명</h2>
            <p>
              서비스는 배당 ETF에 대한 실시간 정보, 비교 분석, 투자 시뮬레이션 도구를 제공합니다. 
              모든 정보는 교육 목적이며, 투자 권고가 아닙니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. 사용자 책임</h2>
            <p>
              사용자는 서비스를 합법적인 목적으로만 이용해야 합니다. 
              불법 행위, 해킹, 스팸, 악성 소프트웨어 배포는 금지됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. 지적재산권</h2>
            <p>
              서비스의 모든 콘텐츠, 디자인, 소프트웨어는 저작권법으로 보호됩니다. 
              무단 복제나 배포는 금지됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. 데이터 정확성</h2>
            <p>
              서비스는 신뢰할 수 있는 출처에서 정보를 제공하지만, 실시간 업데이트로 인한 
              지연이나 오류가 발생할 수 있습니다. 중요한 투자 결정 전에 공식 출처를 확인하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. 면책사항</h2>
            <p>
              서비스는 &quot;있는 그대로&quot; 제공되며, 명시적 또는 묵시적 보증이 없습니다. 
              서비스 사용으로 인한 손실에 대해 운영자는 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. 투자 면책</h2>
            <p>
              본 서비스는 금융 자문을 제공하지 않습니다. 투자 결정은 전문가 상담 후 
              개인의 책임 하에 하시기 바랍니다. 과거 수익률은 미래 성과를 보장하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. 서비스 변경 및 중단</h2>
            <p>
              운영자는 사전 통지 없이 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. 약관 변경</h2>
            <p>
              본 약관은 운영자의 판단에 따라 변경될 수 있습니다. 중대한 변경은 사전에 공지됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. 분쟁 해결</h2>
            <p>
              본 약관과 관련된 분쟁은 대한민국 법에 따라 해결되며, 
              관할 법원은 서울중앙지방법원입니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
