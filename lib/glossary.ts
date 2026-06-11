// 투자 용어 사전 데이터 (/glossary, /glossary/[slug])

export type GlossaryTerm = {
  slug: string
  term: string
  /** 한 줄 정의 */
  short: string
  /** 상세 설명 */
  description: string
  /** 분류 */
  category: "배당" | "ETF" | "세금" | "전략" | "지표"
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "ex-dividend-date",
    term: "배당락일",
    short: "이날 이후 매수하면 이번 배당을 받지 못하는 기준일",
    description:
      "배당락일(ex-dividend date)은 배당을 받을 권리가 사라지는 날입니다. 배당락일 '전날'까지 주식을 보유해야 이번 배당을 받을 수 있고, 배당락일 당일이나 그 이후에 매수하면 이번 배당은 받지 못합니다. 보통 배당락일에는 배당금만큼 주가가 조정(하락)되는 경향이 있습니다.",
    category: "배당",
  },
  {
    slug: "record-date",
    term: "배당기준일",
    short: "주주명부에 올라 있어야 배당을 받는 확정일",
    description:
      "배당기준일(record date)은 회사가 '이 날짜 기준 주주명부에 있는 사람'에게 배당을 주겠다고 정한 날입니다. 주식 결제(보통 거래일+2일)를 고려해 배당락일이 배당기준일보다 하루 앞서는 구조입니다.",
    category: "배당",
  },
  {
    slug: "distribution",
    term: "분배금",
    short: "ETF가 보유 자산에서 나온 배당·이자를 투자자에게 나눠주는 돈",
    description:
      "분배금은 ETF가 담고 있는 주식의 배당, 채권의 이자 등에서 발생한 수익을 투자자에게 지급하는 것입니다. 개별 주식의 '배당금'과 같은 개념이지만, 펀드(ETF)에서는 '분배금'이라고 부릅니다. 월·분기 등 정해진 주기로 지급됩니다.",
    category: "배당",
  },
  {
    slug: "dividend-yield",
    term: "배당수익률",
    short: "현재 주가 대비 연간 배당금의 비율(%)",
    description:
      "배당수익률 = (연간 배당금 ÷ 현재 주가) × 100. 예를 들어 주가 1만원, 연 배당 400원이면 배당수익률은 4%입니다. 주가가 떨어지면 배당수익률은 올라가 보이므로, 수익률이 높다고 무조건 좋은 것은 아니며 배당의 지속성과 함께 봐야 합니다.",
    category: "지표",
  },
  {
    slug: "dividend-growth",
    term: "배당성장률",
    short: "배당금이 해마다 늘어나는 속도",
    description:
      "배당성장률은 기업이나 ETF의 배당금이 매년 얼마나 증가하는지를 나타냅니다. 당장의 배당수익률은 낮아도 배당성장률이 높으면, 장기 보유 시 매수가 대비 실질 배당수익률(YOC)이 크게 올라갑니다. SCHD 같은 배당성장 ETF가 대표적입니다.",
    category: "지표",
  },
  {
    slug: "nav",
    term: "NAV (순자산가치)",
    short: "ETF가 담은 자산의 1주당 실제 가치",
    description:
      "NAV(Net Asset Value)는 ETF가 보유한 자산 총액을 발행 주식 수로 나눈 '1주당 순자산가치'입니다. ETF의 시장가격은 수급에 따라 NAV보다 비싸거나(프리미엄) 싸게(디스카운트) 거래될 수 있습니다.",
    category: "ETF",
  },
  {
    slug: "premium-discount",
    term: "괴리율",
    short: "ETF 시장가격이 NAV에서 벗어난 정도",
    description:
      "괴리율은 ETF의 시장가격이 실제 가치(NAV)와 얼마나 차이 나는지를 %로 나타낸 값입니다. 괴리율이 크면 NAV보다 비싸게 사거나 싸게 파는 셈이 되어 손해를 볼 수 있습니다. 거래량이 충분하고 괴리율이 작은 ETF가 거래에 유리합니다.",
    category: "ETF",
  },
  {
    slug: "tracking-error",
    term: "추적오차",
    short: "ETF가 추종하는 지수와 수익률이 벌어지는 정도",
    description:
      "추적오차(tracking error)는 ETF의 실제 수익률이 기초지수 수익률과 얼마나 차이 나는지를 보여줍니다. 운용보수, 거래비용, 환헤지 등으로 발생하며, 추적오차가 작을수록 지수를 잘 따라가는 ETF입니다.",
    category: "ETF",
  },
  {
    slug: "covered-call",
    term: "커버드콜",
    short: "보유 주식에 콜옵션을 팔아 분배금을 높이는 전략",
    description:
      "커버드콜은 주식을 보유한 상태에서 콜옵션을 매도해 옵션 프리미엄(웃돈)을 받는 전략입니다. 이 프리미엄을 분배금으로 지급하기 때문에 배당률이 높아지지만, 주가가 크게 오를 때는 상승 수익이 제한됩니다. JEPI·JEPQ, 국내 커버드콜 ETF가 이 전략을 씁니다.",
    category: "전략",
  },
  {
    slug: "expense-ratio",
    term: "총보수 (TER)",
    short: "ETF를 보유할 때 매년 빠져나가는 운용 비용",
    description:
      "총보수(TER, 운용보수)는 ETF를 운용·관리하는 데 드는 연간 비용 비율입니다. 0.1%면 1,000만원 투자 시 연 1만원이 비용으로 차감됩니다. 장기 투자일수록 보수 차이가 수익률에 크게 누적되므로, 같은 지수를 추종한다면 보수가 낮은 ETF가 유리합니다.",
    category: "ETF",
  },
  {
    slug: "distribution-rate",
    term: "분배율",
    short: "현재가 대비 연간 분배금 비율(커버드콜에서 특히 강조)",
    description:
      "분배율은 ETF의 현재가 대비 연간 분배금 비율로, 배당수익률과 비슷한 개념입니다. 특히 커버드콜 ETF는 분배율이 매우 높게 표시되는데, 일부는 원금(주가)에서 떼어 지급되는 경우도 있어 분배율만 보고 판단하면 안 됩니다.",
    category: "지표",
  },
  {
    slug: "etf",
    term: "ETF",
    short: "여러 종목에 분산 투자하는 펀드를 주식처럼 거래하는 상품",
    description:
      "ETF(Exchange Traded Fund, 상장지수펀드)는 지수나 특정 자산군을 추종하는 펀드를 주식처럼 실시간으로 사고팔 수 있게 만든 상품입니다. 한 종목만 사도 여러 기업에 분산 투자하는 효과가 있고, 일반 펀드보다 보수가 낮으며 투명합니다.",
    category: "ETF",
  },
  {
    slug: "drip",
    term: "DRIP (배당 재투자)",
    short: "받은 배당금을 다시 투자해 복리 효과를 키우는 것",
    description:
      "DRIP(Dividend Reinvestment Plan)은 지급받은 배당금으로 같은 종목을 추가 매수하는 것을 말합니다. 배당을 재투자하면 보유 수량이 늘고, 늘어난 수량이 다시 배당을 낳아 시간이 갈수록 복리로 자산이 불어납니다.",
    category: "전략",
  },
  {
    slug: "dividend-aristocrat",
    term: "배당귀족",
    short: "25년 이상 연속으로 배당을 늘려온 기업",
    description:
      "배당귀족(Dividend Aristocrat)은 S&P 500 기업 중 25년 이상 매년 배당을 늘려온 회사를 말합니다. 오랜 기간 배당을 늘릴 만큼 사업이 안정적이라는 의미로, 배당의 지속성을 중시하는 투자자가 선호합니다.",
    category: "배당",
  },
  {
    slug: "core-satellite",
    term: "코어-새틀라이트",
    short: "안정적 코어 + 공격적 새틀라이트로 나누는 포트폴리오 전략",
    description:
      "코어-새틀라이트 전략은 포트폴리오의 큰 비중(코어)을 S&P 500 같은 안정 자산에 두고, 나머지 일부(새틀라이트)를 고배당·테마 ETF 등으로 채우는 방법입니다. 안정성과 초과수익 기회를 동시에 노립니다.",
    category: "전략",
  },
  {
    slug: "dividend-tax",
    term: "배당소득세",
    short: "배당·분배금에 부과되는 15.4%의 세금",
    description:
      "국내에서 배당·분배금에는 배당소득세 15.4%(배당소득세 14% + 지방소득세 1.4%)가 원천징수됩니다. 미국 상장 ETF는 현지에서 15%가 원천징수됩니다. 받을 때 자동으로 떼이므로 세후 실수령액 기준으로 계획하는 것이 좋습니다.",
    category: "세금",
  },
  {
    slug: "financial-income-tax",
    term: "금융소득종합과세",
    short: "연 금융소득 2천만원 초과 시 종합과세되는 제도",
    description:
      "이자·배당 등 금융소득이 연 2,000만원을 넘으면, 초과분이 다른 소득과 합산되어 누진세율로 종합과세됩니다. 배당 규모가 커질수록 세금 부담이 늘 수 있어, 연금저축·ISA 등 절세 계좌를 함께 활용하는 것이 유리합니다.",
    category: "세금",
  },
]

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug)
}

export function getRelatedTerms(slug: string, limit = 4): GlossaryTerm[] {
  const target = getTerm(slug)
  if (!target) return GLOSSARY.filter((t) => t.slug !== slug).slice(0, limit)
  const sameCat = GLOSSARY.filter((t) => t.slug !== slug && t.category === target.category)
  const others = GLOSSARY.filter((t) => t.slug !== slug && t.category !== target.category)
  return [...sameCat, ...others].slice(0, limit)
}
