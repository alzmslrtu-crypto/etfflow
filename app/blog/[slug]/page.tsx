import { blogPosts } from '@/lib/blog-posts'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Generate static params for all blog posts
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return {
      title: '페이지를 찾을 수 없습니다',
    }
  }

  const url = `https://www.etfflow.kr/blog/${post.slug}`

  return {
    title: `${post.title} | ETF Flow 블로그`,
    description: post.excerpt,
    keywords: [`ETF`, `배당`, post.category, ...post.title.split(' ')],
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      siteName: 'ETF Flow',
      locale: 'ko_KR',
      publishedTime: post.date,
    },
    alternates: {
      canonical: url,
    },
  }
}

// Parse inline formatting (bold, etc.)
function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Check for bold **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>)
      }
      parts.push(<strong key={key++} className="font-semibold text-foreground">{boldMatch[1]}</strong>)
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length)
      continue
    }
    
    // No more matches, add remaining text
    parts.push(<span key={key++}>{remaining}</span>)
    break
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}

// Parse markdown table
function parseTable(lines: string[], startIdx: number): { element: React.ReactNode; endIdx: number } {
  const tableLines: string[] = []
  let idx = startIdx

  while (idx < lines.length && lines[idx].trim().startsWith('|')) {
    tableLines.push(lines[idx])
    idx++
  }

  if (tableLines.length < 2) {
    return { element: null, endIdx: startIdx }
  }

  const parseRow = (line: string) => {
    return line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim())
  }

  const headers = parseRow(tableLines[0])
  const dataRows = tableLines.slice(2).map(parseRow) // Skip header and separator

  return {
    element: (
      <div key={`table-${startIdx}`} className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {headers.map((header, i) => (
                <th key={i} className="px-4 py-3 text-left font-semibold text-foreground">
                  {parseInline(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-border/50 hover:bg-muted/30">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3 text-muted-foreground">
                    {parseInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    endIdx: idx - 1,
  }
}

function renderMarkdown(content: string, headings: { id: string; text: string }[]) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Empty line
    if (!trimmed) {
      elements.push(<div key={i} className="h-2" />)
      i++
      continue
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-3xl font-bold text-foreground mt-8 mb-4">
          {parseInline(trimmed.slice(2))}
        </h1>
      )
      i++
      continue
    }
    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3).replace(/\*\*/g, '').trim()
      const id = `section-${headings.length}`
      headings.push({ id, text })
      elements.push(
        <h2 key={i} id={id} className="text-2xl font-bold text-foreground mt-6 mb-3 scroll-mt-20">
          {parseInline(trimmed.slice(3))}
        </h2>
      )
      i++
      continue
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-foreground mt-4 mb-2">
          {parseInline(trimmed.slice(4))}
        </h3>
      )
      i++
      continue
    }

    // Table
    if (trimmed.startsWith('|')) {
      const { element, endIdx } = parseTable(lines, i)
      if (element) {
        elements.push(element)
        i = endIdx + 1
        continue
      }
    }

    // Unordered list
    if (trimmed.startsWith('- ')) {
      elements.push(
        <li key={i} className="list-disc list-inside text-muted-foreground mb-2 ml-4">
          {parseInline(trimmed.slice(2))}
        </li>
      )
      i++
      continue
    }

    // Ordered list
    if (trimmed.match(/^\d+\. /)) {
      elements.push(
        <li key={i} className="list-decimal list-inside text-muted-foreground mb-2 ml-4">
          {parseInline(trimmed.replace(/^\d+\. /, ''))}
        </li>
      )
      i++
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
        {parseInline(trimmed)}
      </p>
    )
    i++
  }

  return elements
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  // 함께 보면 좋은 글: 같은 카테고리 우선, 부족하면 다른 글로 채움 (내부 링크)
  const sameCat = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category)
  const others = blogPosts.filter((p) => p.slug !== post.slug && p.category !== post.category)
  const related = [...sameCat, ...others].slice(0, 4)

  const url = `https://www.etfflow.kr/blog/${post.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'ko-KR',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Organization',
      name: 'ETF Flow 편집팀',
      url: 'https://www.etfflow.kr/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ETF Flow',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.etfflow.kr/etf-flow-logo.png',
      },
    },
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          블로그로 돌아가기
        </Link>

        <article>
          <header className="mb-8 pb-6 border-b border-border">
            <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <User className="w-4 h-4" />
                ETF Flow 편집팀
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}분 읽기
              </span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">{post.category}</span>
            </div>
          </header>

          {(() => {
            const headings: { id: string; text: string }[] = []
            const body = renderMarkdown(post.content, headings)
            return (
              <>
                {headings.length >= 3 && (
                  <nav className="mb-8 rounded-2xl bg-secondary/30 p-5">
                    <div className="text-sm font-bold text-foreground mb-3">목차</div>
                    <ul className="space-y-1.5">
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a href={`#${h.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
                <div className="prose max-w-none space-y-1 mb-12">{body}</div>
              </>
            )
          })()}

          {/* 함께 보면 좋은 글 */}
          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">함께 보면 좋은 글</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="block p-4 bg-card rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="text-xs text-primary font-medium mb-1">{p.category}</div>
                    <div className="font-semibold text-foreground leading-snug mb-1 line-clamp-2">{p.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{p.excerpt}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">ETF Flow</h3>
                <p className="text-sm text-muted-foreground">
                  배당 ETF 투자자를 위한 실시간 비교 분석 플랫폼
                </p>
              </div>
              <Link href="/" className="text-primary hover:underline text-sm whitespace-nowrap">
                홈으로 이동
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </main>
  )
}
