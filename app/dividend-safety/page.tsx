import type { Metadata } from "next"
import Link from "next/link"
import { ETF_DIRECTORY, resolveEtfInfo } from "@/lib/etf-directory"
import { getDividendSafetyBatch, type DividendSafety } from "@/lib/dividend-safety"
import { ToolArticle } from "@/components/tool-article"

export const metadata: Metadata = {
  title: "배당 삭감 이력·배당 성장률 비교 — 배당 ETF 지속성 점검 | ETF Flow",
  description:
    "SCHD·JEPI·QYLD 등 배당 ETF가 최근 5년간 배당을 실제로 늘렸는지 줄였는지, 삭감은 몇 번이었는지 실제 지급 이력으로 확인합니다. 분배금을 합쳐도 원금이 회복됐는지까지 함께 봅니다.",
  alternates: { canonical: "https://www.etfflow.kr/dividend-safety" },
}

// 배당 이력은 자주 바뀌지 않는다. 하루 한 번 갱신.
export const revalidate = 86400

function pct(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`
}

export default async function DividendSafetyPage() {
  const rows = await getDividendSafetyBatch(ETF_DIRECTORY.map((e) => e.symbol))

  const rated = rows
    .filter((r) => r.sufficient)
    .sort((a, b) => (b.cagr ?? -999) - (a.cagr ?? -999))
  const pending = rows.filter((r) => !r.sufficient)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <span>/</span>
          <span className="text-foreground font-medium">배당 지속성</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          배당 삭감 이력과 배당 성장률
        </h1>
        <p className="text-base text-muted-foreground mb-8 leading-relaxed">
          지금 배당수익률이 높다는 것과 앞으로도 그 배당이 나온다는 것은 다른 이야기입니다.
          아래 표는 각 ETF가 <strong className="text-foreground">실제로 지급한 배당 이력</strong>만 놓고
          배당을 늘렸는지 줄였는지, 삭감은 몇 번이었는지를 계산한 것입니다. 추정치나 예상치가 아닙니다.
        </p>

        {rated.length === 0 ? (
          <div className=" border border-border bg-card p-6 text-center text-muted-foreground">
            데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        ) : (
          <div className="overflow-x-auto border border-border bg-card mb-4">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left font-medium p-3">ETF</th>
                  <th className="text-right font-medium p-3">배당 성장률<br /><span className="text-xs font-normal">연평균</span></th>
                  <th className="text-right font-medium p-3">삭감</th>
                  <th className="text-right font-medium p-3">주가 변동</th>
                  <th className="text-right font-medium p-3">받은 배당</th>
                  <th className="text-right font-medium p-3">합계</th>
                </tr>
              </thead>
              <tbody>
                {rated.map((r) => (
                  <tr key={r.symbol} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <Link
                        href={`/etf/${encodeURIComponent(r.symbol)}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {resolveEtfInfo(r.symbol).name}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {r.symbol} · {r.from}~{r.to}
                      </div>
                    </td>
                    <td className={`p-3 text-right tabular-nums font-semibold ${
                      r.cagr === null ? "text-muted-foreground" : r.cagr >= 0 ? "text-foreground" : "text-stock-down"
                    }`}>
                      {r.cagr === null ? "—" : pct(r.cagr)}
                    </td>
                    <td className="p-3 text-right tabular-nums">
                      {r.cutCount === 0 ? (
                        <span className="text-muted-foreground">없음</span>
                      ) : (
                        <span className="text-stock-down font-medium">
                          {r.cutCount}회
                          <span className="block text-xs font-normal">최대 −{r.worstCut.toFixed(0)}%</span>
                        </span>
                      )}
                    </td>
                    <td className={`p-3 text-right tabular-nums ${r.priceReturn < 0 ? "text-stock-down" : "text-muted-foreground"}`}>
                      {pct(r.priceReturn)}
                    </td>
                    <td className="p-3 text-right tabular-nums text-muted-foreground">
                      {pct(r.dividendReturn)}
                    </td>
                    <td className="p-3 text-right tabular-nums font-semibold text-foreground">
                      {pct(r.totalReturn)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
          평가 구간은 종목마다 다릅니다. 배당을 실제로 지급하기 시작한 해부터 <strong className="text-foreground">작년까지의
          완전한 달력 연도</strong>만 계산합니다. 올해는 배당이 아직 다 나오지 않아 포함하면 모든 종목이 삭감으로
          잡히기 때문입니다. 구간이 다른 종목의 &ldquo;합계&rdquo;를 직접 비교하면 안 됩니다.
          주가 변동과 받은 배당은 세전·환율 미반영이며, 배당 재투자도 가정하지 않았습니다.
          데이터 출처는 Yahoo Finance이고 하루 한 번 갱신합니다.
        </p>

        {pending.length > 0 && (
          <div className=" border border-border bg-secondary/30 p-5 mb-10">
            <h2 className="text-sm font-bold text-foreground mb-2">평가 보류 — 배당 이력이 짧은 종목</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              배당을 지급한 완전한 연도가 3개 미만이라 성장률·삭감 여부를 판단하지 않았습니다.
              최근 상장했거나 최근에 배당을 시작한 ETF입니다. 숫자가 없는 것이지, 나쁘다는 뜻이 아닙니다.
            </p>
            <div className="flex flex-wrap gap-2">
              {pending.map((r: DividendSafety) => (
                <Link
                  key={r.symbol}
                  href={`/etf/${encodeURIComponent(r.symbol)}`}
                  className="text-xs px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground hover:text-primary transition-colors"
                >
                  {resolveEtfInfo(r.symbol).name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <ToolArticle
          sections={[
            {
              heading: "배당수익률이 높은 ETF가 위험할 수 있는 이유",
              body: (
                <>
                  <p>
                    배당수익률은 <strong className="text-foreground">배당금 ÷ 주가</strong>입니다. 분자인 배당금이
                    늘어도 오르지만, 분모인 주가가 떨어져도 오릅니다. 그래서 &ldquo;배당수익률이 높다&rdquo;는 것만으로는
                    좋은 신호인지 나쁜 신호인지 구분되지 않습니다. 주가가 반토막 난 ETF는 배당을 그대로 줘도
                    배당수익률이 두 배로 보입니다.
                  </p>
                  <p>
                    구분하는 방법은 <strong className="text-foreground">배당금 자체가 늘었는지 보는 것</strong>입니다.
                    위 표의 &ldquo;배당 성장률&rdquo;은 주가와 무관하게 1주당 배당금이 매년 몇 퍼센트씩 변했는지를
                    계산한 값입니다. 이 값이 마이너스라면 배당수익률이 높더라도 배당이 줄고 있다는 뜻입니다.
                  </p>
                </>
              ),
            },
            {
              heading: "‘삭감’은 무엇을 센 것인가",
              body: (
                <>
                  <p>
                    한 해에 지급된 배당 총액이 전년보다 적으면 삭감 1회로 셉니다. 분기 배당 한 번이 줄어든 것이
                    아니라 연간 합계를 비교하므로, 지급 시기가 밀리거나 당겨져서 생기는 착시는 걸러집니다.
                  </p>
                  <p>
                    삭감이 있었다는 사실 자체가 곧 나쁜 ETF라는 뜻은 아닙니다. 커버드콜 ETF처럼 옵션 프리미엄이
                    시장 변동성에 따라 오르내리는 구조는 분배금이 해마다 흔들리는 것이 정상입니다. 다만
                    <strong className="text-foreground"> &ldquo;매달 꽂히는 안정적인 월세&rdquo;로 기대하고 들어갔다면</strong> 계획이
                    틀어집니다. 이 표의 목적은 그 기대치를 사실과 맞추는 것입니다.
                  </p>
                </>
              ),
            },
            {
              heading: "배당을 많이 받았는데 왜 합계가 낮을까",
              body: (
                <>
                  <p>
                    표의 &ldquo;합계&rdquo;는 주가 변동과 그동안 받은 배당을 더한 값입니다. 배당을 아무리 많이 받아도
                    주가가 그만큼 내려갔다면 실제로 늘어난 돈은 없습니다. 분배금 일부가 운용 성과가 아니라
                    <strong className="text-foreground"> 원금에서 나온 경우</strong>(원금반환, ROC)에 이런 일이 생깁니다.
                  </p>
                  <p>
                    받은 배당이 크면서 주가 변동이 크게 마이너스인 종목이 있다면, 그 배당의 상당 부분은 내 돈을
                    돌려받은 것에 가깝습니다. 개별 종목의 분배율과 총수익률을 나란히 보려면{" "}
                    <Link href="/tools/real-return" className="text-primary hover:underline">분배율 vs 실제 수익률</Link>{" "}
                    페이지를, 세금까지 반영한 실수령액은{" "}
                    <Link href="/tools/tax" className="text-primary hover:underline">배당소득세 계산기</Link>에서 확인하세요.
                  </p>
                </>
              ),
            },
          ]}
          faqs={[
            {
              q: "배당 성장률이 높으면 무조건 좋은 ETF인가요?",
              a: "아닙니다. 배당 성장률은 배당금이 늘어난 속도만 보여줄 뿐, 주가 흐름이나 운용보수는 담지 않습니다. 배당이 빠르게 늘어도 주가가 그 이상 내려갔다면 전체 수익은 나쁠 수 있습니다. 표의 주가 변동과 합계를 함께 보세요.",
            },
            {
              q: "왜 올해 배당은 계산에 넣지 않나요?",
              a: "올해는 아직 배당이 다 지급되지 않았습니다. 미완성인 올해 합계를 작년과 비교하면 거의 모든 종목이 배당 삭감으로 잘못 잡힙니다. 그래서 배당을 지급하기 시작한 해부터 작년까지, 완전한 달력 연도만 사용합니다.",
            },
            {
              q: "평가 보류로 분류된 ETF는 피해야 하나요?",
              a: "그렇지 않습니다. 배당을 지급한 완전한 연도가 3개 미만이면 성장률과 삭감 여부를 통계적으로 말할 수 없어 판단을 내리지 않은 것입니다. 최근 상장한 ETF가 여기에 해당합니다. 데이터가 쌓이면 표에 자동으로 편입됩니다.",
            },
            {
              q: "숫자는 얼마나 자주 갱신되나요?",
              a: "하루 한 번 갱신합니다. 배당 지급 이력은 분기 또는 매월 단위로 바뀌므로 더 자주 갱신할 실익이 없습니다. 실시간 주가와 현재 배당수익률은 각 ETF 상세 페이지에서 확인할 수 있습니다.",
            },
            {
              q: "이 수치로 투자를 결정해도 되나요?",
              a: "이 페이지는 과거 지급 이력을 기계적으로 집계한 정보이며 투자 권유가 아닙니다. 과거 배당이 늘었다고 앞으로도 늘어난다는 보장은 없습니다. 세금·환율·재투자 효과도 반영되어 있지 않으니 참고 자료로만 사용하세요.",
            },
          ]}
        />
      </div>
    </main>
  )
}
