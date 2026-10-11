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
    title: 'Frontier AI & Semiconductor Monopolies',
    tagline: 'The unassailable global monopolies powering artificial intelligence — from ASML EUV lithography to Nvidia GPUs and TSMC foundries.',
    description:
      'The definitive full-stack AI hardware fortress. Combines the world’s most critical semiconductor monopolies and designers: ASML (100% EUV lithography monopoly), TSMC (leading-edge foundries), NVIDIA (GPU compute & CUDA moat), Broadcom (custom AI ASICs), AMD (accelerators), Marvell (custom silicon & electro-optics), and Intel (silicon fabrication).',
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
      { date: 'Jul 24', nav: 360, sol: 195, sp500: 121 },
      { date: 'Sep 24', nav: 395, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 430, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 468, sp500: 132, sol: 245 },
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
    id: 'health-and-medicines',
    slug: 'health-and-medicines',
    title: 'Human Health & Life-Saving Medicines',
    tagline: 'The world’s essential pharmaceutical giants making daily medicines, vaccines, and treatments for human health.',
    description:
      'A simple, human-focused healthcare basket. Features the world’s most trusted pharmaceutical giants making everyday medicines, vaccines, and hospital care: Novo Nordisk (NVOX), Pfizer (PFEX), AstraZeneca (AZNX), Merck (MRKX), AbbVie (ABBVX), Moderna (MRNAX), and UnitedHealth (UNHX).',
    category: 'Healthcare & Essential Medicines',
    riskTier: 'Low',
    minInvestmentUsdc: 25,
    nav: calculateBasketNav(healthMedicinesConstituents),
    returns: {
      d1: calculateBasket24h(healthMedicinesConstituents),
      w1: 2.1,
      m1: 6.4,
      y1: 36.5,
      allTime: 88.0,
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
      { date: 'Nov 23', nav: 260, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 285, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 310, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 330, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 350, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 365, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 380, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 395, sp500: 132, sol: 245 },
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
    nav: calculateBasketNav(globalBankingConstituents),
    returns: {
      d1: calculateBasket24h(globalBankingConstituents),
      w1: 1.8,
      m1: 5.5,
      y1: 33.2,
      allTime: 79.5,
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
      { date: 'Nov 23', nav: 250, sp500: 100, sol: 100 },
      { date: 'Jan 24', nav: 275, sp500: 105, sol: 138 },
      { date: 'Mar 24', nav: 300, sp500: 111, sol: 210 },
      { date: 'May 24', nav: 320, sp500: 116, sol: 185 },
      { date: 'Jul 24', nav: 340, sp500: 121, sol: 195 },
      { date: 'Sep 24', nav: 355, sp500: 124, sol: 175 },
      { date: 'Nov 24', nav: 375, sp500: 128, sol: 220 },
      { date: 'Jan 25', nav: 390, sp500: 132, sol: 245 },
    ],
    tags: ['JPMorgan JPM', 'Visa V', 'Mastercard MA', 'Goldman Sachs GS', 'Bank of America BAC', 'PayPal PYPL'],
    solanaMintPreview: 'StkFinanceHegemon0071Zy',
    isFeatured: true,
  },
];
