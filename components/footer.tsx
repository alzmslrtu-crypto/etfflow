import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 브랜드 */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-3">ETF Flow</h3>
            <p className="text-sm text-muted-foreground">
              배당 ETF 투자자를 위한 실시간 비교 분석 플랫폼
            </p>
          </div>

          {/* 주요 페이지 */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">사이트</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  블로그
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  회사 소개
                </Link>
              </li>
            </ul>
          </div>

          {/* 법률 및 정책 */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">법률</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  피드백
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-border pt-8">
          {/* 투자 면책사항 */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">투자 유의사항:</strong> ETF Flow에서 제공하는 모든 정보는 교육 및 정보 제공 목적으로만 사용되며, 
              투자 권유나 금융 자문이 아닙니다. 본 서비스는 투자 자문을 제공하지 않으며, 특정 금융 상품을 추천하지 않습니다. 
              모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 하며, 투자 전 공인된 금융 전문가와 상담하시기 바랍니다. 
              과거 수익률은 미래 성과를 보장하지 않으며, ETF 투자에는 원금 손실 위험이 있습니다.
            </p>
          </div>
          
          <div className="mb-4 text-xs text-muted-foreground">
            <p>데이터 출처: Yahoo Finance, 네이버 금융 | 환율: 실시간 네이버 금융 기준</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              배당 ETF 투자 정보, ETF Flow와 함께
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} ETF Flow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
