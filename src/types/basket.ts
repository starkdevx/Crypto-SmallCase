export type RiskTier = 'Low' | 'Moderate' | 'High' | 'Aggressive';

export type BasketCategory =
  | 'All'
  | 'AI & Compute'
  | 'Pre-IPO Giants'
  | 'MegaCap 7'
  | 'Fintech & Crypto Rails'
  | 'Aerospace & Defense'
  | 'High Yield & Dividends';

export type StockProvider =
  | 'Pyth Oracle'
  | 'PreStocks (Pre-IPO)'
  | 'Tessera Private'
  | 'xStocks Tokenized';

export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change24h: number;
  change7d: number;
  change1y: number;
  marketCap: string;
  provider: StockProvider;
  description: string;
}

export interface BasketConstituent {
  stock: Stock;
  weight: number; // Percentage (e.g. 25 for 25%)
}

export interface BasketReturns {
  d1: number;
  w1: number;
  m1: number;
  y1: number;
  allTime: number;
}

export interface BasketCurator {
  name: string;
  handle: string;
  avatar: string;
  reputationScore: number;
  followers: number;
  feePercent: number;
  verified: boolean;
}

export interface ChartDataPoint {
  date: string;
  nav: number;
  sp500: number;
  sol: number;
}

export interface Basket {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: Exclude<BasketCategory, 'All'>;
  riskTier: RiskTier;
  minInvestmentUsdc: number;
  nav: number;
  returns: BasketReturns;
  rebalanceFrequency: 'Weekly' | 'Monthly' | 'Quarterly';
  lastRebalanced: string;
  curator: BasketCurator;
  constituents: BasketConstituent[];
  historicalChart: ChartDataPoint[];
  tags: string[];
  solanaMintPreview: string;
  isFeatured?: boolean;
}

export type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';
