export type RiskTier = 'Low' | 'Moderate' | 'High' | 'Aggressive';

export type BasketCategory =
  | 'All'
  | 'MegaCap Titans'
  | 'AI & Silicon Compute'
  | 'Healthcare & Essential Medicines'
  | 'Global Banking & Card Rails'
  | 'Fintech & Bitcoin Rails'
  | 'Private & Pre-IPO Tech'
  | 'Market Index ETFs'
  | 'Value & Cashflow Fortress'
  | 'Energy & Real Commodities';

export type StockProvider =
  | 'xStocks Ecosystem'
  | 'Pyth Oracle'
  | 'PreStocks (Pre-IPO)'
  | 'Tessera Private';

export interface XStockCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  circulating_supply: number;
  total_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface Stock {
  id?: string;
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change24h: number;
  change7d?: number;
  change1y?: number;
  high24h?: number;
  low24h?: number;
  volume24h?: number;
  marketCap: string;
  marketCapRank?: number | null;
  image?: string;
  ath?: number;
  athChange?: number;
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
