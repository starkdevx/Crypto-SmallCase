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

// Basket 2: Frontier AI & Semiconductor Monopolies
const aiSiliconConstituents: BasketConstituent[] = [
  makeConstituent('NVDAX', 20),
  makeConstituent('TSMX', 20),
  makeConstituent('ASMLX', 15),
  makeConstituent('AVGOX', 15),
  makeConstituent('AMDX', 10),
  makeConstituent('MRVLX', 10),
  makeConstituent('INTCX', 10),
];

// Basket 3: Fintech & Bitcoin Rails
const bitcoinFintechConstituents: BasketConstituent[] = [
  makeConstituent('MSTRX', 35),
  makeConstituent('COINX', 25),
  makeConstituent('CRCLX', 20),
  makeConstituent('HOODX', 10),
  makeConstituent('STRCX', 10),
];


// Basket 5: Macro Sovereign & Index Anchor (Includes Berkshire BRK.BX)
const macroIndexConstituents: BasketConstituent[] = [
  makeConstituent('SPYX', 30),   // S&P 500 Index
  makeConstituent('BRK.BX', 25), // Berkshire Hathaway Conglomerate
  makeConstituent('QQQX', 20),   // Nasdaq 100 Index
  makeConstituent('GLDX', 15),   // Physical Gold
  makeConstituent('TQQQX', 10),  // 3x Leveraged Nasdaq
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

// Basket: Human Health & Life-Saving Medicines (NVOX, PFEX, AZNX, MRKX, ABBVX, MRNAX, UNHX)
const healthMedicinesConstituents: BasketConstituent[] = [
  makeConstituent('NVOX', 20),  // Novo Nordisk xStock (Diabetes & Ozempic/Wegovy)
  makeConstituent('PFEX', 15),  // Pfizer xStock (Vaccines & everyday pharmaceuticals)
  makeConstituent('AZNX', 15),  // AstraZeneca xStock (Cardiovascular & oncology treatments)
  makeConstituent('MRKX', 15),  // Merck xStock (Cancer immunotherapy & essential drugs)
  makeConstituent('ABBVX', 15), // AbbVie xStock (Immunology & arthritis medicines)
  makeConstituent('MRNAX', 10), // Moderna xStock (mRNA vaccines & preventive medicine)
  makeConstituent('UNHX', 10),  // UnitedHealth xStock (Healthcare services & medical access)
];

// Basket: Global Financial Hegemons & Card Rails (JPMX, VX, MAX, GSX, BACX, PYPLX)
const globalBankingConstituents: BasketConstituent[] = [
  makeConstituent('JPMX', 25),  // JPMorgan Chase xStock
  makeConstituent('VX', 20),    // Visa xStock
  makeConstituent('MAX', 20),   // Mastercard xStock
  makeConstituent('GSX', 15),   // Goldman Sachs xStock
  makeConstituent('BACX', 10),  // Bank of America xStock
  makeConstituent('PYPLX', 10), // PayPal xStock
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
    nav: 157.65,
    returns: {
      d1: calculateBasket24h(valueCashflowConstituents),
      w1: 1.35,
      m1: -2.54,
      y1: -4.83,
      allTime: -4.83,
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
      { date: 'Oct 12', nav: 165.65 },
      { date: 'Oct 27', nav: 168.39 },
      { date: 'Nov 11', nav: 163.66 },
      { date: 'Nov 26', nav: 167.73 },
      { date: 'Dec 11', nav: 168.79 },
      { date: 'Dec 26', nav: 170.6 },
      { date: 'Jan 10', nav: 169.34 },
      { date: 'Jan 25', nav: 171.32 },
      { date: 'Feb 9', nav: 182.6 },
      { date: 'Feb 24', nav: 184.11 },
      { date: 'Mar 11', nav: 179.25 },
      { date: 'Mar 26', nav: 170.54 },
      { date: 'Apr 10', nav: 172.95 },
      { date: 'Apr 25', nav: 169.43 },
      { date: 'May 10', nav: 170.48 },
      { date: 'May 25', nav: 167.1 },
      { date: 'Jun 9', nav: 167.01 },
      { date: 'Jun 24', nav: 166.73 },
      { date: 'Jul 9', nav: 167.97 },
      { date: 'Jul 24', nav: 162.37 },
      { date: 'Aug 8', nav: 166.25 },
      { date: 'Aug 23', nav: 167.18 },
      { date: 'Sep 7', nav: 167.75 },
      { date: 'Sep 22', nav: 159.82 },
      { date: 'Oct 7', nav: 156.27 },
      { date: 'Oct 12', nav: 157.65 },
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
    nav: 197.82,
    returns: {
      d1: calculateBasket24h(energyCommoditiesConstituents),
      w1: 0.57,
      m1: -0.91,
      y1: 10.68,
      allTime: 10.68,
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
      { date: 'Oct 12', nav: 178.73 },
      { date: 'Oct 27', nav: 165.04 },
      { date: 'Nov 11', nav: 162.5 },
      { date: 'Nov 26', nav: 165.06 },
      { date: 'Dec 11', nav: 173.75 },
      { date: 'Dec 26', nav: 180 },
      { date: 'Jan 10', nav: 185 },
      { date: 'Jan 25', nav: 198.97 },
      { date: 'Feb 9', nav: 203.81 },
      { date: 'Feb 24', nav: 208.36 },
      { date: 'Mar 11', nav: 205.29 },
      { date: 'Mar 26', nav: 187.98 },
      { date: 'Apr 10', nav: 195.68 },
      { date: 'Apr 25', nav: 196.76 },
      { date: 'May 10', nav: 189.18 },
      { date: 'May 25', nav: 184.95 },
      { date: 'Jun 9', nav: 184.55 },
      { date: 'Jun 24', nav: 180.24 },
      { date: 'Jul 9', nav: 190.87 },
      { date: 'Jul 24', nav: 190.26 },
      { date: 'Aug 8', nav: 194.18 },
      { date: 'Aug 23', nav: 200.23 },
      { date: 'Sep 7', nav: 199.79 },
      { date: 'Sep 22', nav: 200.9 },
      { date: 'Oct 7', nav: 197.2 },
      { date: 'Oct 12', nav: 197.82 },
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
    nav: 391.24,
    returns: {
      d1: calculateBasket24h(mag7Constituents),
      w1: 0.1,
      m1: 6.16,
      y1: 11.31,
      allTime: 11.31,
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
      { date: 'Oct 12', nav: 351.48 },
      { date: 'Oct 27', nav: 369.66 },
      { date: 'Nov 11', nav: 358.34 },
      { date: 'Nov 26', nav: 344.39 },
      { date: 'Dec 11', nav: 348.41 },
      { date: 'Dec 26', nav: 356.85 },
      { date: 'Jan 10', nav: 352.02 },
      { date: 'Jan 25', nav: 345.7 },
      { date: 'Feb 9', nav: 336.79 },
      { date: 'Feb 24', nav: 322.7 },
      { date: 'Mar 11', nav: 327.65 },
      { date: 'Mar 26', nav: 308.23 },
      { date: 'Apr 10', nav: 316.73 },
      { date: 'Apr 25', nav: 347.94 },
      { date: 'May 10', nav: 355.89 },
      { date: 'May 25', nav: 357.23 },
      { date: 'Jun 9', nav: 342.03 },
      { date: 'Jun 24', nav: 324.83 },
      { date: 'Jul 9', nav: 338.46 },
      { date: 'Jul 24', nav: 330.29 },
      { date: 'Aug 8', nav: 360.1 },
      { date: 'Aug 23', nav: 350.73 },
      { date: 'Sep 7', nav: 365.65 },
      { date: 'Sep 22', nav: 386.17 },
      { date: 'Oct 7', nav: 392.31 },
      { date: 'Oct 12', nav: 391.24 },
    ],
    tags: ['CoinGecko xStocks', 'MegaCap Tech', 'Low Fee', 'Institutional Grade'],
    solanaMintPreview: 'StkMag7xTitans99xZtL21B4W',
    isFeatured: true,
  },
  {
    id: 'ai-silicon-grid',
    slug: 'ai-silicon-grid',
    title: 'Frontier AI & Semiconductor Monopolies',
    tagline: 'The unassailable global monopolies powering artificial intelligence — from ASML EUV lithography to Nvidia GPUs and TSMC foundries.',
    description:
      'The definitive full-stack AI hardware fortress. Combines the world’s most critical semiconductor monopolies and designers: ASML (100% EUV lithography monopoly), TSMC (leading-edge foundries), NVIDIA (GPU compute & CUDA moat), Broadcom (custom AI ASICs), AMD (accelerators), Marvell (custom silicon & electro-optics), and Intel (silicon fabrication).',
    category: 'AI & Silicon Compute',
    riskTier: 'High',
    minInvestmentUsdc: 50,
    nav: 561.62,
    returns: {
      d1: calculateBasket24h(aiSiliconConstituents),
      w1: -0.23,
      m1: 0.63,
      y1: 34.82,
      allTime: 34.82,
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
      { date: 'Oct 12', nav: 416.57 },
      { date: 'Oct 27', nav: 433.06 },
      { date: 'Nov 11', nav: 456.51 },
      { date: 'Nov 26', nav: 492.62 },
      { date: 'Dec 11', nav: 481.11 },
      { date: 'Dec 26', nav: 436.91 },
      { date: 'Jan 10', nav: 495.19 },
      { date: 'Jan 25', nav: 481.99 },
      { date: 'Feb 9', nav: 499.62 },
      { date: 'Feb 24', nav: 511.17 },
      { date: 'Mar 11', nav: 519.57 },
      { date: 'Mar 26', nav: 593.06 },
      { date: 'Apr 10', nav: 529.15 },
      { date: 'Apr 25', nav: 561.7 },
      { date: 'May 10', nav: 559.85 },
      { date: 'May 25', nav: 546 },
      { date: 'Jun 9', nav: 545.35 },
      { date: 'Jun 24', nav: 556.51 },
      { date: 'Jul 9', nav: 551.75 },
      { date: 'Jul 24', nav: 556.25 },
      { date: 'Aug 8', nav: 569.02 },
      { date: 'Aug 23', nav: 560.1 },
      { date: 'Sep 7', nav: 560.94 },
      { date: 'Sep 22', nav: 560.62 },
      { date: 'Oct 7', nav: 565.26 },
      { date: 'Oct 12', nav: 561.62 },
    ],
    tags: ['ASML Lithography', 'NVIDIA GPU', 'TSMC Foundry', 'Broadcom ASIC', 'Marvell MRVL', 'Intel INTC'],
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
    nav: 139.21,
    returns: {
      d1: calculateBasket24h(bitcoinFintechConstituents),
      w1: -2.95,
      m1: 7.41,
      y1: -42.8,
      allTime: -42.8,
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
      { date: 'Oct 12', nav: 243.37 },
      { date: 'Oct 27', nav: 246.66 },
      { date: 'Nov 11', nav: 207.37 },
      { date: 'Nov 26', nav: 160.17 },
      { date: 'Dec 11', nav: 173.52 },
      { date: 'Dec 26', nav: 154.09 },
      { date: 'Jan 10', nav: 154.25 },
      { date: 'Jan 25', nav: 147.21 },
      { date: 'Feb 9', nav: 120.82 },
      { date: 'Feb 24', nav: 113.62 },
      { date: 'Mar 11', nav: 139.53 },
      { date: 'Mar 26', nav: 132.17 },
      { date: 'Apr 10', nav: 120.22 },
      { date: 'Apr 25', nav: 147.01 },
      { date: 'May 10', nav: 156.7 },
      { date: 'May 25', nav: 144.64 },
      { date: 'Jun 9', nav: 119.68 },
      { date: 'Jun 24', nav: 112.61 },
      { date: 'Jul 9', nav: 107.09 },
      { date: 'Jul 24', nav: 107.01 },
      { date: 'Aug 8', nav: 107.05 },
      { date: 'Aug 23', nav: 127.06 },
      { date: 'Sep 7', nav: 142.68 },
      { date: 'Sep 22', nav: 151.55 },
      { date: 'Oct 7', nav: 143.06 },
      { date: 'Oct 12', nav: 139.21 },
    ],
    tags: ['MSTRx Treasury', 'Coinbase xStock', 'Circle CRCLx', 'Bitcoin Beta'],
    solanaMintPreview: 'StkBtcRailsX190Pk4R2m09',
    isFeatured: true,
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
    nav: 580.11,
    returns: {
      d1: calculateBasket24h(macroIndexConstituents),
      w1: 0.65,
      m1: 1.89,
      y1: 12.96,
      allTime: 12.96,
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
      { date: 'Oct 12', nav: 513.57 },
      { date: 'Oct 27', nav: 519.8 },
      { date: 'Nov 11', nav: 526.72 },
      { date: 'Nov 26', nav: 513.81 },
      { date: 'Dec 11', nav: 521.01 },
      { date: 'Dec 26', nav: 523.5 },
      { date: 'Jan 10', nav: 524.82 },
      { date: 'Jan 25', nav: 528.74 },
      { date: 'Feb 9', nav: 527.86 },
      { date: 'Feb 24', nav: 527.04 },
      { date: 'Mar 11', nav: 526.85 },
      { date: 'Mar 26', nav: 502.66 },
      { date: 'Apr 10', nav: 518.23 },
      { date: 'Apr 25', nav: 536.76 },
      { date: 'May 10', nav: 558.93 },
      { date: 'May 25', nav: 561 },
      { date: 'Jun 9', nav: 555.12 },
      { date: 'Jun 24', nav: 551.99 },
      { date: 'Jul 9', nav: 555.29 },
      { date: 'Jul 24', nav: 547.4 },
      { date: 'Aug 8', nav: 574.36 },
      { date: 'Aug 23', nav: 568.49 },
      { date: 'Sep 7', nav: 574.13 },
      { date: 'Sep 22', nav: 575.55 },
      { date: 'Oct 7', nav: 580.17 },
      { date: 'Oct 12', nav: 580.11 },
    ],
    tags: ['S&P 500 SPYX', 'Nasdaq QQQX', 'Gold GLDX', 'Capital Preservation'],
    solanaMintPreview: 'StkMacroAnchor0039xYyZ91',
    isFeatured: false,
  },
  {
    id: 'health-and-medicines',
    slug: 'health-and-medicines',
    title: 'Human Health & Life-Saving Medicines',
    tagline: 'The world’s essential pharmaceutical giants making daily medicines, vaccines, and treatments for human health.',
    description:
      'A simple, human-focused healthcare basket. Features the world’s most trusted pharmaceutical giants making everyday medicines, vaccines, and hospital care: Novo Nordisk (NVOX), Pfizer (PFEX), AstraZeneca (AZNX), Merck (MRKX), AbbVie (ABBVX), Moderna (MRNAX), and UnitedHealth (UNHX).',
    category: 'Healthcare & Essential Medicines',
    riskTier: 'Low',
    minInvestmentUsdc: 25,
    nav: 160.93,
    returns: {
      d1: calculateBasket24h(healthMedicinesConstituents),
      w1: 0.17,
      m1: 1.95,
      y1: -4.38,
      allTime: -4.38,
    },
    rebalanceFrequency: 'Quarterly',
    lastRebalanced: 'Oct 01, 2026',
    curator: {
      name: 'Global Health Alliance',
      handle: '@global_health',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
      reputationScore: 99.4,
      followers: 18200,
      feePercent: 0.10,
      verified: true,
    },
    constituents: healthMedicinesConstituents,
    historicalChart: [
      { date: 'Oct 12', nav: 168.31 },
      { date: 'Oct 27', nav: 129.23 },
      { date: 'Nov 11', nav: 127.7 },
      { date: 'Nov 26', nav: 136.62 },
      { date: 'Dec 11', nav: 135.8 },
      { date: 'Dec 26', nav: 135.39 },
      { date: 'Jan 10', nav: 136.85 },
      { date: 'Jan 25', nav: 134.88 },
      { date: 'Feb 9', nav: 128.26 },
      { date: 'Feb 24', nav: 131.86 },
      { date: 'Mar 11', nav: 130.58 },
      { date: 'Mar 26', nav: 126.6 },
      { date: 'Apr 10', nav: 133.71 },
      { date: 'Apr 25', nav: 133.09 },
      { date: 'May 10', nav: 151.84 },
      { date: 'May 25', nav: 151.36 },
      { date: 'Jun 9', nav: 157.02 },
      { date: 'Jun 24', nav: 161 },
      { date: 'Jul 9', nav: 151.59 },
      { date: 'Jul 24', nav: 163.09 },
      { date: 'Aug 8', nav: 160.14 },
      { date: 'Aug 23', nav: 161.39 },
      { date: 'Sep 7', nav: 157.87 },
      { date: 'Sep 22', nav: 158.68 },
      { date: 'Oct 7', nav: 159.43 },
      { date: 'Oct 12', nav: 160.93 },
    ],
    tags: ['Novo Nordisk NVO', 'Pfizer PFE', 'AstraZeneca AZN', 'Merck MRK', 'AbbVie ABBV', 'Moderna MRNA', 'UnitedHealth UNH'],
    solanaMintPreview: 'StkHealthMedicine0031Xz',
    isFeatured: true,
  },
  {
    id: 'global-financial-hegemons-cards',
    slug: 'global-financial-hegemons-cards',
    title: 'Global Financial Hegemons & Card Rails',
    tagline: 'The world’s dominant banking oligarchs, global card duopoly networks, and digital checkout rails.',
    description:
      'Anchored by America’s premier banking dynasties and global payments networks. Featuring JPMorgan Chase (JPMX), Visa (VX), Mastercard (MAX), Goldman Sachs (GSX), Bank of America (BACX), and PayPal (PYPLX) capturing transaction fees on trillions of dollars in global commerce.',
    category: 'Global Banking & Card Rails',
    riskTier: 'Low',
    minInvestmentUsdc: 25,
    nav: 422.6,
    returns: {
      d1: calculateBasket24h(globalBankingConstituents),
      w1: 1.3,
      m1: 0.38,
      y1: 8.25,
      allTime: 8.25,
    },
    rebalanceFrequency: 'Quarterly',
    lastRebalanced: 'Oct 01, 2026',
    curator: {
      name: 'Manhattan Institutional Macro',
      handle: '@manhattan_macro',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      reputationScore: 99.6,
      followers: 22100,
      feePercent: 0.10,
      verified: true,
    },
    constituents: globalBankingConstituents,
    historicalChart: [
      { date: 'Oct 12', nav: 390.4 },
      { date: 'Oct 28', nav: 404.2 },
      { date: 'Nov 11', nav: 407.5 },
      { date: 'Nov 26', nav: 410.66 },
      { date: 'Dec 11', nav: 409.04 },
      { date: 'Dec 25', nav: 420.59 },
      { date: 'Jan 9', nav: 405.87 },
      { date: 'Jan 23', nav: 383.2 },
      { date: 'Feb 6', nav: 373.1 },
      { date: 'Feb 20', nav: 371.04 },
      { date: 'Mar 6', nav: 390.94 },
      { date: 'Mar 20', nav: 388.29 },
      { date: 'Apr 3', nav: 385.54 },
      { date: 'Apr 17', nav: 401.62 },
      { date: 'May 1', nav: 420.26 },
      { date: 'May 15', nav: 408.14 },
      { date: 'May 29', nav: 430.43 },
      { date: 'Jun 12', nav: 429.64 },
      { date: 'Jun 26', nav: 437.94 },
      { date: 'Jul 10', nav: 439.83 },
      { date: 'Jul 25', nav: 430.97 },
      { date: 'Aug 9', nav: 423.92 },
      { date: 'Aug 24', nav: 419.02 },
      { date: 'Sep 7', nav: 424.8 },
      { date: 'Sep 21', nav: 424.53 },
      { date: 'Oct 5', nav: 417.47 },
      { date: 'Oct 10', nav: 422.6 },
    ],
    tags: ['JPMorgan JPM', 'Visa V', 'Mastercard MA', 'Goldman Sachs GS', 'Bank of America BAC', 'PayPal PYPL'],
    solanaMintPreview: 'StkFinanceHegemon0071Zy',
    isFeatured: true,
  },
];
