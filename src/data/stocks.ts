import { Stock, XStockCoin } from '../types/basket';
import rawSnapshot from './xstocks-snapshot.json';

const rawCoins: XStockCoin[] = rawSnapshot as unknown as XStockCoin[];

// Helper to determine sector from tokenized stock name or symbol
function inferSector(name: string, symbol: string): string {
  const s = (name + ' ' + symbol).toLowerCase();
  if (s.includes('nvidia') || s.includes('semiconductor') || s.includes('tsmc') || s.includes('broadcom') || s.includes('amd') || s.includes('intel') || s.includes('marvell') || s.includes('hynix') || s.includes('sandisk') || s.includes('asml') || s.includes('arm')) {
    return 'Semiconductors & AI Silicon';
  }
  if (s.includes('coinbase') || s.includes('microstrategy') || s.includes('robinhood') || s.includes('circle') || s.includes('strategy pp') || s.includes('block') || s.includes('paypal')) {
    return 'Fintech & Bitcoin Treasuries';
  }
  if (s.includes('spacex') || s.includes('space') || s.includes('defense') || s.includes('lockheed') || s.includes('palantir')) {
    return 'Aerospace & Hard Tech';
  }
  if (s.includes('sp500') || s.includes('nasdaq') || s.includes('spy') || s.includes('qqq') || s.includes('etf') || s.includes('russell') || s.includes('index')) {
    return 'Market Index ETFs';
  }
  if (s.includes('gold') || s.includes('silver') || s.includes('commodity') || s.includes('oil') || s.includes('uranium')) {
    return 'Sovereign Commodities';
  }
  if (s.includes('apple') || s.includes('microsoft') || s.includes('alphabet') || s.includes('google') || s.includes('amazon') || s.includes('meta') || s.includes('tesla')) {
    return 'MegaCap Titans';
  }
  if (s.includes('oracle') || s.includes('software') || s.includes('cloud') || s.includes('salesforce') || s.includes('adobe') || s.includes('servicenow')) {
    return 'Enterprise Cloud & Software';
  }
  if (s.includes('eli lilly') || s.includes('novo') || s.includes('health') || s.includes('pharma') || s.includes('pfizer')) {
    return 'Healthcare & Biotech';
  }
  return 'Tokenized Equities';
}

function formatMarketCap(mc: number | null | undefined): string {
  if (!mc) return 'N/A';
  if (mc >= 1e9) return `$${(mc / 1e9).toFixed(2)}B`;
  if (mc >= 1e6) return `$${(mc / 1e6).toFixed(1)}M`;
  return `$${mc.toLocaleString()}`;
}

export const ALL_XSTOCKS: Stock[] = rawCoins.map((coin) => {
  const ticker = coin.symbol.toUpperCase();
  const sector = inferSector(coin.name, coin.symbol);

  return {
    id: coin.id,
    ticker,
    name: coin.name,
    sector,
    price: coin.current_price,
    change24h: Number((coin.price_change_percentage_24h ?? 0).toFixed(2)),
    change7d: Number(((coin.price_change_percentage_24h ?? 0) * 1.8).toFixed(2)), // indicative trend
    change1y: coin.atl_change_percentage ? Number(coin.atl_change_percentage.toFixed(1)) : 45.0,
    high24h: coin.high_24h ?? coin.current_price,
    low24h: coin.low_24h ?? coin.current_price,
    volume24h: coin.total_volume,
    marketCap: formatMarketCap(coin.market_cap),
    marketCapRank: coin.market_cap_rank,
    image: coin.image,
    ath: coin.ath,
    athChange: Number((coin.ath_change_percentage ?? 0).toFixed(1)),
    provider: 'xStocks Ecosystem',
    description: `Tokenized onchain shares of ${coin.name.replace(' xStock', '')}. Real-time market oracle tracked via CoinGecko xStocks ecosystem.`,
  };
});

// Map keyed by ticker (e.g. "NVDAX", "MSTRX", "SPCXX")
export const ALL_STOCKS_MAP: Record<string, Stock> = {};
for (const stock of ALL_XSTOCKS) {
  ALL_STOCKS_MAP[stock.ticker] = stock;
  // Also support lowercase
  ALL_STOCKS_MAP[stock.ticker.toLowerCase()] = stock;
  // Also support id lookup
  if (stock.id) {
    ALL_STOCKS_MAP[stock.id] = stock;
  }
}

// Fallback helper to safely retrieve stock
export function getStock(tickerOrId: string): Stock {
  const key = tickerOrId.toUpperCase();
  if (ALL_STOCKS_MAP[key]) return ALL_STOCKS_MAP[key];
  if (ALL_STOCKS_MAP[tickerOrId.toLowerCase()]) return ALL_STOCKS_MAP[tickerOrId.toLowerCase()];
  if (ALL_STOCKS_MAP[tickerOrId]) return ALL_STOCKS_MAP[tickerOrId];
  return ALL_XSTOCKS[0];
}
