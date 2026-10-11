# Implementation Plan — Stonkcase (Solana Tokenized Stock Baskets & Social Savings dApp)

Build a **Smallcase-inspired thematic stock basket & social investing platform** on Solana for the **Stocklana Hackathon**. Stonkcase allows users to invest in thematic portfolios (e.g., "AI Unicorns", "Mag7 Tech", "Pre-IPO Giants"), create & share their own stock baskets with social copy-trading, earn creator fees, and set up automated DCA savings into tokenized equities.

## Product Vision & Core Architecture

```
                               ┌────────────────────────────────────────────────┐
                               │                 Stonkcase App                  │
                               │  (Vite + React + Tailwind + Lucide + Recharts) │
                               └──────────────────────┬─────────────────────────┘
                                                      │
         ┌─────────────────────────┬──────────────────┴──────────────────────┬─────────────────────────┐
         │                         │                                         │                         │
┌────────┴─────────┐     ┌─────────┴──────────┐                    ┌─────────┴──────────┐    ┌─────────┴──────────┐
│   PreStocks API  │     │    Tessera API     │                    │  Pyth Price Feeds  │    │ Meteora Swap SDK  │
│ (Pre-IPO Stocks) │     │ (Private Equities) │                    │ (US Equities & FX) │    │ (DBC & Liquidity) │
└──────────────────┘     └────────────────────┘                    └────────────────────┘    └───────────────────┘
```

---

## User Review Required

> [!IMPORTANT]
> **Tech Stack Selection**: We will build a high-performance modern web application using **Vite + React (TypeScript) + Tailwind CSS + Lucide Icons + Recharts + @solana/web3.js** for immediate dev iteration and lightning-fast demo capabilities within the 3-day hackathon window.
>
> **Sponsor Bounty Alignment**:
> 1. **PreStocks ($10,000)**: Live integration with `https://prestocks.com/api/prestocks` for tokenized pre-IPO stocks.
> 2. **Tessera ($6,000)**: Integration with `https://rest-api.tessera.pe/v1/public/token-details` (OpenAI, Kalshi, SpaceX tokens).
> 3. **Pyth Network**: Live market feeds for real-time basket NAV tracking & performance history.
> 4. **Meteora ($5,000)**: Multi-token basket swap routing simulation and dynamic pool execution.

---

## Key Features

### 1. Thematic Baskets ("Stonkcases")
- **Explore Baskets**: Pre-built thematic portfolios (e.g., *AI Unicorns*, *Mag7 Tech*, *Pre-IPO Pioneers*, *Defense & Aerospace*, *Yield & Dividend Equities*).
- **Basket Deep Dive**: Detailed allocation breakdown, constituent stocks, historical chart (Pyth data), risk score, minimum investment, and rebalance history.
- **1-Click Multi-Token Invest**: Invest USDC into a basket; automatically splits order into constituent tokenized stocks via Meteora pools.

### 2. Social & Copy-Investing Platform
- **Custom Basket Builder**: Users pick stocks (US Equities, PreStocks pre-IPOs, Tessera private equities), set weight percentages (%), and publish.
- **Creator Economy**: Basket creators earn a **0.25% creator fee** whenever users invest in or rebalance into their curated basket.
- **Social Leaderboard**: Top creators ranked by ROI (1W, 1M, All), total subscribers, and total AUM (Assets Under Management).
- **1-Click Copy Basket**: Follow top traders and mirror their allocations in real-time.
- **Shareable Cards**: Generate Twitter/X share cards with basket performance and badge graphics.

### 3. Smart Savings & DCA (Auto-Invest)
- **Recurring DCA**: Set automated weekly/monthly deposits into any basket.
- **Round-Up Micro Savings Simulator**: Calculate accumulated wealth if wallet transactions are rounded up into pre-IPO stock baskets.

### 4. Interactive Live Demo & Mock Wallet Mode
- **Wallet Connection**: Phantom / Solflare integration using `@solana/wallet-adapter` + built-in **Demo Mode / Simulated Solana Wallet** for smooth instant testing by hackathon judges.

---

## Proposed Changes

We will create a full-featured, visually stunning web application in the project root `/home/akshay/wslProjects/stocklana`.

### Project Structure

#### [NEW] [package.json](file:///home/akshay/wslProjects/stocklana/package.json)
- React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, Framer Motion, `@solana/web3.js`, `@solana/wallet-adapter-react`.

