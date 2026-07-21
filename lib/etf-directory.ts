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

  {
    symbol: "O",
    name: "O (리얼티 인컴)",
    longName: "Realty Income Corporation",
    region: "US",
    category: "미국 리츠 월배당",
    issuer: "Realty Income",
    dividendCycle: "월",
    tags: ["월배당", "리츠", "부동산", "고배당"],
    summary: "'월배당의 대명사'로 불리는 미국 대표 리츠로, 매월 배당을 지급하며 수십 년간 배당을 늘려왔습니다.",
    description:
      "리얼티 인컴(Realty Income)은 미국 전역의 상업용 부동산을 임대해 안정적인 임대 수익을 올리는 리츠(REIT)입니다. 'The Monthly Dividend Company'라는 별명처럼 매월 배당을 지급하고, 오랜 기간 배당을 꾸준히 늘려와 월배당 투자자에게 매우 인기가 많습니다. 개별 종목이라 ETF보다 분산도는 낮은 점은 유의해야 합니다.",
  },
  {
    symbol: "QQQM",
    name: "QQQM (인베스코 나스닥 100)",
    longName: "Invesco NASDAQ 100 ETF",
    region: "US",
    category: "나스닥 100",
    issuer: "Invesco",
    dividendCycle: "분기",
    tags: ["나스닥", "기술주", "성장", "저보수"],
    summary: "QQQ와 같은 나스닥 100을 추종하면서 보수가 더 낮은 장기 투자용 ETF입니다.",
    description:
      "QQQM은 QQQ와 동일한 나스닥 100 지수를 추종하지만 운용보수가 더 낮아, 장기 적립식 투자에 유리하게 설계된 ETF입니다. QQQ보다 거래량은 적지만 보수 차이 때문에 장기 보유에는 QQQM을 선택하는 투자자가 많습니다.",
  },
  {
    symbol: "DGRW",
    name: "DGRW (위즈덤트리 배당성장)",
    longName: "WisdomTree U.S. Quality Dividend Growth Fund",
    region: "US",
    category: "미국 배당성장",
    issuer: "WisdomTree",
    dividendCycle: "월",
    tags: ["미국배당", "배당성장", "월배당", "퀄리티"],
    summary: "수익성·배당성장성이 좋은 미국 우량주에 투자하며 매월 배당을 지급하는 ETF입니다.",
    description:
      "DGRW는 ROE·ROA 등 수익성이 높고 배당 성장이 기대되는 미국 기업에 투자합니다. 미국 ETF 중 드물게 매월 배당을 지급해, 배당성장과 월 현금흐름을 함께 원하는 투자자에게 인기가 있습니다.",
  },
  {
    symbol: "VIG",
    name: "VIG (뱅가드 배당성장)",
    longName: "Vanguard Dividend Appreciation ETF",
    region: "US",
    category: "미국 배당성장",
    issuer: "Vanguard",
    dividendCycle: "분기",
    tags: ["미국배당", "배당성장", "저보수"],
    summary: "10년 이상 배당을 늘려온 미국 우량 기업에 폭넓게 투자하는 저보수 배당성장 ETF입니다.",
    description:
      "VIG는 10년 이상 연속으로 배당을 늘려온 미국 기업에 분산 투자합니다. 배당수익률 자체는 높지 않지만 배당의 안정성과 성장성, 낮은 보수로 장기 투자자에게 꾸준히 선택받는 ETF입니다.",
  },
  {
    symbol: "SPHD",
    name: "SPHD (S&P 고배당 저변동성)",
    longName: "Invesco S&P 500 High Dividend Low Volatility ETF",
    region: "US",
    category: "미국 고배당",
    issuer: "Invesco",
    dividendCycle: "월",
    tags: ["미국배당", "고배당", "저변동성", "월배당"],
    summary: "S&P 500 내 고배당·저변동성 종목에 투자하며 매월 배당을 주는 ETF입니다.",
    description:
      "SPHD는 S&P 500 종목 중 배당수익률이 높고 변동성이 낮은 50종목에 투자합니다. 매월 배당을 지급하며, 방어적 성격이 강해 안정적인 인컴을 원하는 투자자에게 적합합니다.",
  },
  {
    symbol: "HDV",
    name: "HDV (아이셰어즈 고배당)",
    longName: "iShares Core High Dividend ETF",
    region: "US",
    category: "미국 고배당",
    issuer: "BlackRock (iShares)",
    dividendCycle: "분기",
    tags: ["미국배당", "고배당", "우량주"],
    summary: "재무가 튼튼한 미국 고배당 우량주에 집중 투자하는 ETF입니다.",
    description:
      "HDV는 재무 건전성이 우수하면서 배당수익률이 높은 미국 기업 약 75종목에 투자합니다. 에너지·헬스케어·필수소비재 등 경기방어 섹터 비중이 큰 편으로, 안정적 배당을 추구합니다.",
  },
  {
    symbol: "DIVO",
    name: "DIVO (앰플리파이 인핸스드 배당)",
    longName: "Amplify CWP Enhanced Dividend Income ETF",
    region: "US",
    category: "커버드콜 월배당",
    issuer: "Amplify",
    dividendCycle: "월",
    tags: ["월배당", "커버드콜", "배당성장", "인컴"],
    summary: "우량 배당주에 부분적으로 커버드콜을 더해 월배당을 지급하는 인컴형 ETF입니다.",
    description:
      "DIVO는 우량 배당주 포트폴리오에 선별적으로 커버드콜 전략을 적용해 분배금을 높인 ETF입니다. JEPI보다 옵션 비중이 낮아 상승 여력을 일부 남기면서 월 현금흐름을 추구합니다.",
  },
  {
    symbol: "NOBL",
    name: "NOBL (S&P 배당귀족)",
    longName: "ProShares S&P 500 Dividend Aristocrats ETF",
    region: "US",
    category: "미국 배당성장",
    issuer: "ProShares",
    dividendCycle: "분기",
    tags: ["미국배당", "배당귀족", "배당성장"],
    summary: "25년 이상 배당을 늘려온 'S&P 500 배당귀족' 기업에 투자하는 ETF입니다.",
    description:
      "NOBL은 25년 이상 매년 배당을 늘려온 S&P 500 배당귀족 기업에 동일가중에 가깝게 투자합니다. 배당의 지속성과 안정성을 중시하는 보수적 배당 투자자에게 적합합니다.",
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

  // ===== 미국 배당주 (개별 종목) =====
  // ETF만 있으면 "SCHD 구성종목"을 검색해 들어온 사람이 볼 페이지가 없다.
  // issuer는 운용사 필드라 개별 종목에는 "-"를 넣어 표시에서 빠지게 한다.
  {
    symbol: "KO",
    name: "코카콜라 (KO)",
    longName: "The Coca-Cola Company",
    region: "US",
    category: "미국 배당주 · 필수소비재",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["배당킹", "필수소비재", "코카콜라", "분기배당", "배당성장"],
    summary: "60년 넘게 매년 배당을 늘려온 배당킹으로, 경기 방어적 성격이 강한 미국 대표 소비재 기업입니다.",
    description:
      "코카콜라는 200여 개국에서 음료 브랜드를 판매하는 기업으로, 60년 이상 매년 배당을 인상해 온 '배당킹'입니다. 원액을 만들어 병입 파트너에게 공급하는 구조라 자본 투입이 적고 현금흐름이 안정적입니다. 경기 침체에도 매출이 크게 흔들리지 않아 방어주로 분류되지만, 성장성은 제한적이어서 주가 상승보다 배당 안정성을 보고 담는 종목입니다. 워런 버핏의 버크셔 해서웨이가 오래 보유한 종목으로도 알려져 있습니다.",
  },
  {
    symbol: "JNJ",
    name: "존슨앤드존슨 (JNJ)",
    longName: "Johnson & Johnson",
    region: "US",
    category: "미국 배당주 · 헬스케어",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["배당킹", "헬스케어", "제약", "분기배당", "배당성장"],
    summary: "60년 넘게 배당을 인상해 온 헬스케어 대표 기업으로, 최고 신용등급을 유지하는 몇 안 되는 회사입니다.",
    description:
      "존슨앤드존슨은 제약과 의료기기를 중심으로 하는 헬스케어 기업으로, 60년 이상 연속 배당을 인상한 배당킹입니다. 미국 정부보다 높은 AAA 신용등급을 오래 유지해 온 소수 기업 중 하나입니다. 2023년 소비자 헬스케어 부문을 켄뷰(Kenvue)로 분사해 제약·의료기기에 집중하는 구조로 바뀌었습니다. 탤크 소송 등 법적 리스크가 장기간 이어지고 있어, 배당 안정성과 별개로 이 부분을 함께 살펴야 합니다.",
  },
  {
    symbol: "PG",
    name: "프록터앤드갬블 (PG)",
    longName: "The Procter & Gamble Company",
    region: "US",
    category: "미국 배당주 · 필수소비재",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["배당킹", "필수소비재", "생활용품", "분기배당", "배당성장"],
    summary: "다우니·질레트·팬틴 등 생활필수품 브랜드를 보유한 기업으로, 70년 가까이 배당을 늘려왔습니다.",
    description:
      "프록터앤드갬블은 세제·기저귀·면도기 등 생활필수품 브랜드를 다수 보유한 기업입니다. 1957년부터 매년 배당을 인상해 배당 인상 기간이 가장 긴 기업군에 속합니다. 소비자가 경기와 무관하게 반복 구매하는 제품이라 매출 변동이 작고, 브랜드 파워로 원가 상승분을 가격에 전가하기 쉬운 편입니다. 다만 성숙 시장이라 매출 성장률이 낮아 주가 상승 폭은 제한적입니다.",
  },
  {
    symbol: "MO",
    name: "알트리아 (MO)",
    longName: "Altria Group, Inc.",
    region: "US",
    category: "미국 배당주 · 고배당",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["고배당", "배당킹", "담배", "분기배당"],
    summary: "말보로를 판매하는 미국 담배 기업으로, 배당수익률이 높은 대신 사업이 구조적으로 축소되고 있습니다.",
    description:
      "알트리아는 미국 내 말보로 등 담배 브랜드를 판매하는 기업으로, 배당수익률이 미국 대형주 중 높은 축에 속합니다. 50년 넘게 배당을 인상해 왔고 가격 인상으로 현금흐름을 방어해 왔습니다. 다만 미국 흡연 인구가 계속 줄고 있어 판매량 자체는 감소 추세이며, 이를 가격 인상으로 상쇄하는 구조입니다. 규제 강화와 소송 위험, 그리고 쥴(JUUL) 투자에서 대규모 손실을 낸 이력이 있어 고배당의 대가로 어떤 위험을 지는지 확인해야 합니다.",
  },
  {
    symbol: "ABBV",
    name: "애브비 (ABBV)",
    longName: "AbbVie Inc.",
    region: "US",
    category: "미국 배당주 · 헬스케어",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["배당귀족", "헬스케어", "제약", "분기배당", "배당성장"],
    summary: "휴미라로 성장한 제약 기업으로, 분사 이후 배당을 빠르게 늘려온 배당귀족입니다.",
    description:
      "애브비는 2013년 애보트(Abbott)에서 분사한 제약 기업으로, 자가면역 치료제 휴미라(Humira)로 크게 성장했습니다. 분사 이후 배당을 공격적으로 인상해 배당귀족에 포함됩니다. 휴미라 특허가 만료되며 매출이 줄어드는 구간을 스카이리지·린버크 등 후속 약물로 메우는 중이며, 이 전환이 얼마나 성공하는지가 향후 배당 여력을 좌우합니다. 제약주 특성상 신약 파이프라인과 특허 만료 일정을 함께 보아야 합니다.",
  },
  {
    symbol: "PEP",
    name: "펩시코 (PEP)",
    longName: "PepsiCo, Inc.",
    region: "US",
    category: "미국 배당주 · 필수소비재",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["배당킹", "필수소비재", "음료", "스낵", "분기배당"],
    summary: "음료와 스낵(레이즈·도리토스)을 함께 보유해 코카콜라보다 사업이 분산된 배당킹입니다.",
    description:
      "펩시코는 탄산음료뿐 아니라 프리토레이(레이즈·도리토스) 등 스낵 사업을 함께 보유해 음료 전업인 코카콜라보다 매출 구성이 분산되어 있습니다. 50년 넘게 매년 배당을 인상해 온 배당킹입니다. 스낵 부문이 음료보다 마진과 성장성이 높아 실적을 받쳐 왔습니다. 최근에는 건강 트렌드와 체중감량 의약품 확산이 가공식품 수요에 미칠 영향이 논점으로 거론됩니다.",
  },
  {
    symbol: "MCD",
    name: "맥도날드 (MCD)",
    longName: "McDonald's Corporation",
    region: "US",
    category: "미국 배당주 · 경기소비재",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["배당귀족", "외식", "프랜차이즈", "분기배당", "배당성장"],
    summary: "매장 대부분을 가맹점으로 운영하며 임대·로열티 수익을 얻는 구조로, 40년 넘게 배당을 늘려왔습니다.",
    description:
      "맥도날드는 전 세계 매장의 대부분을 가맹점으로 운영하고 로열티와 임대료를 받는 구조입니다. 직접 운영보다 자본 투입이 적고 현금흐름이 안정적이어서 배당 재원이 꾸준합니다. 1976년부터 매년 배당을 인상해 온 배당귀족입니다. 경기 침체기에는 오히려 저가 외식 수요가 늘어 방어적 성격을 보이기도 합니다. 부동산 자산을 다수 보유해 사실상 부동산 기업이라는 평가도 있습니다.",
  },
  {
    symbol: "XOM",
    name: "엑슨모빌 (XOM)",
    longName: "Exxon Mobil Corporation",
    region: "US",
    category: "미국 배당주 · 에너지",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["배당귀족", "에너지", "석유", "분기배당", "고배당"],
    summary: "40년 넘게 배당을 인상해 온 미국 최대 석유 기업으로, 실적이 유가에 크게 좌우됩니다.",
    description:
      "엑슨모빌은 미국 최대 석유·가스 기업으로, 40년 넘게 매년 배당을 인상해 온 배당귀족입니다. 유가가 급락한 2020년에도 차입을 늘려 배당을 지켰고, 이후 유가 회복기에 대규모 현금흐름을 거뒀습니다. 실적이 유가에 직접 연동되므로 이익 변동이 큰 편이며, 배당은 유지해 왔지만 주가는 유가 사이클을 따라 크게 움직입니다. 장기적으로는 에너지 전환이 사업에 미칠 영향이 논점입니다.",
  },
  {
    symbol: "CVX",
    name: "셰브론 (CVX)",
    longName: "Chevron Corporation",
    region: "US",
    category: "미국 배당주 · 에너지",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["배당귀족", "에너지", "석유", "분기배당", "고배당"],
    summary: "엑슨모빌과 함께 미국을 대표하는 석유 기업으로, 재무구조가 보수적인 편입니다.",
    description:
      "셰브론은 미국 2위 석유·가스 기업으로 30년 넘게 배당을 인상해 온 배당귀족입니다. 동종 기업 대비 부채 비율을 낮게 유지하는 보수적 재무 정책으로 알려져 있어, 유가 하락기에도 배당 여력을 비교적 잘 지켜 왔습니다. 엑슨모빌과 마찬가지로 실적과 주가가 유가 사이클에 크게 좌우되므로, 배당수익률이 높아 보이는 시점이 유가가 낮은 국면일 수 있다는 점을 함께 보아야 합니다.",
  },
  {
    symbol: "VZ",
    name: "버라이즌 (VZ)",
    longName: "Verizon Communications Inc.",
    region: "US",
    category: "미국 배당주 · 고배당",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["고배당", "통신", "분기배당"],
    summary: "배당수익률이 높은 미국 통신사지만, 주가가 장기간 부진해 총수익은 배당만큼 나오지 않았습니다.",
    description:
      "버라이즌은 미국 최대 통신사 중 하나로 배당수익률이 미국 대형주 중 높은 편입니다. 통신은 가입자 기반 반복 매출이라 현금흐름이 안정적이고, 배당도 매년 소폭씩 인상해 왔습니다. 다만 5G 주파수 확보와 망 투자에 대규모 자본이 들어가 부채가 크고, 이 때문에 최근 몇 년간 주가가 부진했습니다. 배당수익률만 보면 매력적으로 보이지만 주가 하락이 배당을 상쇄한 구간이 있었으므로, 배당과 주가를 합친 총수익을 함께 확인해야 합니다.",
  },
  {
    symbol: "T",
    name: "AT&T (T)",
    longName: "AT&T Inc.",
    region: "US",
    category: "미국 배당주 · 고배당",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["고배당", "통신", "분기배당", "배당삭감"],
    summary: "2022년 미디어 부문 분사와 함께 배당을 대폭 줄인 사례로, 고배당주의 위험을 보여주는 종목입니다.",
    description:
      "AT&T는 미국 대형 통신사로 오랫동안 대표적인 고배당주로 꼽혔습니다. 그러나 2021년 워너미디어 분사를 발표하며 배당 정책을 재설정했고, 연 배당금이 2021년 2.08달러에서 2023년 1.11달러로 약 47% 줄었습니다. 30년 이상 이어지던 배당 인상 기록도 이때 끊겼습니다. 배당수익률이 높다는 것만으로 배당이 안전하다고 볼 수 없다는 점을 보여 주는 사례이며, 인수합병으로 늘어난 부채가 배당 여력을 어떻게 압박하는지도 함께 볼 수 있습니다. 분사 이후에는 통신 본업에 집중하며 배당을 동일한 수준으로 유지하고 있습니다.",
  },
  {
    symbol: "IBM",
    name: "IBM",
    longName: "International Business Machines Corporation",
    region: "US",
    category: "미국 배당주 · 기술",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["고배당", "기술", "분기배당", "클라우드"],
    summary: "기술주 중 드물게 배당수익률이 높은 기업으로, 30년 가까이 배당을 인상해 왔습니다.",
    description:
      "IBM은 하드웨어 중심에서 클라우드·컨설팅·소프트웨어로 사업을 옮겨 온 기업으로, 기술주 중에서는 드물게 배당수익률이 높습니다. 1995년 이후 매년 배당을 인상해 왔지만 인상 폭은 크지 않아, 배당 성장보다 현재 배당수익률을 보고 접근하는 종목에 가깝습니다. 2021년 인프라 관리 부문을 킨드릴(Kyndryl)로 분사하며 사업 구조를 정리했습니다. 성장주 대비 매출 성장률이 낮다는 점이 오랜 논점입니다.",
  },

  // ===== 미국 배당주 (리츠·BDC·금융) =====
  // 리츠·BDC는 월배당·특별배당이 흔해 연도별 지급 횟수가 흔들린다.
  // 배당 지속성 지표는 지급 횟수를 연환산해 이 왜곡을 보정하지만,
  // 특별배당 비중이 큰 종목(MAIN 등)은 여전히 부정확해 넣지 않았다.
  {
    symbol: "VICI",
    name: "비치 프로퍼티스 (VICI)",
    longName: "VICI Properties Inc.",
    region: "US",
    category: "미국 배당주 · 리츠",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["리츠", "부동산", "카지노", "분기배당", "배당성장"],
    summary: "라스베이거스 시저스·MGM 등 카지노·리조트 부동산을 소유하고 임대하는 리츠입니다.",
    description:
      "VICI 프로퍼티스는 시저스 팰리스, MGM 그랜드 등 카지노·리조트 건물을 소유하고 운영사에 장기 임대하는 리츠입니다. 임차인이 건물 관련 비용을 부담하는 트리플넷(NNN) 구조라 임대 수익이 안정적이고, 계약에 물가 연동 인상 조항이 있어 배당 재원이 꾸준히 늘어 왔습니다. 2018년 상장 이후 매년 배당을 인상해 왔습니다. 카지노 산업 특성상 임차인이 소수 대형 운영사에 집중되어 있다는 점이 리스크로 거론됩니다.",
  },
  {
    symbol: "ADC",
    name: "어그리 리얼티 (ADC)",
    longName: "Agree Realty Corporation",
    region: "US",
    category: "미국 배당주 · 리츠",
    issuer: "-",
    dividendCycle: "월",
    tags: ["리츠", "부동산", "리테일", "월배당", "배당성장"],
    summary: "월마트·홈디포 등 우량 리테일 임차인에 임대하는 리츠로, 월배당을 지급합니다.",
    description:
      "어그리 리얼티는 월마트·홈디포·트랙터서플라이 등 신용도 높은 대형 리테일 기업에 매장을 임대하는 리츠입니다. 임차인이 유지비·세금·보험을 부담하는 트리플넷 구조라 현금흐름이 예측 가능하고, 2021년부터 분기배당에서 월배당으로 전환했습니다. 임차인 상당수가 온라인 경쟁에 방어적인 필수 소비 업종이라 리테일 리츠 중에서는 안정적인 편으로 평가됩니다. 금리 상승기에는 리츠 전반의 주가가 눌리므로 배당수익률과 주가 흐름을 함께 봐야 합니다.",
  },
  {
    symbol: "NNN",
    name: "NNN 리츠 (NNN)",
    longName: "NNN REIT, Inc.",
    region: "US",
    category: "미국 배당주 · 리츠",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["리츠", "부동산", "배당귀족", "분기배당", "배당성장"],
    summary: "35년 넘게 배당을 인상해 온 트리플넷 리테일 리츠로, 리츠 중 드문 배당귀족입니다.",
    description:
      "NNN 리츠(옛 내셔널 리테일 프로퍼티스)는 편의점·자동차 정비소 등 단독 매장을 장기 임대하는 리츠로, 35년 넘게 매년 배당을 인상해 리츠 중 몇 안 되는 배당귀족에 속합니다. 임차인이 모든 부동산 비용을 부담하는 트리플넷 구조에 임대 기간이 길어 공실 위험이 낮습니다. 배당 인상 폭은 크지 않지만 오랜 기간 한 번도 거르지 않았다는 점이 이 종목의 핵심입니다. 리테일 부동산이라 임차인 업종의 경기 민감도를 함께 살펴야 합니다.",
  },
  {
    symbol: "STAG",
    name: "스태그 인더스트리얼 (STAG)",
    longName: "STAG Industrial, Inc.",
    region: "US",
    category: "미국 배당주 · 리츠",
    issuer: "-",
    dividendCycle: "월",
    tags: ["리츠", "부동산", "물류창고", "월배당"],
    summary: "물류창고·산업용 부동산을 임대하는 월배당 리츠로, 전자상거래 확산의 수혜를 받습니다.",
    description:
      "스태그 인더스트리얼은 미국 전역의 물류창고·경공업 건물을 소유하고 임대하는 산업용 리츠로, 월배당을 지급합니다. 전자상거래 확산으로 물류 공간 수요가 늘며 임대 여건이 개선돼 왔습니다. 임차인이 특정 산업에 쏠리지 않고 여러 업종에 분산돼 있어 개별 임차인 위험이 낮은 편입니다. 배당 인상 폭은 완만하며, 금리와 산업 경기에 따라 주가 변동이 있으므로 월배당 현금흐름과 주가 흐름을 함께 봐야 합니다.",
  },
  {
    symbol: "ARCC",
    name: "에이리스 캐피털 (ARCC)",
    longName: "Ares Capital Corporation",
    region: "US",
    category: "미국 배당주 · BDC",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["BDC", "고배당", "사모대출", "분기배당"],
    summary: "중소기업에 대출하는 미국 최대 BDC로 배당수익률이 높지만, 경기 침체에 민감합니다.",
    description:
      "에이리스 캐피털은 중소·중견기업에 자금을 빌려주고 이자를 받아 배당으로 분배하는 미국 최대 규모의 BDC(사업개발회사)입니다. 배당수익률이 미국 대형주 중 높은 축에 속하며, 대출 금리에 연동돼 금리 상승기에 이자 수익이 늘어나는 구조입니다. 다만 BDC는 경기 침체기에 대출 기업의 부실이 늘면 배당이 흔들릴 수 있어, 안정적인 리츠·배당킹과는 성격이 다릅니다. 높은 배당수익률의 대가로 신용 위험을 진다는 점을 이해하고 접근해야 합니다.",
  },
  {
    symbol: "SCHW",
    name: "찰스 슈왑 (SCHW)",
    longName: "The Charles Schwab Corporation",
    region: "US",
    category: "미국 배당주 · 금융",
    issuer: "-",
    dividendCycle: "분기",
    tags: ["금융", "증권", "분기배당", "배당성장"],
    summary: "미국 최대 온라인 증권사로, 배당 성장률이 높은 편인 금융 배당주입니다.",
    description:
      "찰스 슈왑은 미국 최대 온라인 증권사로, 개인 투자자의 위탁매매·자산관리를 중심으로 사업을 운영합니다. 최근 5년 배당 성장률이 미국 배당주 중 높은 축에 속해, 현재 배당수익률은 낮아도 배당이 빠르게 늘어 왔습니다. 다만 증권사 특성상 실적이 시장 상황과 금리에 좌우되며, 2023년 지역은행 위기 때는 고객 예금 이탈 우려로 주가가 크게 흔들린 바 있습니다. 배당 성장성과 실적 변동성을 함께 보아야 하는 종목입니다.",
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
  ["QQQ", "QQQM"],
  ["SCHD", "O"],
  ["O", "JEPI"],
  ["SCHD", "DGRW"],
  ["VIG", "DGRO"],
  ["NOBL", "SCHD"],
  ["SPHD", "JEPI"],
  ["VYM", "HDV"],
  ["DIVO", "JEPI"],
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
