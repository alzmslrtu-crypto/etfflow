import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '피드백 | ETF Flow',
  description: 'ETF Flow에 피드백을 남겨주세요. 사용자 의견은 우리의 가장 소중한 자산입니다.',
  alternates: {
    canonical: 'https://www.etfflow.kr/contact',
  },
}

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">피드백</h1>
          <p className="text-muted-foreground">
            ETF Flow를 더 좋게 만들기 위한 여러분의 의견을 들려주세요
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">피드백 제출</h2>
              <p className="text-muted-foreground mb-6">
                아래의 이메일 주소로 의견을 보내주시면 됩니다. 모든 피드백은 소중하게 검토됩니다.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 border border-border">
              <p className="text-sm font-semibold text-muted-foreground mb-2">이메일 주소</p>
              <a
                href="mailto:jj0320834@gmail.com"
                className="text-2xl font-bold text-primary hover:underline break-all"
              >
                jj0320834@gmail.com
              </a>
            </div>

            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-foreground">피드백 주제</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>새로운 ETF 추가 요청</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>기능 개선 제안</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>버그 보고</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>사용 경험 개선 의견</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>일반적인 피드백</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20 mt-6">
              <p className="text-sm text-foreground">
                <span className="font-semibold">💡 팁:</span> 피드백에 구체적인 내용을 포함하면 더 빠르게 개선될 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-secondary/50 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-3">자주 묻는 질문</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-foreground mb-1">피드백에 응답을 받을 수 있나요?</p>
              <p className="text-sm text-muted-foreground">
                중요한 피드백이나 버그 보고의 경우 이메일로 회신해드립니다.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">개인정보 보호는 어떻게 되나요?</p>
              <p className="text-sm text-muted-foreground">
                모든 피드백은 개인정보처리방침에 따라 안전하게 관리됩니다.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">얼마나 자주 피드백이 반영되나요?</p>
              <p className="text-sm text-muted-foreground">
                우선순위에 따라 순차적으로 검토되며, 큰 기능은 매월 업데이트됩니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">다른 도움이 필요하신가요?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/about"
              className="text-primary hover:underline text-sm font-semibold"
            >
              회사 정보 →
            </a>
            <a
              href="/privacy"
              className="text-primary hover:underline text-sm font-semibold"
            >
              개인정보처리방침 →
            </a>
            <a
              href="/"
              className="text-primary hover:underline text-sm font-semibold"
            >
              홈으로 →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