#### [NEW] [src/types/index.ts](file:///home/akshay/wslProjects/stocklana/src/types/index.ts)
- Type definitions for Basket, Asset, Constituent, Creator, PortfolioPosition, PreStockItem, TesseraToken, PythPriceFeed, and DCA Config.

#### [NEW] [src/services/api.ts](file:///home/akshay/wslProjects/stocklana/src/services/api.ts)
- PreStocks API client (`https://prestocks.com/api/prestocks`).
- Tessera API client (`https://rest-api.tessera.pe/v1/public/token-details`).
- Pyth price feed aggregator service.
- Meteora swap route simulator.

#### [NEW] [src/context/WalletContext.tsx](file:///home/akshay/wslProjects/stocklana/src/context/WalletContext.tsx)
- Solana Wallet adapter & Demo Wallet simulation context (toggle between real devnet/mainnet and instant demo wallet with pre-funded USDC).

#### [NEW] [src/context/BasketContext.tsx](file:///home/akshay/wslProjects/stocklana/src/context/BasketContext.tsx)
- State management for user portfolio holdings, created baskets, followed creators, active DCA routines, and pending rebalances.

#### [NEW] [src/components/Navbar.tsx](file:///home/akshay/wslProjects/stocklana/src/components/Navbar.tsx)
- Modern dark-mode nav with Live Pyth ticker, wallet connect button, demo wallet toggle, and navigation tabs.

#### [NEW] [src/components/ExploreBaskets.tsx](file:///home/akshay/wslProjects/stocklana/src/components/ExploreBaskets.tsx)
- Filterable showcase of stock baskets (Featured, Pre-IPO, High Growth, Low Risk, Top Community Baskets).

#### [NEW] [src/components/BasketDetailModal.tsx](file:///home/akshay/wslProjects/stocklana/src/components/BasketDetailModal.tsx)
- Full modal view showing pie chart of allocations, historical performance charts via Recharts, sponsor badge tags (PreStocks, Tessera, Pyth), 1-click Invest flow, and Creator profile.

#### [NEW] [src/components/CreateBasketModal.tsx](file:///home/akshay/wslProjects/stocklana/src/components/CreateBasketModal.tsx)
- Interactive drag-and-drop / weight slider basket builder allowing users to combine US stocks + PreStocks + Tessera tokens, set fee %, and publish to the social leaderboard.

#### [NEW] [src/components/SocialLeaderboard.tsx](file:///home/akshay/wslProjects/stocklana/src/components/SocialLeaderboard.tsx)
- Leaderboard of top community basket creators, showing subscriber counts, total AUM, earned creator fees, and copy-trade buttons.

#### [NEW] [src/components/PortfolioDashboard.tsx](file:///home/akshay/wslProjects/stocklana/src/components/PortfolioDashboard.tsx)
- Personal holding view: active baskets, profit/loss tracking, DCA recurring schedules, 1-click rebalance alerts, and round-up savings calculator.

#### [NEW] [src/components/PreStocksShowcase.tsx](file:///home/akshay/wslProjects/stocklana/src/components/PreStocksShowcase.tsx)
- Dedicated section highlighting live PreStocks pre-IPO data (OpenAI, SpaceX, Stripe) and Pyth price feeds for sponsor visibility.

---

## Verification Plan

### Automated & Build Verification
1. **Application Build**: Run `npm run build` to ensure 0 TypeScript compilation errors and bundle optimization.
2. **Dev Server Verification**: Run `npm run dev` and ensure the frontend serves cleanly on `http://localhost:5173`.

### Manual & UX Verification
1. **Explore & Filter Baskets**: Test filtering by theme (Pre-IPO, Tech, Yield, Community).
2. **1-Click Investment Flow**: Invest USDC into a basket and verify wallet state updates, portfolio allocation pie charts, and holding updates.
3. **Basket Builder & Creator Flow**: Build a custom basket mixing PreStocks + US Equities, set 100% weight total, publish it, and verify it appears on the Social Leaderboard.
4. **Pyth Data & API Verification**: Ensure live pricing for Pyth feeds and PreStocks/Tessera APIs fetch properly with fallback mock data for offline resilience.
5. **DCA & Rebalance Simulation**: Test setting up an auto-DCA routine and triggering a 1-click portfolio rebalance.
