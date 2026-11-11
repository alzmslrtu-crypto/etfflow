// 배당 계산 경계 사례 점검: npx tsx scripts/check-dividend-calc.mts
import assert from "node:assert/strict"
import { trailingDividendInfo, dividendMonths, yearlyDividendTotals } from "../lib/dividend-calc.ts"

const d = (date: string, amount = 1) => ({ date, amount })
const now = new Date("2026-11-11")
const sum = (xs: { amount: number }[]) => xs.reduce((s, x) => s + x.amount, 0)

// 1) 월배당 + 최신 회차 지연(JEPI 실측 형태): 12회, 12월 2회(12-01, 12-31)
const jepi = ["2025-10-01","2025-11-03","2025-12-01","2025-12-31","2026-02-02","2026-03-02","2026-04-01","2026-05-01","2026-06-01","2026-07-01","2026-08-03","2026-09-01","2026-10-01"].map((x) => d(x))
let r = trailingDividendInfo(jepi, now)
assert.equal(r.frequency, 12); assert.equal(r.trailing.length, 12); assert.equal(r.trailing[0].date, "2025-11-03")
assert.deepEqual(dividendMonths(r.trailing, r.frequency).length, 12)

// 2) 분기배당, 1년 전 회차가 364일 전이어도 중복 안 됨
const q = ["2025-03-26","2025-06-25","2025-09-24","2025-12-10","2026-03-25","2026-06-24","2026-09-23"].map((x) => d(x))
r = trailingDividendInfo(q, now)
assert.equal(r.frequency, 4); assert.deepEqual(r.trailing.map((x) => x.date), ["2025-12-10","2026-03-25","2026-06-24","2026-09-23"])
assert.deepEqual(dividendMonths(r.trailing, r.frequency), [3, 6, 9, 12])

// 3) 분기 + 특별배당 1회: 주기는 분기 유지, 특별배당은 합계에 포함
r = trailingDividendInfo([...q.slice(0, 6), d("2026-07-15", 5), q[6]], now)
assert.equal(r.frequency, 4); assert.equal(sum(r.trailing), 4 + 5 - 0)

// 4) 배당 중단(마지막 월배당 8개월 전): 오늘 기준으로 잘라 과거 배당으로 부풀리지 않음
const stopped = Array.from({ length: 12 }, (_, i) => d(`2025-${String(i + 1).padStart(2, "0")}-01`))
r = trailingDividendInfo(stopped, now)
assert.deepEqual(r.trailing.map((x) => x.date), ["2025-12-01"]) // 오늘 기준 1년 안은 12월분 하나뿐

// 5) 1년 넘게 무배당: 0
r = trailingDividendInfo([d("2024-03-01"), d("2024-06-01"), d("2024-09-01")], now)
assert.equal(r.trailing.length, 0)

// 6) 주배당: 52
const weekly = Array.from({ length: 62 }, (_, i) => d(new Date(Date.parse("2025-09-01") + i * 7 * 86400000).toISOString().slice(0, 10)))
r = trailingDividendInfo(weekly, now)
assert.equal(r.frequency, 52); assert.ok(r.trailing.length >= 51 && r.trailing.length <= 53)

// 7) 연 1회 / 반기
r = trailingDividendInfo([d("2023-12-20"), d("2024-12-20"), d("2025-12-19")], now)
assert.equal(r.frequency, 1); assert.equal(r.trailing.length, 1)
r = trailingDividendInfo([d("2025-01-30"), d("2025-07-30"), d("2026-01-30"), d("2026-07-30")], now)
assert.equal(r.frequency, 2); assert.equal(r.trailing.length, 2)

// 8) 지급 1회뿐 / 빈 이력 / 0원 행
assert.equal(trailingDividendInfo([d("2026-10-01")], now).frequency, 0)
assert.equal(trailingDividendInfo([d("2026-10-01")], now).trailing.length, 1)
assert.deepEqual(trailingDividendInfo([], now), { trailing: [], frequency: 0 })
assert.equal(trailingDividendInfo([d("2026-10-01", 0)], now).trailing.length, 0)

// 9) 정렬 안 된 입력
r = trailingDividendInfo([...q].reverse(), now)
assert.equal(r.trailing.length, 4)

// 10) 연도별: 올해=current, 중간 상장 첫해=start, 빈 해는 0으로 채움
let y = yearlyDividendTotals([d("2023-07-28"), d("2023-08-30"), d("2025-01-30"), d("2026-01-30")], 12, 2021, now)
assert.deepEqual(y.map((x) => [x.year, x.amount, x.partial]), [[2023, 2, "start"], [2024, 0, null], [2025, 1, null], [2026, 1, "current"]])
// 이력 시작 연도부터 있던 종목의 첫해는 온전한 해
y = yearlyDividendTotals([d("2021-03-01"), d("2022-03-01")], 4, 2021, now)
assert.equal(y[0].partial, null)
// 분기 종목이 3월에 첫 지급 → 온전한 해(12/4=3월 이내)
y = yearlyDividendTotals([d("2023-03-25"), d("2024-03-25")], 4, 2021, now)
assert.equal(y[0].partial, null)
assert.deepEqual(yearlyDividendTotals([], 12, 2021, now), [])

console.log("dividend-calc OK")
