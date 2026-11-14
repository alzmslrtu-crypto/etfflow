import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | ETF Flow',
  description: 'ETF Flow 개인정보처리방침',
  alternates: {
    canonical: 'https://www.etfflow.kr/privacy',
  },
}

const linkClass = 'text-primary hover:underline'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-2">개인정보처리방침</h1>
        <p className="text-sm text-muted-foreground mb-6">시행일: 2025년 1월 1일 | 최종 수정: 2026년 11월 14일</p>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. 개요</h2>
            <p>
              ETF Flow(이하 &quot;서비스&quot;)는 회원가입·로그인·댓글·입력 양식이 없는 정보 제공 사이트입니다.
              운영자는 방문자의 이름·연락처 같은 개인정보를 직접 수집해 저장하지 않습니다.
              이 방침은 서비스에서 실제로 작동하는 기능만 기준으로, 어떤 정보가 어디서 처리되는지 설명합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. 브라우저에 저장되는 정보</h2>
            <p>
              비교 도구에 담은 종목 코드(최대 5개)를 다음 방문 때 다시 보여주기 위해 브라우저의 로컬 스토리지에 저장합니다.
              이 값은 사용자 기기에만 남고 운영자 서버에 저장되지 않습니다. 브라우저의 사이트 데이터 삭제로 언제든 지울 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. 이메일 문의</h2>
            <p>
              <a href="/contact" className={linkClass}>문의 페이지</a>의 이메일로 연락하면 보낸 주소와 내용을 받게 됩니다.
              이 정보는 답변과 오류 수정에만 사용하며 제3자에게 제공하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. 접속 기록과 방문 통계</h2>
            <p className="mb-3">
              서비스는 Vercel에서 호스팅되며, 요청 처리 과정에서 IP 주소·브라우저 종류 같은 접속 기록이 호스팅 서버에서 처리될 수 있습니다.
            </p>
            <p>
              방문 통계는 Vercel Web Analytics로 집계합니다. Vercel에 따르면 이 도구는 쿠키를 쓰지 않고, 요청 정보로 만든 해시로 방문자를 구분하며
              그 해시는 하루마다 초기화됩니다(
              <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
                Vercel 안내
              </a>
              ).
            </p>
          </section>

          <section className="bg-muted/30 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-foreground mb-3">5. 광고</h2>
            <p className="mb-3">
              서비스는 Google AdSense와 카카오 애드핏 광고를 게재합니다. 이 광고 사업자들은 쿠키 등을 이용해 본 사이트와 다른 사이트의
              방문 기록을 바탕으로 광고를 보여줄 수 있습니다. 이 정보는 운영자가 아니라 각 사업자가 처리합니다.
            </p>
            <ul className="space-y-2 list-disc list-inside mb-3">
              <li>
                <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Google 내 광고 센터
                </a>
                에서 맞춤 광고를 끌 수 있습니다.
              </li>
              <li>
                Google이 광고에 쿠키를 쓰는 방식:{' '}
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Google 광고 정책
                </a>
              </li>
              <li>
                제3자 광고 쿠키 거부:{' '}
                <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  aboutads.info
                </a>
                ,{' '}
                <a href="https://thenai.org/how-to-opt-out/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  NAI 옵트아웃
                </a>
              </li>
              <li>
                카카오 애드핏의 정보 처리:{' '}
                <a href="https://www.kakao.com/policy/privacy" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  카카오 개인정보처리방침
                </a>
              </li>
            </ul>
            <p>브라우저 설정에서 쿠키를 차단하거나 삭제할 수도 있습니다. 이 경우에도 서비스 이용에는 지장이 없습니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. 방침 변경</h2>
            <p>기능이 바뀌면 이 방침을 수정하고, 상단의 최종 수정일을 갱신합니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. 문의</h2>
            <p>
              개인정보 관련 문의는 <a href="/contact" className={linkClass}>문의 페이지</a>의 이메일로 보내주세요.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
