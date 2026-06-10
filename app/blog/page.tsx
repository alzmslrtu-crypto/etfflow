import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import Link from 'next/link'
import { Clock, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ETF Flow 블로그 | 배당 ETF 투자 가이드',
  description: '배당 ETF 투자 가이드, 분석, 그리고 시장 인사이트',
  alternates: {
    canonical: 'https://www.etfflow.kr/blog',
  },
}

export default function Blog() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">ETF Flow 블로그</h1>
          <p className="text-muted-foreground">
            배당 ETF 투자 가이드, 분석, 그리고 시장 인사이트
          </p>
        </div>

        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block p-6 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}분</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{post.category}</span>
                </div>
                <span>{post.date}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-secondary/50 rounded-lg border border-border">
          <h3 className="text-lg font-bold text-foreground mb-2">더 많은 콘텐츠를 기대해주세요!</h3>
          <p className="text-muted-foreground text-sm">
            ETF Flow는 정기적으로 배당 투자 가이드, 시장 분석, 포트폴리오 관리 팁을 공유합니다.
          </p>
        </div>
      </div>
    </main>
  )
}
