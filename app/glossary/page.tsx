import type { Metadata } from "next"
import Link from "next/link"
import { GLOSSARY, type GlossaryTerm } from "@/lib/glossary"

export const metadata: Metadata = {
  title: "배당·ETF 투자 용어 사전 | ETF Flow",
  description:
    "배당락일, 분배금, NAV, 괴리율, 추적오차, 커버드콜, 총보수 등 배당 ETF 투자에 필요한 핵심 용어를 쉽게 풀어 설명합니다.",
  alternates: { canonical: "https://www.etfflow.kr/glossary" },
}

const CATEGORIES: GlossaryTerm["category"][] = ["배당", "ETF", "지표", "전략", "세금"]

export default function GlossaryIndexPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <span className="text-foreground font-medium">용어 사전</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">투자 용어 사전</h1>
        <p className="text-base text-muted-foreground mb-10 max-w-2xl">
          배당 ETF 투자에서 자주 나오는 용어를 초보자도 이해하기 쉽게 정리했습니다. 모르는 단어를 눌러 자세한 설명을 확인하세요.
        </p>

        <div className="space-y-10">
          {CATEGORIES.map((cat) => {
            const items = GLOSSARY.filter((t) => t.category === cat)
            if (items.length === 0) return null
            return (
              <section key={cat}>
                <h2 className="text-xl font-bold text-foreground mb-4">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/glossary/${t.slug}`}
                      className="block p-4 bg-card rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="font-semibold text-foreground mb-1">{t.term}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">{t.short}</div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}
