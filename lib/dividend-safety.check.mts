import { getDividendSafety } from './dividend-safety.ts'
import assert from 'node:assert'

const thisYear = new Date().getFullYear()
for (const sym of ['SCHD', 'JEPI', 'QYLD', '458730.KS', '379800.KS']) {
  const r = await getDividendSafety(sym)
  if (!r) { console.log(sym.padEnd(11), 'FETCH FAIL'); continue }
  if (!r.sufficient) {
    console.log(sym.padEnd(11), `평가보류 (완전연도 ${r.years.length}개)`)
    continue
  }
  console.log(
    sym.padEnd(11),
    `${r.from}~${r.to}`,
    '| CAGR', String(r.cagr).padStart(7),
    '| 삭감', r.cutCount, `(최대 ${r.worstCut}%)`,
    '| 주가', String(r.priceReturn).padStart(7),
    '| 배당', String(r.dividendReturn).padStart(6),
    '| 합계', String(r.totalReturn).padStart(7),
    '|', r.years.map(y => `${y.year}:${y.total}`).join(' ')
  )
  // 불변식 검증
  assert(r.to === thisYear - 1, `${sym}: 올해가 평가구간에 들어감`)
  assert(r.years.length >= 3, `${sym}: 완전연도 부족한데 sufficient`)
  assert(r.years.every(y => y.year >= r.from && y.year <= r.to), `${sym}: 구간 밖 연도`)
  assert(Math.abs(r.totalReturn - (r.priceReturn + r.dividendReturn)) < 0.02, `${sym}: 합계 불일치`)
  assert(r.cutCount === 0 || r.worstCut > 0, `${sym}: 삭감인데 폭이 0`)
}
console.log('\n불변식 통과')

// 앞쪽 무배당 연도가 잘리는지 확인
const late = await getDividendSafety('379800.KS')
assert(late && !late.sufficient, '379800.KS: 배당 시작 1년차인데 평가 대상이 됨')
console.log('379800.KS 재확인 → 평가보류 (지급연도', late.years.length, '개)')

// 월배당 경계 왜곡 보정 — 지급 횟수가 흔들려도 삭감으로 오판정하지 않는다
for (const [sym, expectCut] of [['O', 0], ['SCHD', 0], ['T', 2], ['STAG', 0]] as [string, number][]) {
  const r = await getDividendSafety(sym)
  if (r?.sufficient) assert(r.cutCount === expectCut, `${sym}: 삭감 ${r.cutCount}회, 기대 ${expectCut}회`)
}
console.log('연환산 보정 통과 (O 월배당 삭감 오판정 회귀 방지)')
