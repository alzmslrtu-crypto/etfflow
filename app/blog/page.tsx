import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import Link from 'next/link'
import { Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: '배당 ETF 투자 가이드 | ETF Flow 블로그',
  description: '배당 ETF 투자 기초부터 전략, 세금·절세, 종목 분석, FIRE 생활 설계까지. 한국 투자자를 위한 배당 투자 교육 콘텐츠를 카테고리별로 정리했습니다.',
  alternates: {
    canonical: 'https://www.etfflow.kr/blog',
  },
}

// 교육 허브 카테고리 순서·설명
const CATEGORY_ORDER: { name: string; desc: string }[] = [
  { name: '초보자 가이드', desc: '배당 ETF가 처음이라면 여기부터' },
  { name: 'ETF 비교', desc: '인기 ETF를 항목별로 비교 분석' },
  { name: '한국 ETF', desc: '국내 상장 배당·월배당 ETF 정보' },
  { name: '절세 가이드', desc: '배당소득세·연금·ISA 절세 전략' },
  { name: '생활 설계', desc: '월 배당 목표·FIRE·은퇴 인컴 설계' },
  { name: '수익 분석', desc: '배당금·수익률 계산과 분석' },
  { name: '투자 전략', desc: '포트폴리오 구성과 재투자 전략' },
]

export default function Blog() {
  // 카테고리별 그룹화
  const byCategory = new Map<string, typeof blogPosts>()
  for (const post of blogPosts) {
    const list = byCategory.get(post.category) || []
    list.push(post)
    byCategory.set(post.category, list)
  }

  // 정의된 순서 + 나머지 카테고리
  const orderedNames = CATEGORY_ORDER.map((c) => c.name)
  const remaining = [...byCategory.keys()].filter((c) => !orderedNames.includes(c))
  const sections = [
    ...CATEGORY_ORDER.filter((c) => byCategory.has(c.name)),
    ...remaining.map((name) => ({ name, desc: '' })),
  ]

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">배당 ETF 투자 가이드</h1>
          <p className="text-muted-foreground">
            기초부터 전략·세금·생활 설계까지, 한국 투자자를 위한 배당 투자 교육 콘텐츠를 주제별로 정리했습니다.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section) => {
            const posts = byCategory.get(section.name) || []
            if (posts.length === 0) return null
            return (
              <section key={section.name}>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{section.name}</h2>
                  {section.desc && <p className="text-sm text-muted-foreground mt-1">{section.desc}</p>}
                </div>
                <div className="grid gap-4">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group block p-5 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1.5">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}분
                        </span>
                        <span>{post.date}</span>
                      </div>
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
