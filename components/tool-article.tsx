import type { ReactNode } from "react"

export type ToolSection = {
  heading: string
  body: ReactNode
}

export type ToolFaq = {
  q: string
  a: string
}

/**
 * 계산기 페이지 하단에 붙는 설명·FAQ 아티클.
 * 정적(서버 렌더링) 텍스트를 충분히 제공해 검색엔진·광고 심사에서
 * "기능만 있고 콘텐츠 없는 페이지"로 분류되지 않도록 한다.
 * faqs를 넘기면 FAQPage 구조화 데이터(JSON-LD)도 함께 출력한다.
 */
export function ToolArticle({
  sections,
  faqs,
}: {
  sections: ToolSection[]
  faqs?: ToolFaq[]
}) {
  const faqLd = faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null

  return (
    <article className="mt-14 border-t border-border pt-10 space-y-10">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2 className="text-2xl font-bold text-foreground mb-4">{s.heading}</h2>
          <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">
            {s.body}
          </div>
        </section>
      ))}

      {faqs?.length ? (
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">자주 묻는 질문</h2>
          <dl className="space-y-5">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                <dt className="font-semibold text-foreground mb-2">Q. {f.q}</dt>
                <dd className="text-[15px] leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <p className="text-xs text-muted-foreground/80 border-t border-border pt-6">
        본 계산기와 설명은 교육 및 정보 제공 목적으로만 제공되며, 투자 자문이나 투자 권유가 아닙니다.
        세율·환율·배당률 등은 변동될 수 있으므로 실제 투자·세무 판단 전 최신 정보와 전문가 상담을 병행하시기 바랍니다.
      </p>

      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
    </article>
  )
}
