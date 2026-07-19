import type { Metadata } from 'next'
import Link from 'next/link'
import { AUTHOR } from '@/lib/author'

export const metadata: Metadata = {
  title: `${AUTHOR.name} — 운영자 소개 | ETF Flow`,
  description: `ETF Flow를 운영하는 ${AUTHOR.name}의 소개와 편집 방침. 데이터 출처, 글을 쓰는 기준, 연락 방법을 밝힙니다.`,
  alternates: { canonical: 'https://www.etfflow.kr/author' },
}

export default function AuthorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    description: AUTHOR.title,
    email: AUTHOR.email,
    url: AUTHOR.url,
    worksFor: { '@type': 'Organization', name: 'ETF Flow', url: 'https://www.etfflow.kr' },
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <span className="text-foreground font-medium">운영자 소개</span>
        </nav>

        <h1 className="text-4xl font-bold text-foreground mb-2">{AUTHOR.name}</h1>
        <p className="text-base text-primary font-medium mb-8">{AUTHOR.title}</p>

        <div className="space-y-6 text-muted-foreground">
          <section className="space-y-4">
            {AUTHOR.bio.map((p, i) => (
              <p key={i} className="leading-relaxed">{p}</p>
            ))}
          </section>

          <section className="bg-muted/30 p-5 rounded-lg">
            <h2 className="text-xl font-bold text-foreground mb-3">편집·데이터 방침</h2>
            <ul className="space-y-2 list-disc list-inside">
              {AUTHOR.policy.map((p, i) => (
                <li key={i} className="leading-relaxed">{p}</li>
              ))}
            </ul>
          </section>

          <section className="bg-muted/30 p-5 rounded-lg">
            <h2 className="text-xl font-bold text-foreground mb-3">연락처</h2>
            <p>
              데이터 오류 신고, 정정 요청, 기능 제안은{' '}
              <a href={`mailto:${AUTHOR.email}`} className="text-primary hover:underline">
                {AUTHOR.email}
              </a>
              로 보내주세요. 확인 후 본문을 수정하고 수정일을 표시합니다.
            </p>
          </section>

          <section className="border border-yellow-500/30 bg-yellow-500/10 p-5 rounded-lg">
            <h2 className="text-xl font-bold text-foreground mb-3">면책</h2>
            <p className="leading-relaxed text-sm">
              운영자는 금융 자격증 보유자나 투자 전문가가 아닙니다. ETF Flow의 모든 글과 계산 결과는
              교육·정보 제공 목적이며 투자 자문이나 특정 상품 권유가 아닙니다. 투자 판단과 그 결과에 대한
              책임은 투자자 본인에게 있습니다.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg transition-all">
            글 목록 보기
          </Link>
          <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full font-semibold text-foreground hover:border-primary/50 transition-all">
            서비스 소개
          </Link>
        </div>
      </div>
    </main>
  )
}
