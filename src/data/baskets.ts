import { Basket, BasketConstituent } from '../types/basket';
import { getStock } from './stocks';

function makeConstituent(ticker: string, weight: number): BasketConstituent {
  return {
    stock: getStock(ticker),
    weight,
  };
}

// Compute dynamic NAV from constituents
function calculateBasketNav(constituents: BasketConstituent[]): number {
  return Number(
    constituents
      .reduce((acc, curr) => acc + curr.stock.price * (curr.weight / 100), 0)
      .toFixed(2)
  );
}

// Compute dynamic 24h % rise from constituents
function calculateBasket24h(constituents: BasketConstituent[]): number {
  return Number(
    constituents
      .reduce((acc, curr) => acc + curr.stock.change24h * (curr.weight / 100), 0)
      .toFixed(2)
  );
}

// Basket 1: Magnificent 7 Titans
const mag7Constituents: BasketConstituent[] = [
  makeConstituent('NVDAX', 22),
  makeConstituent('MSFTX', 18),
  makeConstituent('AAPLX', 16),
  makeConstituent('AMZNX', 14),
  makeConstituent('METAX', 12),
  makeConstituent('GOOGLX', 10),
  makeConstituent('TSLAX', 8),
];

// Basket 2: Autonomous AI & Silicon Grid
const aiSiliconConstituents: BasketConstituent[] = [
  makeConstituent('NVDAX', 35),
  makeConstituent('TSMX', 25),
  makeConstituent('AVGOX', 15),
  makeConstituent('AMDX', 15),
  makeConstituent('ORCLX', 10),
];

// Basket 3: Fintech & Bitcoin Rails
const bitcoinFintechConstituents: BasketConstituent[] = [
  makeConstituent('MSTRX', 35),
  makeConstituent('COINX', 25),
  makeConstituent('CRCLX', 20),
  makeConstituent('HOODX', 10),
  makeConstituent('STRCX', 10),
];

// Basket 4: Orbital Space & Hard Tech
const orbitalConstituents: BasketConstituent[] = [
  makeConstituent('SPCXX', 45), // SpaceX xStock!
  makeConstituent('TSLAX', 35),
  makeConstituent('CRCLX', 20),
];

// Basket 5: Macro Sovereign & Index Anchor (Includes Berkshire BRK.BX)
const macroIndexConstituents: BasketConstituent[] = [
  makeConstituent('SPYX', 30),   // S&P 500 Index
  makeConstituent('BRK.BX', 25), // Berkshire Hathaway Conglomerate
  makeConstituent('QQQX', 20),   // Nasdaq 100 Index
  makeConstituent('GLDX', 15),   // Physical Gold
  makeConstituent('TQQQX', 10),  // 3x Leveraged Nasdaq
];

// Basket 6: Memory & Semiconductor Momentum
const semiMomentumConstituents: BasketConstituent[] = [
  makeConstituent('SNDKX', 30), // Sandisk xStock
  makeConstituent('SKHYX', 25), // SK Hynix xStock
  makeConstituent('MRVLX', 25), // Marvell xStock
  makeConstituent('INTCX', 20), // Intel xStock
];

// Basket 7: Consumer Monopolies & Daily Essentials (MCD, KO, PEP, PG, WMT, JNJ)
const valueCashflowConstituents: BasketConstituent[] = [
  makeConstituent('MCDX', 20), // McDonald's xStock
  makeConstituent('KOX', 20),  // Coca-Cola xStock
  makeConstituent('PEPX', 20), // PepsiCo xStock
  makeConstituent('PGX', 15),  // Procter & Gamble xStock
  makeConstituent('WMTX', 15), // Walmart xStock
  makeConstituent('JNJX', 10), // Johnson & Johnson xStock
];

// Basket 8: Energy Sovereignty & Real Commodities (CVXX, XOMX, GLDX, SLVX, URAX)
const energyCommoditiesConstituents: BasketConstituent[] = [
  makeConstituent('CVXX', 30),  // Chevron xStock
  makeConstituent('XOMX', 25),  // Exxon Mobil xStock
  makeConstituent('GLDX', 20),  // Physical Gold xStock
  makeConstituent('SLVX', 15),  // iShares Silver Trust xStock
  makeConstituent('URAX', 10),  // Global X Uranium ETF xStock
];

