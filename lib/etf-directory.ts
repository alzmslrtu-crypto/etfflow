// 인기 ETF 정보 디렉터리
// 종목 상세 페이지(/etf/[symbol])와 검색 보조에 사용한다.
// 라이브 가격·배당 데이터는 /api/stock에서 받아오고, 여기에는 검색·SEO·설명용 정적 정보를 둔다.

export type EtfInfo = {
  /** Yahoo Finance 심볼 (예: SCHD, 458730.KS) */
  symbol: string
  /** 표시 이름 */
  name: string
  /** 영문/원문 이름 (선택) */
  longName?: string
  region: "US" | "KR"
  /** 카테고리 (예: 미국 배당성장, 커버드콜 월배당) */
  category: string
  /** 운용사 */
  issuer: string
  /** 배당 주기 (월 / 분기 / 반기 / 연 / 없음) */
  dividendCycle: "월" | "분기" | "반기" | "연" | "비정기"
  /** 검색·태그용 키워드 */
  tags: string[]
  /** 한 줄 요약 */
  summary: string
  /** 본문 설명 (문단, SEO/유저용) */
  description: string
}

export const ETF_DIRECTORY: EtfInfo[] = [
  // ===== 미국 상장 =====
  {
    symbol: "SCHD",
    name: "SCHD (미국 배당 다우존스)",
    longName: "Schwab U.S. Dividend Equity ETF",
    region: "US",
    category: "미국 배당성장",
    issuer: "Charles Schwab",
    dividendCycle: "분기",
    tags: ["미국배당", "배당성장", "다우존스", "분기배당"],
    summary: "재무 건전성과 배당 지속성을 갖춘 미국 우량 배당주 100종목에 투자하는 대표 배당성장 ETF입니다.",
    description:
      "SCHD는 'Dow Jones U.S. Dividend 100' 지수를 추종하며, 10년 이상 배당을 지급하고 현금흐름·ROE 등 재무 지표가 우수한 미국 기업 100곳에 분산 투자합니다. 낮은 보수와 꾸준한 배당 성장으로 장기 배당 투자자에게 가장 널리 추천되는 ETF 중 하나입니다. 한국에서는 TIGER·SOL·ACE '미국배당다우존스' 등 동일 지수를 추종하는 국내 상장 ETF로도 투자할 수 있습니다.",
  },
  {
    symbol: "JEPI",
    name: "JEPI (JP모건 프리미엄 인컴)",
    longName: "JPMorgan Equity Premium Income ETF",
    region: "US",
    category: "커버드콜 월배당",
    issuer: "J.P. Morgan",
    dividendCycle: "월",
    tags: ["월배당", "커버드콜", "고배당", "인컴"],
    summary: "미국 대형주에 투자하면서 옵션(커버드콜) 전략으로 매월 높은 분배금을 지급하는 인컴형 ETF입니다.",
    description:
      "JEPI는 S&P 500 종목 중심의 저변동성 포트폴리오에 커버드콜(콜옵션 매도) 전략을 더해 매월 분배금을 지급합니다. 일반 지수 ETF보다 배당수익률이 크게 높은 대신, 강한 상승장에서는 수익이 제한될 수 있습니다. 매월 현금흐름을 원하는 인컴 투자자에게 인기가 많습니다.",
  },
  {
    symbol: "JEPQ",
    name: "JEPQ (JP모건 나스닥 프리미엄 인컴)",
    longName: "JPMorgan Nasdaq Equity Premium Income ETF",
    region: "US",
    category: "커버드콜 월배당",
    issuer: "J.P. Morgan",
    dividendCycle: "월",
    tags: ["월배당", "커버드콜", "나스닥", "인컴"],
    summary: "나스닥 100 중심 종목에 커버드콜 전략을 더해 매월 분배금을 지급하는 성장+인컴형 ETF입니다.",
    description:
      "JEPQ는 나스닥 100 기반의 기술주 포트폴리오에 커버드콜 전략을 적용해 매월 분배금을 지급합니다. JEPI보다 기술주 비중이 높아 성장성과 변동성이 모두 큰 편입니다. 기술주 노출과 월 현금흐름을 동시에 원하는 투자자에게 적합합니다.",
  },
  {
    symbol: "VOO",
    name: "VOO (뱅가드 S&P 500)",
    longName: "Vanguard S&P 500 ETF",
    region: "US",
    category: "미국 대표지수",
    issuer: "Vanguard",
    dividendCycle: "분기",
    tags: ["S&P500", "지수", "미국", "분기배당"],
    summary: "미국 대표 500대 기업에 투자하는 초저보수 S&P 500 추종 ETF입니다.",
    description:
      "VOO는 미국 S&P 500 지수를 추종하며, 매우 낮은 보수로 미국 시장 전체에 분산 투자하는 효과를 제공합니다. 배당수익률은 높지 않지만 장기 자산 성장의 핵심(코어) 자산으로 널리 쓰입니다. 배당 ETF와 함께 코어-새틀라이트 전략의 중심으로 활용하기 좋습니다.",
  },
  {
    symbol: "QQQ",
    name: "QQQ (인베스코 나스닥 100)",
    longName: "Invesco QQQ Trust",
    region: "US",
    category: "나스닥 100",
    issuer: "Invesco",
    dividendCycle: "분기",
    tags: ["나스닥", "기술주", "성장", "지수"],
    summary: "애플·마이크로소프트·엔비디아 등 나스닥 100 대형 기술주에 투자하는 대표 성장형 ETF입니다.",
    description:
      "QQQ는 나스닥 100 지수를 추종하며 미국 대형 기술·성장주에 집중 투자합니다. 배당보다는 자본 성장에 초점이 맞춰진 ETF로, 변동성은 크지만 장기 성장성을 기대하는 투자자에게 인기가 많습니다.",
  },
  {
    symbol: "DGRO",
    name: "DGRO (아이셰어즈 배당성장)",
    longName: "iShares Core Dividend Growth ETF",
    region: "US",
    category: "미국 배당성장",
    issuer: "BlackRock (iShares)",
    dividendCycle: "분기",
    tags: ["미국배당", "배당성장", "분기배당"],
    summary: "배당을 꾸준히 늘려온 미국 기업에 폭넓게 투자하는 배당성장 ETF입니다.",
    description:
      "DGRO는 배당 성장 이력이 있는 미국 기업에 분산 투자합니다. SCHD보다 종목 수가 많아 분산도가 높고, 배당 성장과 안정성을 함께 추구합니다. 배당성장 전략을 SCHD와 비교·보완하려는 투자자가 많이 찾습니다.",
  },
  {
    symbol: "VYM",
    name: "VYM (뱅가드 고배당)",
    longName: "Vanguard High Dividend Yield ETF",
    region: "US",
    category: "미국 고배당",
    issuer: "Vanguard",
    dividendCycle: "분기",
    tags: ["미국배당", "고배당", "분기배당"],
    summary: "평균보다 배당수익률이 높은 미국 기업에 폭넓게 분산 투자하는 고배당 ETF입니다.",
    description:
      "VYM은 미국 고배당주에 약 400개 이상 폭넓게 분산 투자합니다. 저보수에 변동성이 비교적 낮아 안정적인 배당 인컴을 원하는 투자자에게 적합합니다.",
  },
  {
    symbol: "SPYD",
    name: "SPYD (SPDR S&P 고배당)",
    longName: "SPDR Portfolio S&P 500 High Dividend ETF",
    region: "US",
    category: "미국 고배당",
    issuer: "State Street (SPDR)",
    dividendCycle: "분기",
    tags: ["미국배당", "고배당", "S&P500"],
    summary: "S&P 500 내 배당수익률 상위 80종목에 투자하는 고배당 ETF입니다.",
    description:
      "SPYD는 S&P 500 구성 종목 중 배당수익률이 높은 80종목에 동일가중에 가깝게 투자합니다. 배당수익률이 상대적으로 높은 편이며, 부동산·유틸리티 등 경기방어 섹터 비중이 큰 특징이 있습니다.",
  },

  // ===== 한국 상장 =====
  {
    symbol: "458730.KS",
    name: "TIGER 미국배당다우존스",
    region: "KR",
    category: "미국 배당성장 (국내상장)",
    issuer: "미래에셋자산운용",
    dividendCycle: "월",
    tags: ["미국배당", "SCHD", "월배당", "국내상장"],
    summary: "SCHD와 같은 지수를 추종하면서 원화로 매월 분배금을 지급하는 국내 상장 대표 배당 ETF입니다.",
    description:
      "TIGER 미국배당다우존스는 SCHD와 동일한 'Dow Jones U.S. Dividend 100' 지수를 추종하며, 국내 증시에 원화로 상장돼 환전 없이 투자할 수 있습니다. 미국 원본(SCHD)이 분기 배당인 것과 달리 국내 상장 버전은 매월 분배금을 지급해 월배당을 원하는 한국 투자자에게 특히 인기가 많습니다. 연금·ISA 계좌에서도 활용하기 좋습니다.",
  },
  {
    symbol: "446720.KS",
    name: "SOL 미국배당다우존스",
    region: "KR",
    category: "미국 배당성장 (국내상장)",
    issuer: "신한자산운용",
    dividendCycle: "월",
    tags: ["미국배당", "SCHD", "월배당", "국내상장"],
    summary: "SCHD 지수를 추종하는 국내 상장 월배당 ETF로, 신한자산운용이 운용합니다.",
    description:
      "SOL 미국배당다우존스는 SCHD와 동일한 지수를 추종하는 국내 상장 ETF로 매월 분배금을 지급합니다. TIGER·ACE 동일 지수 ETF와 보수·순자산·괴리율 등을 비교해 선택하는 경우가 많습니다.",
  },
  {
    symbol: "402970.KS",
    name: "ACE 미국배당다우존스",
    region: "KR",
    category: "미국 배당성장 (국내상장)",
    issuer: "한국투자신탁운용",
    dividendCycle: "월",
    tags: ["미국배당", "SCHD", "월배당", "국내상장"],
    summary: "SCHD 지수를 추종하는 국내 상장 월배당 ETF로, 한국투자신탁운용이 운용합니다.",
    description:
      "ACE 미국배당다우존스는 SCHD와 동일 지수를 추종하는 국내 상장 ETF입니다. 매월 분배금을 지급하며, 동일 지수의 TIGER·SOL 상품과 함께 한국 월배당 투자자들이 즐겨 비교하는 종목입니다.",
  },
  {
    symbol: "441640.KS",
    name: "KODEX 미국배당커버드콜액티브",
    region: "KR",
    category: "커버드콜 월배당 (국내상장)",
    issuer: "삼성자산운용",
    dividendCycle: "월",
    tags: ["미국배당", "커버드콜", "월배당", "고분배"],
    summary: "미국 배당주에 커버드콜 전략을 더해 높은 월 분배금을 노리는 국내 상장 ETF입니다.",
    description:
      "KODEX 미국배당커버드콜액티브는 미국 배당주 포트폴리오에 일부 커버드콜 전략을 더해 분배율을 높인 국내 상장 월배당 ETF입니다. 일반 배당 ETF보다 분배수익률이 높은 편이지만, 옵션 전략 특성상 강세장에서 상승폭이 제한될 수 있습니다.",
  },
  {
    symbol: "429000.KS",
    name: "TIGER 미국S&P500배당귀족",
    region: "KR",
    category: "미국 배당성장 (국내상장)",
    issuer: "미래에셋자산운용",
    dividendCycle: "분기",
    tags: ["미국배당", "배당귀족", "S&P500", "국내상장"],
    summary: "25년 이상 배당을 늘려온 'S&P 500 배당귀족' 기업에 투자하는 국내 상장 ETF입니다.",
    description:
      "TIGER 미국S&P500배당귀족은 25년 이상 연속으로 배당을 늘려온 미국 우량 기업(배당귀족)에 투자합니다. 배당의 지속성과 안정성을 중시하는 투자자에게 적합하며, 국내 증시에 원화로 상장돼 있습니다.",
  },
  {
    symbol: "329200.KS",
    name: "TIGER 리츠부동산인프라",
    region: "KR",
    category: "리츠·인프라 (국내상장)",
    issuer: "미래에셋자산운용",
    dividendCycle: "분기",
    tags: ["리츠", "부동산", "인프라", "배당"],
    summary: "국내 상장 리츠와 인프라 종목에 투자해 배당(분배)을 추구하는 ETF입니다.",
    description:
      "TIGER 리츠부동산인프라는 국내 상장 리츠(REITs)와 인프라 펀드에 투자합니다. 부동산·인프라에서 나오는 임대·운영 수익을 기반으로 분배금을 지급하며, 주식과 다른 자산군으로 포트폴리오를 분산하려는 투자자에게 활용됩니다.",
  },
  {
    symbol: "360750.KS",
    name: "TIGER 미국S&P500",
    region: "KR",
    category: "미국 대표지수 (국내상장)",
    issuer: "미래에셋자산운용",
    dividendCycle: "분기",
    tags: ["S&P500", "미국", "지수", "국내상장"],
    summary: "미국 S&P 500 지수를 원화로 투자할 수 있는 국내 상장 대표 ETF입니다.",
    description:
      "TIGER 미국S&P500은 미국 S&P 500 지수를 추종하는 국내 상장 ETF로, 환전 없이 원화로 미국 대표 지수에 투자할 수 있습니다. 연금·ISA 등 절세 계좌에서 코어 자산으로 널리 활용됩니다.",
  },
  {
    symbol: "133690.KS",
    name: "TIGER 미국나스닥100",
    region: "KR",
    category: "나스닥 100 (국내상장)",
    issuer: "미래에셋자산운용",
    dividendCycle: "분기",
    tags: ["나스닥", "기술주", "미국", "국내상장"],
    summary: "미국 나스닥 100 지수를 원화로 투자할 수 있는 국내 상장 대표 성장형 ETF입니다.",
    description:
      "TIGER 미국나스닥100은 미국 나스닥 100 지수를 추종하는 국내 상장 ETF입니다. 대형 기술·성장주에 원화로 투자할 수 있어 성장 자산을 원하는 한국 투자자에게 인기가 많습니다.",
  },
  {
    symbol: "069500.KS",
    name: "KODEX 200",
    region: "KR",
    category: "한국 대표지수",
    issuer: "삼성자산운용",
    dividendCycle: "분기",
    tags: ["코스피", "코스피200", "한국", "지수"],
    summary: "코스피 200 지수를 추종하는 한국 대표 ETF입니다.",
    description:
      "KODEX 200은 코스피 200 지수를 추종하는 국내 대표 ETF로, 한국 대형주 전반에 분산 투자합니다. 국내 시장 노출이 필요할 때 코어 자산으로 활용됩니다.",
  },
]

