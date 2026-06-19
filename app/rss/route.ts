import { blogPosts } from "@/lib/blog-posts"

const BASE = "https://www.etfflow.kr"

// XML 특수문자 이스케이프
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function GET() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const lastBuild = posts[0] ? new Date(posts[0].date).toUTCString() : new Date(0).toUTCString()

  const items = posts
    .map((p) => {
      const url = `${BASE}/blog/${p.slug}`
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(p.excerpt)}</description>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ETF Flow 블로그 — 배당 ETF 투자 가이드</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/rss" rel="self" type="application/rss+xml" />
    <description>배당 ETF 비교, 세후 배당 계산, 투자 전략 가이드를 제공합니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  })
}
