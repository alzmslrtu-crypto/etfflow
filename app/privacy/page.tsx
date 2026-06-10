import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | ETF Flow',
  description: 'ETF Flow 개인정보처리방침',
  alternates: {
    canonical: 'https://www.etfflow.kr/privacy',
  },
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-2">개인정보처리방침</h1>
        <p className="text-sm text-muted-foreground mb-6">시행일: 2025년 1월 1일 | 최종 수정: 2025년 5월 20일</p>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. 개요</h2>
            <p>
              ETF Flow(이하 &quot;서비스&quot;라 함)는 사용자의 개인정보를 매우 중요하게 생각하며, 
              개인정보 보호법 및 관련 법령을 준수합니다. 본 개인정보처리방침은 서비스가 
              사용자의 정보를 어떻게 수집, 이용, 보호하는지 설명합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. 수집하는 개인정보</h2>
            <p>서비스는 다음과 같은 정보를 수집할 수 있습니다:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>이메일 주소 (선택적, 뉴스레터 구독 시)</li>
              <li>사용자 기기 정보 (IP 주소, 브라우저 종류, OS 등)</li>
              <li>사용 기록 및 분석 데이터</li>
              <li>쿠키 및 로컬 스토리지 데이터</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. 정보 이용 목적</h2>
            <p>수집된 정보는 다음 목적으로만 이용됩니다:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>서비스 제공 및 개선</li>
              <li>사용자 경험 분석 및 통계</li>
              <li>기술적 문제 해결</li>
              <li>마케팅 및 홍보 (동의 시)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. 정보 보호</h2>
            <p>
              사용자의 개인정보는 암호화되어 안전하게 저장됩니다. 
              서비스는 정기적인 보안 감사를 실시하여 데이터 유출을 방지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. 제3자 공유</h2>
            <p>
              사용자의 개인정보는 법적 요구가 있을 때를 제외하고는 제3자와 공유되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. 쿠키</h2>
            <p>
              서비스는 사용자 경험 개선을 위해 쿠키를 사용합니다. 
              사용자는 브라우저 설정을 통해 쿠키 사용을 거부할 수 있습니다.
            </p>
          </section>

          <section className="bg-muted/30 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-foreground mb-3">7. 광고 및 Google AdSense</h2>
            <p className="mb-3">
              본 서비스는 Google AdSense를 통해 광고를 게재합니다. Google AdSense는 사용자의 관심사에 기반한 광고를 표시하기 위해 
              DART 쿠키를 사용할 수 있습니다.
            </p>
            <p className="mb-3">
              <strong className="text-foreground">DART 쿠키란?</strong><br />
              Google은 DART 쿠키를 사용하여 본 사이트 및 기타 인터넷 사이트 방문 기록을 기반으로 광고를 게재합니다. 
              사용자는 Google 광고 및 콘텐츠 네트워크 개인정보처리방침에서 DART 쿠키 사용을 거부할 수 있습니다.
            </p>
            <p className="mb-3">
              <strong className="text-foreground">광고 맞춤설정 옵트아웃:</strong>
            </p>
            <ul className="space-y-2 list-disc list-inside mb-3">
              <li>
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google 광고 환경설정
                </a>에서 맞춤 광고를 비활성화할 수 있습니다.
              </li>
              <li>
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  aboutads.info
                </a>에서 제3자 광고 쿠키 사용을 거부할 수 있습니다.
              </li>
              <li>
                <a href="https://www.networkadvertising.org/managing/opt_out.asp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Network Advertising Initiative 옵트아웃 페이지
                </a>에서도 설정 가능합니다.
              </li>
            </ul>
            <p>
              Google의 광고 관련 개인정보처리방침은{' '}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Google 광고 정책
              </a>에서 확인할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. 분석 도구</h2>
            <p>
              본 서비스는 Google Analytics 및 Vercel Analytics를 사용하여 사용 통계를 수집합니다.
              이러한 도구는 쿠키를 사용하여 익명화된 데이터를 수집하며, 개인 식별 정보는 수집하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. 방침 변경</h2>
            <p>
              본 방침은 법적 변화나 서비스 변경에 따라 수정될 수 있습니다. 
              변경 사항은 서비스 내 공지를 통해 안내됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. 문의</h2>
            <p>
              개인정보 관련 문의는 <a href="/contact" className="text-primary hover:underline">문의 페이지</a>를 통해 주시기 바랍니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
