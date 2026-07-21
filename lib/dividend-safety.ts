// 배당 지속성 지표. 실제 지급 이력에서 성장률·삭감·원금 회복 여부를 계산한다.
//
// 점수(0~100)를 만들지 않는다. 가중치가 임의라 근거를 댈 수 없고,
// 금융 정보에서 출처 없는 종합점수는 오히려 신뢰를 깎는다. 원자료만 낸다.
import YahooFinance from "yahoo-finance2"

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey", "ripHistorical"] })

export type DividendSafety = {
  symbol: string
  /** 완전한 달력 연도별 1주당 배당 합계 */
  years: { year: number; total: number }[]
  /** 배당 CAGR(%). 첫 해 배당이 0이면 계산 불가라 null */
  cagr: number | null
  /** 전년 대비 배당이 줄어든 해의 수 */
  cutCount: number
  /** 가장 큰 연간 감소폭(%). 삭감이 없으면 0 */
  worstCut: number
  /** 평가 구간의 주가 수익률(%) */
  priceReturn: number
  /** 평가 구간에 지급된 1주당 배당 합계를 기초가로 나눈 값(%) */
  dividendReturn: number
  /** 주가 변동 + 지급 배당. 재투자·세금·환율은 반영하지 않는다 */
  totalReturn: number
  /** 평가 구간 (완전 연도 기준) */
  from: number
  to: number
  /** 완전 연도가 3개 미만이면 평가하지 않는다 */
  sufficient: boolean
}

const round = (n: number) => Math.round(n * 100) / 100

/** 최빈값. 동률이면 더 큰 값(정상 지급 횟수는 보통 최대치라 경계로 빠진 해를 배제). */
function mode(nums: number[]): number {
  const freq = new Map<number, number>()
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1)
  let best = nums[0]
  let bestFreq = 0
  for (const [n, f] of freq) {
    if (f > bestFreq || (f === bestFreq && n > best)) {
      best = n
      bestFreq = f
    }
  }
  return best
}

/**
 * 한 종목의 배당 지속성 지표. 데이터가 모자라면 sufficient=false로 돌려주고
 * 호출부가 "평가 보류"로 표시한다. 억지로 점수를 매기지 않는다.
 */
