// 통합한 블로그 글의 옛 주소 → 남긴 글 (검색 유입·백링크 보존)
const MERGED_POSTS = {
  'dividend-reinvestment': 'drip-complete-guide',
  'etf-tax-guide': 'korean-tax-us-etf',
  'isa-pension-dividend-etf': 'account-comparison-dividend',
  'high-dividend-etf-strategy': 'monthly-1million-dividend-portfolio',
  'jepi-jepq-analysis': 'monthly-dividend-deep-dive',
};

const nextConfig = {
  async redirects() {
    return Object.entries(MERGED_POSTS).map(([from, to]) => ({
      source: `/blog/${from}`,
      destination: `/blog/${to}`,
      permanent: true,
    }));
  },
};
export default nextConfig;