export const STOCK_BASKETS: Basket[] = [
  {
    id: 'consumer-monopolies-essentials',
    slug: 'consumer-monopolies-essentials',
    title: 'Consumer Monopolies & Daily Essentials',
    tagline: 'Recession-proof daily staples, global brand pricing power, and compounding dividend aristocrats.',
    description:
      'Featuring McDonald’s (MCDX), Coca-Cola (KOX), PepsiCo (PEPX), Procter & Gamble (PGX), Walmart (WMTX), and Johnson & Johnson (JNJX). Built for unshakeable brand pricing power, essential household demand, and compounding dividend returns.',
    category: 'Value & Cashflow Fortress',
    riskTier: 'Low',
    minInvestmentUsdc: 25,
    nav: calculateBasketNav(valueCashflowConstituents),
    returns: {
      d1: calculateBasket24h(valueCashflowConstituents),
      w1: 1.9,
      m1: 5.2,
      y1: 31.8,
      allTime: 72.0,
    },
    rebalanceFrequency: 'Quarterly',
    lastRebalanced: 'Oct 01, 2026',
    curator: {
      name: 'Omaha Quantitative Wealth',
      handle: '@omaha_value',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      reputationScore: 99.7,
      followers: 28400,
      feePercent: 0.10,
      verified: true,
    },
    constituents: valueCashflowConstituents,
    historicalChart: [
      { date: 'Nov 23', nav: 240, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 252, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 268, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 278, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 288, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 298, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 308, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 318, sp500: 132, sol: 245 },
    ],
    tags: ['McDonalds MCD', 'PepsiCo PEP', 'Coca-Cola KO', 'Procter & Gamble PG', 'Walmart WMT', 'Johnson & Johnson JNJ'],
    solanaMintPreview: 'StkConsumerMoat0039xYyZ91',
    isFeatured: true,
  },
  {
    id: 'energy-sovereign-commodities',
    slug: 'energy-sovereign-commodities',
    title: 'Energy Sovereignty & Real Commodities',
    tagline: 'Sovereign oil supermajors, clean nuclear fuel, and physical monetary metals.',
    description:
      'A tangible asset fortress combining Chevron (CVXX), Exxon Mobil (XOMX), Physical Gold (GLDX), Silver (SLVX), and Uranium (URAX). Designed as an unshakeable hedge against fiat inflation and global supply chain shocks.',
    category: 'Energy & Real Commodities',
    riskTier: 'Moderate',
    minInvestmentUsdc: 30,
    nav: calculateBasketNav(energyCommoditiesConstituents),
    returns: {
      d1: calculateBasket24h(energyCommoditiesConstituents),
      w1: 2.4,
      m1: 7.1,
      y1: 38.6,
      allTime: 84.0,
    },
    rebalanceFrequency: 'Quarterly',
    lastRebalanced: 'Oct 01, 2026',
    curator: {
      name: 'Commodity Macro Fund',
      handle: '@macro_real',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      reputationScore: 98.9,
      followers: 16200,
      feePercent: 0.20,
      verified: true,
    },
    constituents: energyCommoditiesConstituents,
    historicalChart: [
      { date: 'Nov 23', nav: 190, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 205, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 220, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 235, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 245, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 252, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 260, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 268, sp500: 132, sol: 245 },
    ],
    tags: ['Chevron CVX', 'Exxon XOM', 'Gold GLD', 'Silver SLV', 'Uranium URA', 'Real Assets'],
    solanaMintPreview: 'StkEnergyRealAssets0918X',
    isFeatured: false,
  },
  {
    id: 'mag7-titans-xstock',
    slug: 'mag7-titans-xstock',
    title: 'Magnificent 7 Titans xStock',
    tagline: 'Equal-weighted tokenized exposure to the world’s most dominant mega-cap tech empires.',
    description:
      'Tokenized xStock basket capturing the primary drivers of global index performance: Apple, Microsoft, Nvidia, Alphabet, Amazon, Meta, and Tesla. Sourced live from the CoinGecko xStocks ecosystem with 24/7 onchain liquidity.',
    category: 'MegaCap Titans',
    riskTier: 'Moderate',
    minInvestmentUsdc: 50,
    nav: calculateBasketNav(mag7Constituents),
    returns: {
      d1: calculateBasket24h(mag7Constituents),
      w1: 3.8,
      m1: 8.4,
      y1: 52.6,
      allTime: 124.0,
    },
    rebalanceFrequency: 'Quarterly',
    lastRebalanced: 'Oct 01, 2026',
    curator: {
      name: 'IndexCraft Research',
      handle: '@indexcraft',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      reputationScore: 99.8,
      followers: 34100,
      feePercent: 0.15,
      verified: true,
    },
    constituents: mag7Constituents,
    historicalChart: [
      { date: 'Nov 23', nav: 280, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 310, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 350, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 375, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 405, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 415, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 428, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 442, sp500: 132, sol: 245 },
    ],
    tags: ['CoinGecko xStocks', 'MegaCap Tech', 'Low Fee', 'Institutional Grade'],
    solanaMintPreview: 'StkMag7xTitans99xZtL21B4W',
    isFeatured: true,
  },
  {
    id: 'ai-silicon-grid',
    slug: 'ai-silicon-grid',
    title: 'Autonomous AI & Silicon Grid',
    tagline: 'High-conviction tokenized semiconductors powering frontier AI training & inference compute.',
    description:
      'Concentrated allocation in the global silicon supply chain: Nvidia, TSMC, Broadcom, AMD, and Oracle. Backed by real-time xStock token contracts and global datacenter capex demand.',
    category: 'AI & Silicon Compute',
    riskTier: 'High',
    minInvestmentUsdc: 50,
    nav: calculateBasketNav(aiSiliconConstituents),
    returns: {
      d1: calculateBasket24h(aiSiliconConstituents),
      w1: 6.2,
      m1: 16.4,
      y1: 118.2,
      allTime: 235.0,
    },
    rebalanceFrequency: 'Monthly',
    lastRebalanced: 'Oct 05, 2026',
    curator: {
      name: 'Solana Quantitative Capital',
      handle: '@solquant',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      reputationScore: 99.4,
      followers: 18900,
      feePercent: 0.25,
      verified: true,
    },
    constituents: aiSiliconConstituents,
    historicalChart: [
      { date: 'Nov 23', nav: 180, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 225, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 275, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 310, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 360, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 395, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 430, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 468, sp500: 132, sol: 245 },
    ],
    tags: ['Nvidia xStock', 'TSMC Foundry', 'High Alpha', 'Hypergrowth'],
    solanaMintPreview: 'StkAIComputeGrid4L8x9Gq2Qz',
    isFeatured: true,
  },
  {
    id: 'bitcoin-fintech-rails',
    slug: 'bitcoin-fintech-rails',
    title: 'Bitcoin Treasuries & Onchain FinTech',
    tagline: 'Public equities leveraging digital assets as primary reserve balance sheet assets.',
    description:
      'Combining MicroStrategy (MSTRx), Coinbase (COINx), Circle (CRCLx), Robinhood (HOODx), and Strategy PP (STRCx). Captures sovereign institutional adoption of Bitcoin and stablecoin settlement volume.',
    category: 'Fintech & Bitcoin Rails',
    riskTier: 'Aggressive',
    minInvestmentUsdc: 25,
    nav: calculateBasketNav(bitcoinFintechConstituents),
    returns: {
      d1: calculateBasket24h(bitcoinFintechConstituents),
      w1: 8.9,
      m1: 21.5,
      y1: 138.4,
      allTime: 290.0,
    },
    rebalanceFrequency: 'Monthly',
    lastRebalanced: 'Oct 08, 2026',
    curator: {
      name: 'Superteam Yield Guild',
      handle: '@superteam_fin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      reputationScore: 98.1,
      followers: 24300,
      feePercent: 0.25,
      verified: true,
    },
    constituents: bitcoinFintechConstituents,
    historicalChart: [
      { date: 'Nov 23', nav: 110, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 145, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 195, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 175, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 210, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 200, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 245, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 265, sp500: 132, sol: 245 },
    ],
    tags: ['MSTRx Treasury', 'Coinbase xStock', 'Circle CRCLx', 'Bitcoin Beta'],
    solanaMintPreview: 'StkBtcRailsX190Pk4R2m09',
    isFeatured: true,
  },
  {
    id: 'orbital-space-hard-tech',
    slug: 'orbital-space-hard-tech',
    title: 'Orbital Space & Pre-IPO Hard Tech',
    tagline: 'Private space flight dominance and orbital internet constellations on Solana.',
    description:
      'Anchored by SpaceX xStock (SPCXx), Tesla xStock (TSLAx), and Circle xStock (CRCLx). Combines launch vehicle cadence, Starlink subscriber expansion, and automated robotics.',
    category: 'Private & Pre-IPO Tech',
    riskTier: 'Aggressive',
    minInvestmentUsdc: 75,
    nav: calculateBasketNav(orbitalConstituents),
    returns: {
      d1: calculateBasket24h(orbitalConstituents),
      w1: 4.8,
      m1: 14.1,
      y1: 86.4,
      allTime: 165.0,
    },
    rebalanceFrequency: 'Quarterly',
    lastRebalanced: 'Sep 20, 2026',
    curator: {
      name: 'Stratosphere Analytics',
      handle: '@strato_cap',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      reputationScore: 98.6,
      followers: 11500,
      feePercent: 0.30,
      verified: true,
    },
    constituents: orbitalConstituents,
    historicalChart: [
      { date: 'Nov 23', nav: 130, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 155, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 180, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 205, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 220, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 235, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 248, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 260, sp500: 132, sol: 245 },
    ],
    tags: ['SpaceX SPCXx', 'Starlink', 'Tesla TSLAx', 'Private Equity'],
    solanaMintPreview: 'StkSpaceHardTechQ5509Lop',
    isFeatured: false,
  },
  {
    id: 'macro-sovereign-anchor',
    slug: 'macro-sovereign-anchor',
    title: 'Macro Sovereign & Index Anchor',
    tagline: 'Defensive, benchmark-weighted index exposure backed by tokenized S&P 500, Nasdaq & Gold.',
    description:
      'Balanced asset allocation between tokenized S&P 500 (SPYX), Nasdaq 100 (QQQX), Physical Gold (GLDX), and Leveraged Tech (TQQQX). Ideal foundation for diversified passive compounding.',
    category: 'Market Index ETFs',
    riskTier: 'Low',
    minInvestmentUsdc: 25,
    nav: calculateBasketNav(macroIndexConstituents),
    returns: {
      d1: calculateBasket24h(macroIndexConstituents),
      w1: 1.2,
      m1: 4.1,
      y1: 32.4,
      allTime: 72.0,
    },
    rebalanceFrequency: 'Quarterly',
    lastRebalanced: 'Oct 01, 2026',
    curator: {
      name: 'SafeHarbor Wealth DAO',
      handle: '@safeharbor',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      reputationScore: 99.5,
      followers: 29800,
      feePercent: 0.10,
      verified: true,
    },
    constituents: macroIndexConstituents,
    historicalChart: [
      { date: 'Nov 23', nav: 420, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 450, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 480, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 505, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 530, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 545, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 560, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 575, sp500: 132, sol: 245 },
    ],
    tags: ['S&P 500 SPYX', 'Nasdaq QQQX', 'Gold GLDX', 'Capital Preservation'],
    solanaMintPreview: 'StkMacroAnchor0039xYyZ91',
    isFeatured: false,
  },
  {
    id: 'memory-silicon-momentum',
    slug: 'memory-silicon-momentum',
    title: 'High-Beta Semiconductor Momentum',
    tagline: 'High-volatility tokenized semiconductor leaders in memory storage and custom ASICs.',
    description:
      'High-beta momentum basket capturing flash storage, high-bandwidth memory (HBM3e), and custom silicon packaging via Sandisk (SNDKX), SK Hynix (SKHYX), Marvell (MRVLX), and Intel (INTCX).',
    category: 'AI & Silicon Compute',
    riskTier: 'High',
    minInvestmentUsdc: 35,
    nav: calculateBasketNav(semiMomentumConstituents),
    returns: {
      d1: calculateBasket24h(semiMomentumConstituents),
      w1: 5.4,
      m1: 12.8,
      y1: 94.2,
      allTime: 180.0,
    },
    rebalanceFrequency: 'Monthly',
    lastRebalanced: 'Oct 02, 2026',
    curator: {
      name: 'VentureDAO Solana',
      handle: '@venture_sol',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      reputationScore: 98.3,
      followers: 14700,
      feePercent: 0.25,
      verified: true,
    },
    constituents: semiMomentumConstituents,
    historicalChart: [
      { date: 'Nov 23', nav: 210, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 260, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 310, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 340, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 390, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 410, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 450, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 485, sp500: 132, sol: 245 },
    ],
    tags: ['Sandisk SNDKX', 'SK Hynix', 'Marvell MRVLX', 'Semiconductor Momentum'],
    solanaMintPreview: 'StkMemoryMomentum9019Xy',
    isFeatured: false,
  },
];
