import type { Metadata } from "next"
import Link from "next/link"
import { Target, TrendingUp, Receipt, ArrowLeftRight, Percent, Compass } from "lucide-react"

export const metadata: Metadata = {
  title: "배당 투자 계산기 모음 | ETF Flow",
  description:
    "배당 투자에 필요한 계산기를 한곳에. 월 배당금 목표 계산기, 배당 재투자(DRIP) 복리 계산기, 배당소득세 계산기, 환율 계산기, 배당수익률 계산기, 투자 성향 테스트를 무료로 이용하세요.",
  alternates: { canonical: "https://www.etfflow.kr/tools" },
}

const TOOLS = [
  { href: "/tools/dividend-goal", icon: Target, title: "월 배당금 목표 계산기", desc: "월 ○○만원 받으려면 얼마를 투자해야 할까?" },
  { href: "/tools/drip", icon: TrendingUp, title: "DRIP 복리 계산기", desc: "배당 재투자 시 10·20년 후 자산은 얼마?" },
  { href: "/tools/tax", icon: Receipt, title: "배당소득세 계산기", desc: "세금 떼고 실제로 받는 세후 배당금은?" },
  { href: "/tools/exchange", icon: ArrowLeftRight, title: "원달러 환율 계산기", desc: "원화↔달러 실시간 환산" },
  { href: "/tools/dividend-yield", icon: Percent, title: "배당수익률 계산기", desc: "주가·배당금으로 수익률 바로 계산" },
  { href: "/tools/risk-profile", icon: Compass, title: "투자 성향 테스트", desc: "나에게 맞는 배당 ETF 유형 찾기" },
]

export default function ToolsHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <span className="text-foreground font-medium">계산기</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">배당 투자 계산기 모음</h1>
        <p className="text-base text-muted-foreground mb-10 max-w-2xl">
          배당 투자에 꼭 필요한 계산기를 한곳에 모았습니다. 목표 배당금부터 복리 효과, 세후 실수령액, 환율까지 무료로 계산해 보세요.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map((t) => {
            const Icon = t.icon
            return (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-start gap-4 p-5 bg-card rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-foreground mb-1">{t.title}</div>
                  <div className="text-sm text-muted-foreground">{t.desc}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
