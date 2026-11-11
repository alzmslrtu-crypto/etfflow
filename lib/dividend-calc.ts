// 배당 이력 계산(순수 함수). 서버(etf-quote)와 클라이언트 차트가 같이 쓴다.
// yahoo-finance2를 import하지 않으므로 클라이언트 번들에 넣어도 된다.

export type Dividend = { date: string; amount: number }

const DAY = 86_400_000

/**
 * 최근 1년 배당과 연 지급 횟수.
 *
 * - 지급 주기: 최근 7회(간격 6개)의 간격 중앙값으로 판정한다. 특별배당 1회가 끼어도
 *   중앙값은 흔들리지 않고, 분기→월배당 전환도 1년 안에 따라간다.
 * - 1년 창의 기준점: '오늘'이 아니라 '마지막 배당락일'. 야후는 최신 배당을 며칠 늦게
 *   반영해서 오늘 기준으로 자르면 월배당 ETF가 11회로 잡힌다(JEPI 2026-11 실측).
 *   창 시작을 1년 전 + 간격의 절반으로 둬서 1년 전 같은 회차가 중복으로 들어가지 않게 한다.
 * - 다음 회차가 간격의 1.5배 + 10일을 넘게 안 나왔으면 지연이 아니라 미지급으로 보고
 *   오늘 기준 1년으로 자른다(배당을 멈춘 종목이 과거 배당으로 부풀려지지 않게).
 */
export function trailingDividendInfo(history: Dividend[], now: Date): { trailing: Dividend[]; frequency: number } {
  const sorted = history.filter((d) => d.amount > 0).sort((a, b) => a.date.localeCompare(b.date))
  if (sorted.length === 0) return { trailing: [], frequency: 0 }

  const times = sorted.map((d) => Date.parse(d.date))
  const last = times[times.length - 1]
  const recent = times.slice(-7)
  const gaps = recent.slice(1).map((t, i) => t - recent[i]).sort((a, b) => a - b)
  const gap = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0

  const frequency =
    gap === 0 ? 0 : gap < 10 * DAY ? 52 : gap < 45 * DAY ? 12 : gap < 135 * DAY ? 4 : gap < 270 * DAY ? 2 : 1

  const overdue = gap === 0 || now.getTime() - last > gap * 1.5 + 10 * DAY
  const start = overdue ? now.getTime() - 365 * DAY : last - 365 * DAY + gap / 2
  const trailing = sorted.filter((_, i) => times[i] > start)
  return { trailing, frequency }
}

/** 배당락일이 속한 달(1~12) 목록. 월·주배당은 12개월 전부. */
export function dividendMonths(trailing: Dividend[], frequency: number): number[] {
  if (frequency >= 12) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  return [...new Set(trailing.map((d) => parseInt(d.date.slice(5, 7))))].sort((a, b) => a - b)
}

/**
 * 연도별 1주당 배당 합계. 그대로 그리면 삭감처럼 보이는 두 해를 표시한다.
 * - current: 올해. 아직 남은 회차가 있다.
 * - start: 이력 중간에 배당을 시작한 해(신규 상장 등). 그해 첫 지급이 정상 첫 회차보다
 *   늦으면 일부 회차만 있는 해다. (이력은 1월 1일부터 받으므로 맨 첫해 자체는 온전하다)
 */
export function yearlyDividendTotals(
  history: Dividend[],
  frequency: number,
  historyStartYear: number,
  now: Date,
): { year: number; amount: number; partial: "start" | "current" | null }[] {
  const totals = new Map<number, number>()
  let firstDate = ""
  for (const d of history) {
    if (!(d.amount > 0)) continue
    const y = parseInt(d.date.slice(0, 4))
    totals.set(y, (totals.get(y) ?? 0) + d.amount)
    if (!firstDate || d.date < firstDate) firstDate = d.date
  }
  if (!firstDate) return []

  const firstYear = parseInt(firstDate.slice(0, 4))
  const firstMonth = parseInt(firstDate.slice(5, 7))
  const startPartial = firstYear > historyStartYear && frequency > 0 && firstMonth > 12 / frequency
  const currentYear = now.getFullYear()
  const lastYear = Math.max(...totals.keys())

  // 중간에 한 해를 통째로 건너뛴 경우 막대가 사라지지 않고 0으로 보이게 채운다.
  const out: { year: number; amount: number; partial: "start" | "current" | null }[] = []
  for (let year = firstYear; year <= lastYear; year++) {
    out.push({
      year,
      amount: totals.get(year) ?? 0,
      partial: year === currentYear ? "current" : year === firstYear && startPartial ? "start" : null,
    })
  }
  return out
}
