"use client"

import { useState } from "react"
import Link from "next/link"
import { RotateCcw, ArrowRight } from "lucide-react"

type Question = { q: string; options: { label: string; score: number }[] }

const QUESTIONS: Question[] = [
  {
    q: "투자에서 가장 중요하게 생각하는 것은?",
    options: [
      { label: "원금을 잃지 않는 안정성", score: 1 },
      { label: "안정성과 수익의 균형", score: 2 },
      { label: "높은 수익이라면 변동성도 감수", score: 3 },
    ],
  },
  {
    q: "내 투자금이 1년 만에 -20% 됐다면?",
    options: [
      { label: "불안해서 바로 팔 것 같다", score: 1 },
      { label: "지켜보며 상황을 본다", score: 2 },
      { label: "오히려 추가 매수 기회로 본다", score: 3 },
    ],
  },
  {
    q: "배당 투자에서 더 끌리는 쪽은?",
    options: [
      { label: "꾸준하고 안정적인 배당", score: 1 },
      { label: "배당 성장 + 적당한 주가 상승", score: 2 },
      { label: "높은 분배율(커버드콜 등)", score: 3 },
    ],
  },
  {
    q: "예상 투자 기간은?",
    options: [
      { label: "3년 이내(단기)", score: 1 },
      { label: "3~10년(중기)", score: 2 },
      { label: "10년 이상 장기", score: 3 },
    ],
  },
  {
    q: "월 현금흐름 vs 자산 성장, 우선순위는?",
    options: [
      { label: "지금 받는 월 현금흐름", score: 1 },
      { label: "둘 다 적절히", score: 2 },
      { label: "장기 자산 성장 우선", score: 3 },
    ],
  },
]

type Result = {
  type: string
  desc: string
  picks: string
  examples: string[]
}

function resultFor(total: number): Result {
  if (total <= 7) {
    return {
      type: "안정형",
      desc: "변동성을 줄이고 꾸준한 배당을 선호하는 성향입니다. 고배당·저변동성, 배당이 안정적인 ETF가 잘 맞습니다.",
      picks: "고배당·저변동성, 월배당 중심",
      examples: ["SCHD", "VYM", "458730.KS"],
    }
  }
  if (total <= 11) {
    return {
      type: "균형형",
      desc: "안정성과 성장을 함께 추구하는 성향입니다. 배당 성장 ETF와 지수 ETF를 섞은 코어-새틀라이트 구성이 적합합니다.",
      picks: "배당성장 + 대표지수 혼합",
      examples: ["SCHD", "VOO", "DGRW"],
    }
  }
  return {
    type: "공격형",
    desc: "높은 수익을 위해 변동성을 감수하는 성향입니다. 성장형 지수와 높은 분배율(커버드콜) ETF에 관심을 가질 만합니다.",
    picks: "성장지수 + 커버드콜 고분배",
    examples: ["QQQ", "JEPQ", "DIVO"],
  }
}

export function RiskProfileTest() {
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(0))
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = answers.every((a) => a > 0)
  const total = answers.reduce((s, a) => s + a, 0)
  const result = resultFor(total)

  const reset = () => {
    setAnswers(Array(QUESTIONS.length).fill(0))
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <div className="text-sm text-muted-foreground mb-1">당신의 투자 성향은</div>
          <div className="text-3xl font-bold text-primary mb-3">{result.type}</div>
          <p className="text-sm text-foreground/80 leading-relaxed mb-4">{result.desc}</p>
          <div className="text-sm font-medium text-foreground mb-2">추천 방향: {result.picks}</div>
          <div className="flex flex-wrap justify-center gap-2">
            {result.examples.map((sym) => (
              <Link
                key={sym}
                href={`/etf/${encodeURIComponent(sym)}`}
                className="px-3 py-1.5 rounded-full bg-card border border-border text-sm font-semibold text-foreground hover:border-primary/50 transition-colors"
              >
                {sym.replace(/\.(KS|KQ)$/, "")}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full border border-border text-foreground font-semibold hover:bg-secondary/50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> 다시 하기
          </button>
          <Link
            href="/#compare"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            ETF 비교하기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          이 테스트는 간단한 참고용이며 투자 권유가 아닙니다. 실제 투자 성향은 더 다양한 요소로 결정되며, 추천 종목은 예시일 뿐입니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {QUESTIONS.map((question, qi) => (
        <div key={qi} className="rounded-2xl border border-border bg-card p-5">
          <div className="font-semibold text-foreground mb-3">
            <span className="text-primary">Q{qi + 1}.</span> {question.q}
          </div>
          <div className="space-y-2">
            {question.options.map((opt, oi) => {
              const selected = answers[qi] === opt.score
              return (
                <button
                  key={oi}
                  onClick={() => {
                    const next = [...answers]
                    next[qi] = opt.score
                    setAnswers(next)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                    selected ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <button
        onClick={() => setSubmitted(true)}
        disabled={!allAnswered}
        className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {allAnswered ? "결과 보기" : `질문에 답해주세요 (${answers.filter((a) => a > 0).length}/${QUESTIONS.length})`}
      </button>
    </div>
  )
}
