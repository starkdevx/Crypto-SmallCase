'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { TickerMarquee } from '../components/TickerMarquee';
import { HeroSection } from '../components/HeroSection';
import { BasketCard } from '../components/BasketCard';
import { BasketDetailModal } from '../components/BasketDetailModal';
import { BasketComparisonModal } from '../components/BasketComparisonModal';
import { BasketBuilderSandbox } from '../components/BasketBuilderSandbox';
import { StockUniverseTable } from '../components/StockUniverseTable';
import { WalletRoadmapModal } from '../components/WalletRoadmapModal';
import { STOCK_BASKETS } from '../data/baskets';
import { Basket, BasketCategory, Timeframe } from '../types/basket';
import { Search, Filter, Sparkles, Layers, SlidersHorizontal, Check } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'baskets' | 'stocks' | 'builder'>('baskets');
  const [selectedCategory, setSelectedCategory] = useState<BasketCategory>('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1Y');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'return' | 'nav' | 'risk'>('return');

  // Modals state
  const [activeDetailBasket, setActiveDetailBasket] = useState<Basket | null>(null);
  const [comparedBasketIds, setComparedBasketIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Toggle basket comparison
  const handleToggleCompare = (basket: Basket) => {
    setComparedBasketIds((prev) => {
      if (prev.includes(basket.id)) {
        return prev.filter((id) => id !== basket.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 baskets at a time.');
        return prev;
      }
      return [...prev, basket.id];
    });
  };

  const comparedBaskets = STOCK_BASKETS.filter((b) => comparedBasketIds.includes(b.id));

  // Filter & sort baskets
  const filteredBaskets = STOCK_BASKETS.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.constituents.some(
        (c) =>
          c.stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    const getReturn = (basket: Basket) => {
      switch (selectedTimeframe) {
        case '1D': return basket.returns.d1;
        case '1W': return basket.returns.w1;
        case '1M': return basket.returns.m1;
        case '1Y': return basket.returns.y1;
        case 'ALL': return basket.returns.allTime;
      }
    };

    if (sortBy === 'return') return getReturn(b) - getReturn(a);
    if (sortBy === 'nav') return b.nav - a.nav;
    // Risk sort
    const riskScore = { Low: 1, Moderate: 2, High: 3, Aggressive: 4 };
    return riskScore[a.riskTier] - riskScore[b.riskTier];
  });

  const categories: BasketCategory[] = [
    'All',
    'Value & Cashflow Fortress',
    'Healthcare & Essential Medicines',
    'Global Banking & Card Rails',
    'Energy & Real Commodities',
    'MegaCap Titans',
    'AI & Silicon Compute',
    'Fintech & Bitcoin Rails',
    'Market Index ETFs',
  ];

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Real-time Oracle Ticker Marquee */}
      <TickerMarquee />

      {/* Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={comparedBasketIds.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenWalletInfo={() => setIsWalletModalOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection onLearnMore={() => setIsWalletModalOpen(true)} />

      {/* Tab Switch Body */}
      {activeTab === 'baskets' && (
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 64px', width: '100%' }}>
          {/* Controls Bar: Categories, Timeframe, Search, Sort */}
          <div style={{
            background: 'rgba(16, 22, 35, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '32px',
          }}>
            {/* Top row: Category pills */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '14px',
              marginBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: selectedCategory === cat
                      ? 'linear-gradient(135deg, rgba(153, 69, 255, 0.35) 0%, rgba(20, 241, 149, 0.25) 100%)'
                      : 'rgba(255, 255, 255, 0.04)',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                    border: selectedCategory === cat
                      ? '1px solid rgba(153, 69, 255, 0.4)'
                      : '1px solid transparent',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Bottom row: Timeframe, Search, Sort */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              {/* Timeframe selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  % Rise Timeframe:
                </span>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '4px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}>
                  {(['1D', '1W', '1M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setSelectedTimeframe(tf)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: selectedTimeframe === tf ? 'var(--solana-purple)' : 'transparent',
                        color: selectedTimeframe === tf ? '#ffffff' : 'var(--text-secondary)',
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Sort Group */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                {/* Search */}
                <div style={{ position: 'relative', minWidth: '240px' }}>
                  <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search baskets or stock (e.g. NVDA, SpaceX)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '8px 14px 8px 36px',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>

                {/* Sort dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SlidersHorizontal size={15} color="var(--text-muted)" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    <option value="return">Highest % Rise ({selectedTimeframe})</option>
                    <option value="nav">Highest Basket NAV</option>
                    <option value="risk">Lowest Volatility / Risk</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Basket Cards Grid */}
          {filteredBaskets.length === 0 ? (
            <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center' }}>
              <Layers size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                No baskets matched your search
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Try searching for another ticker like NVDA, SpaceX, or select "All" categories.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '24px',
            }}>
              {filteredBaskets.map((basket) => (
                <BasketCard
                  key={basket.id}
                  basket={basket}
                  selectedTimeframe={selectedTimeframe}
                  onSelect={(b) => setActiveDetailBasket(b)}
                  isCompared={comparedBasketIds.includes(basket.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab: Stock Universe */}
      {activeTab === 'stocks' && (
        <StockUniverseTable
          onSelectBasket={(b) => {
            setActiveDetailBasket(b);
          }}
        />
      )}

      {/* Tab: Custom Basket Builder */}
      {activeTab === 'builder' && <BasketBuilderSandbox />}

      {/* Modals */}
      <BasketDetailModal
        basket={activeDetailBasket}
        onClose={() => setActiveDetailBasket(null)}
        onOpenWalletPreview={() => setIsWalletModalOpen(true)}
      />

      <BasketComparisonModal
        comparedBaskets={comparedBaskets}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveBasket={(id) => setComparedBasketIds((prev) => prev.filter((i) => i !== id))}
        onSelectBasket={(b) => {
          setIsCompareModalOpen(false);
          setActiveDetailBasket(b);
        }}
      />

      <WalletRoadmapModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(6, 9, 14, 0.95)',
        padding: '36px 24px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
        }}>
          <div>
            <strong style={{ color: '#ffffff' }}>Stocklana (Stonkcase)</strong> • Tokenized Thematic Stock Baskets on Solana
            <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', marginTop: '4px' }}>
              Built for the Stocklana Hackathon. Powered by CoinGecko xStocks Ecosystem, Pyth Network & PreStocks.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: 'var(--solana-green)', fontWeight: 600 }}>● 100 Tokenized xStocks Live</span>
            <span>Solana Devnet Ready</span>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 600,
              }}
            >
              v1 Roadmap
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
