import { ETFComparison } from "@/components/etf-comparison"
import Link from "next/link"
import { ArrowRight, BarChart3, Wallet, TrendingUp } from "lucide-react"
import { TickerLogo } from "@/components/ticker-logo"
import { ETF_DIRECTORY } from "@/lib/etf-directory"
import { FAQ_ITEMS } from "@/lib/faq"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Hero Section - Toss Style */}
      <div className="py-20 sm:py-28 md:py-36 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 inline-block px-3 py-1.5 bg-primary/10 rounded-full">
            <span className="text-sm font-semibold text-primary">ETF Flow</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            배당 ETF<br />
            <span className="text-primary">쉽게 비교</span>하고<br />
            수익을 계산해보세요
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
            국내·미국 ETF 수익률을 실시간으로 비교하는 ETF 비교 사이트. SCHD, JEPI, VOO 등 인기 ETF를 한눈에 비교하고 예상 배당금을 정확하게 계산합니다.
          </p>
          <Link 
            href="#compare"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            지금 비교하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* ETF Comparison Tool */}
      <div id="compare" className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <ETFComparison />
      </div>

      {/* Features Section */}
      <div className="py-20 sm:py-28 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              ETF Flow만의 특징
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              복잡한 투자 정보를 간단하고 명확하게 정리해 드립니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">실시간 비교 분석</h3>
              <p className="text-muted-foreground leading-relaxed">
                여러 배당 ETF의 수익률, 배당율, 주가를 한눈에 비교하고 트렌드를 파악하세요.
              </p>
            </div>

            <div className="p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Wallet className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">배당금 계산기</h3>
              <p className="text-muted-foreground leading-relaxed">
                투자금액을 입력하면 예상 배당금과 월별 수익을 자동으로 계산해 드립니다.
              </p>
            </div>

            <div className="p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">스마트 인사이트</h3>
              <p className="text-muted-foreground leading-relaxed">
                복리 효과를 극대화하는 전략과 배당금 재투자 팁을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular ETF Detail Links */}
      <div className="py-20 sm:py-28 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              인기 ETF 상세 정보
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              실시간 가격·배당수익률·배당월·운용보수를 종목별로 확인하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ETF_DIRECTORY.slice(0, 12).map((etf) => (
              <Link
                key={etf.symbol}
                href={`/etf/${encodeURIComponent(etf.symbol)}`}
                className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <TickerLogo symbol={etf.symbol} label={etf.name} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground truncate">{etf.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{etf.category}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              배당 투자 가이드
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ETF 초보자부터 경험자까지 모두 배워갈 수 있는 실용적인 정보를 제공합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/blog/etf-beginners-guide" className="group p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                <span className="text-xs font-semibold text-primary">입문</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                배당 ETF 완벽 가이드
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                배당 ETF란 무엇인지, 왜 투자해야 하는지 초보자를 위한 기본을 알아봅니다.
              </p>
              <span className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                자세히 보기 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link href="/blog/schd-vs-jepi" className="group p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                <span className="text-xs font-semibold text-primary">비교</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                SCHD vs JEPI 비교분석
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                인기 배당 ETF들의 수익률, 배당률, 변동성을 상세히 비교 분석합니다.
              </p>
              <span className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                자세히 보기 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link href="/blog/dividend-reinvestment" className="group p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                <span className="text-xs font-semibold text-primary">전략</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                배당금 재투자의 힘
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                복리 효과를 극대화하고 장기적인 자산을 축적하는 전략을 배워봅니다.
              </p>
              <span className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                자세히 보기 <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 sm:py-28 px-4 bg-white/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-lg text-muted-foreground">
              배당 ETF 투자에 대해 가장 많이 궁금해하시는 내용을 정리했습니다.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group bg-card rounded-2xl shadow-sm p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-foreground">
                  {item.question}
                  <span className="ml-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto">
            복잡한 ETF 분석은 이제 그만. ETF Flow로 쉽고 빠르게 비교하세요.
          </p>
          <Link 
            href="#compare"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-full font-bold hover:shadow-lg transition-all"
          >
            ETF 비교 시작하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
