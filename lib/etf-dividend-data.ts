// Known ETF dividend patterns for accurate display
// Used when Yahoo Finance data is incomplete
export const knownDividendPatterns: Record<string, { months: number[]; count: number }> = {
  JEPQ: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], count: 12 }, // Monthly dividend
  JEPI: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], count: 12 }, // Monthly dividend
  QQQI: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], count: 12 }, // Monthly dividend
}

export const getKnownDividendPattern = (symbol: string) => {
  const pattern = knownDividendPatterns[symbol.toUpperCase()]
  if (pattern) {
    return {
      dividendMonths: pattern.months,
      yearlyCount: pattern.count,
    }
  }
  return null
}