export async function getDividendSafety(symbol: string): Promise<DividendSafety | null> {
  // 완전한 달력 연도 5개를 확보하려면 6년치를 받아야 한다.
  // (5년만 받으면 시작 연도가 잘려 4개만 남는다)
  const period1 = new Date()
  period1.setFullYear(period1.getFullYear() - 6)

  let chart
  try {
    chart = await yahooFinance.chart(symbol, {
      period1,
      period2: new Date(),
      interval: "1mo",
      events: "div",
    })
  } catch {
    return null
  }

  const quotes = (chart.quotes ?? []).filter((q) => q.close != null && q.close > 0)
  const dividends = chart.events?.dividends ?? []
  if (quotes.length === 0) return null

  // 평가 구간: 데이터가 연초부터 있는 첫 해 ~ 작년.
  // 올해는 아직 배당이 다 나오지 않아 그대로 쓰면 전 종목이 삭감으로 잡힌다.
  const firstDataYear = new Date(quotes[0].date).getFullYear()
  const from = firstDataYear + 1
  const to = new Date().getFullYear() - 1

  const empty = { symbol, years: [], cagr: null, cutCount: 0, worstCut: 0, priceReturn: 0, dividendReturn: 0, totalReturn: 0, from, to, sufficient: false }
  if (to < from) return empty

  // 연도별 배당 합계와 지급 횟수
  const byYear = new Map<number, number>()
  const countByYear = new Map<number, number>()
  for (let y = from; y <= to; y++) {
    byYear.set(y, 0)
    countByYear.set(y, 0)
  }
  for (const d of dividends) {
    const y = new Date(d.date).getFullYear()
    if (y >= from && y <= to) {
      byYear.set(y, (byYear.get(y) ?? 0) + (d.amount ?? 0))
      countByYear.set(y, (countByYear.get(y) ?? 0) + 1)
    }
  }

  // 지급 횟수 정규화(연환산). 월배당 종목은 배당락일이 연말·연초 경계를 넘나들며
  // 한 해에 11번, 다음 해에 13번 잡힌다. 그대로 합산하면 매달 배당을 올린
  // 종목(리얼티인컴 등)이 삭감으로 오판정된다. 회당 평균 × 표준 지급횟수로
  // 연환산해 이 경계 왜곡을 없앤다. 표준 횟수는 관측된 최빈 횟수를 쓴다.
  const counts = [...countByYear.values()].filter((c) => c > 0)
  const standardCount = counts.length ? mode(counts) : 0
  const all = [...byYear.entries()].map(([year, total]) => {
    const count = countByYear.get(year) ?? 0
    // 정상 횟수만큼 지급된 해는 그대로, 경계로 어긋난 해만 회당 평균으로 보정한다.
    const annualized =
      count > 0 && standardCount > 0 && count !== standardCount
        ? (total / count) * standardCount
        : total
    return { year, total: round(annualized) }
  })

  // 배당을 시작하기 전 연도는 잘라낸다. 안 자르면 "0, 0, 0, 270"이 삭감 0회로 잡혀
  // 최근에 배당을 시작한 ETF가 오래 안정적으로 준 ETF처럼 보인다.
  // 뒤쪽 0은 남긴다 — 지급을 멈춘 것은 그 자체가 알려야 할 사실이다.
  const firstPaid = all.findIndex((y) => y.total > 0)
  const years = firstPaid === -1 ? [] : all.slice(firstPaid)

  // 실제 지급 연도가 3개 미만이면 평가하지 않는다.
  if (years.length < 3) return { ...empty, years, from: years[0]?.year ?? from }

  // 배당 CAGR — 첫 해가 0이면 성장률을 정의할 수 없다.
  const first = years[0].total
  const last = years[years.length - 1].total
  const cagr =
    first > 0 ? round((Math.pow(last / first, 1 / (years.length - 1)) - 1) * 100) : null

  // 삭감: 전년보다 줄어든 해
  let cutCount = 0
  let worstCut = 0
  for (let i = 1; i < years.length; i++) {
    const prev = years[i - 1].total
    if (prev > 0 && years[i].total < prev) {
      cutCount++
      worstCut = Math.max(worstCut, ((prev - years[i].total) / prev) * 100)
    }
  }

  // 주가·배당 수익률은 배당 지표와 같은 구간에서 계산해야 표가 일관된다.
  const startYear = years[0].year
  const inRange = quotes.filter((q) => {
    const y = new Date(q.date).getFullYear()
    return y >= startYear && y <= to
  })
  const startPrice = inRange[0]?.close ?? 0
  const endPrice = inRange[inRange.length - 1]?.close ?? 0
  const paid = years.reduce((sum, y) => sum + y.total, 0)

  const priceReturn = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0
  const dividendReturn = startPrice > 0 ? (paid / startPrice) * 100 : 0

  return {
    symbol,
    years,
    cagr,
    cutCount,
    worstCut: round(worstCut),
    priceReturn: round(priceReturn),
    dividendReturn: round(dividendReturn),
    totalReturn: round(priceReturn + dividendReturn),
    from: startYear,
    to,
    sufficient: true,
  }
}

/** 여러 종목을 5개씩 나눠 조회한다(야후 동시 호출 제한 회피). */
export async function getDividendSafetyBatch(symbols: string[]): Promise<DividendSafety[]> {
  const out: DividendSafety[] = []
  for (let i = 0; i < symbols.length; i += 5) {
    const chunk = await Promise.all(symbols.slice(i, i + 5).map(getDividendSafety))
    out.push(...chunk.filter((r): r is DividendSafety => r !== null))
  }
  return out
}