// 심볼로 ETF 정보 조회 (대소문자 무시)
export function getEtfInfo(symbol: string): EtfInfo | undefined {
  const upper = symbol.toUpperCase()
  return ETF_DIRECTORY.find((e) => e.symbol.toUpperCase() === upper)
}

// 디렉터리에 없는 종목도 최소 정보로 표시할 수 있게 해석
export function resolveEtfInfo(symbol: string): EtfInfo {
  const found = getEtfInfo(symbol)
  if (found) return found
  const region: "US" | "KR" = symbol.endsWith(".KS") || symbol.endsWith(".KQ") ? "KR" : "US"
  return {
    symbol,
    name: symbol.replace(/\.(KS|KQ)$/, ""),
    region,
    category: "ETF / 주식",
    issuer: "-",
    dividendCycle: "비정기",
    tags: [],
    summary: `${symbol}의 실시간 가격, 배당수익률, 배당 지급월, 운용보수, 순자산 정보를 확인하세요.`,
    description: "",
  }
}

// 인기 1:1 비교 쌍 (compare/[pair] 정적 생성용)
export const COMPARE_PAIRS: [string, string][] = [
  ["SCHD", "JEPI"],
  ["JEPI", "JEPQ"],
  ["SCHD", "VYM"],
  ["SCHD", "DGRO"],
  ["SCHD", "VOO"],
  ["VOO", "QQQ"],
  ["VYM", "SPYD"],
  ["JEPQ", "QQQ"],
  ["SCHD", "458730.KS"],
  ["458730.KS", "446720.KS"],
  ["458730.KS", "402970.KS"],
  ["360750.KS", "133690.KS"],
]

// 비교 쌍 slug (예: "schd-vs-jepi")
export function pairSlug(a: string, b: string): string {
  return `${a}-vs-${b}`.toLowerCase()
}

// slug -> 심볼 두 개 (대소문자/접미사 복원은 resolveEtfInfo가 처리)
export function parsePairSlug(slug: string): [string, string] | null {
  const parts = slug.split("-vs-")
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null
  const norm = (s: string) => {
    const upper = s.toUpperCase()
    // 디렉터리에 동일 심볼이 있으면 정확한 표기로 복원
    const match = ETF_DIRECTORY.find((e) => e.symbol.toUpperCase() === upper)
    return match ? match.symbol : upper
  }
  return [norm(parts[0]), norm(parts[1])]
}

// 같은 지역의 관련 ETF 추천 (자기 자신 제외)
export function getRelatedEtfs(symbol: string, limit = 4): EtfInfo[] {
  const target = getEtfInfo(symbol)
  if (!target) return ETF_DIRECTORY.filter((e) => e.symbol !== symbol).slice(0, limit)
  return ETF_DIRECTORY.filter(
    (e) => e.symbol !== target.symbol && e.region === target.region,
  ).slice(0, limit)
}
