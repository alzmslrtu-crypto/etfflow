import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { GLOSSARY, getTerm, getRelatedTerms } from "@/lib/glossary"

const BASE_URL = "https://www.etfflow.kr"

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const term = getTerm(slug)
  if (!term) return { title: "용어 사전 | ETF Flow" }
  const title = `${term.term}이란? 뜻과 설명 | ETF Flow 용어사전`
  const description = `${term.term} - ${term.short}. ${term.description.slice(0, 80)}`
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/glossary/${term.slug}` },
    openGraph: { title, description, url: `${BASE_URL}/glossary/${term.slug}`, type: "article" },
    // 짧은 용어 페이지는 색인 제외(scaled content 감점 방지), 용어 사전 허브(/glossary)만 색인
    robots: { index: false, follow: true },
  }
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const term = getTerm(slug)
  if (!term) notFound()
  const related = getRelatedTerms(slug)

  // 용어 정의 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.description,
    inDefinedTermSet: `${BASE_URL}/glossary`,
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <Link href="/glossary" className="hover:text-primary transition-colors">용어 사전</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{term.term}</span>
        </nav>

        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary mb-3">
          {term.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{term.term}</h1>
        <p className="text-lg text-foreground/90 mb-6">{term.short}</p>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 mb-10">
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">{term.description}</p>
        </div>

        <Link
          href="/#compare"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all mb-12"
        >
          배당 ETF 비교하러 가기
          <ArrowRight className="w-5 h-5" />
        </Link>

        {related.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">관련 용어</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  href={`/glossary/${t.slug}`}
                  className="block p-4 bg-card rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="font-semibold text-foreground mb-0.5">{t.term}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{t.short}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
