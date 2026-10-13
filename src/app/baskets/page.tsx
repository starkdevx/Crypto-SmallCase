'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { TickerMarquee } from '../../components/TickerMarquee';
import { BasketCard } from '../../components/BasketCard';
import { BasketComparisonModal } from '../../components/BasketComparisonModal';
import { STOCK_BASKETS } from '../../data/baskets';
import { Basket, Timeframe } from '../../types/basket';
import { Search, SlidersHorizontal, Layers } from 'lucide-react';

export default function BasketsPage() {
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1Y');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'return' | 'nav' | 'risk'>('return');

  // Modals state
  const [comparedBasketIds, setComparedBasketIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleSelectBasket = (basket: Basket) => {
    router.push(`/basket/${basket.slug || basket.id}`);
  };

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
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(query) ||
      b.tagline.toLowerCase().includes(query) ||
      b.tags.some((t) => t.toLowerCase().includes(query)) ||
      b.constituents.some(
        (c) =>
          c.stock.ticker.toLowerCase().includes(query) ||
          c.stock.name.toLowerCase().includes(query)
      )
    );
  }).sort((a, b) => {
    const getReturn = (basket: Basket) => {
      switch (selectedTimeframe) {
        case '1D': return basket.returns.d1;
        case '1W': return basket.returns.w1;
        case '1M': return basket.returns.m1;
        case '1Y': return basket.returns.y1;
      }
    };

    if (sortBy === 'return') return getReturn(b) - getReturn(a);
    if (sortBy === 'nav') return b.nav - a.nav;
    // Risk sort
    const riskScore = { Low: 1, Moderate: 2, High: 3, Aggressive: 4 };
    return riskScore[a.riskTier] - riskScore[b.riskTier];
  });

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <Header
        compareCount={comparedBasketIds.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
      />

      {/* Ticker Marquee */}
      <TickerMarquee />

      {/* Main Baskets Section */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 24px 20px', width: '100%' }}>
        {/* Controls Bar: Timeframe, Search, Sort */}
        <div style={{
          background: 'rgba(16, 22, 35, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '32px',
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
              {(['1D', '1W', '1M', '1Y'] as Timeframe[]).map((tf) => (
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
                    cursor: 'pointer',
                    border: 'none',
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

        {/* Basket Cards Grid */}
        {filteredBaskets.length === 0 ? (
          <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Layers size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              No baskets matched your search
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Try searching for another ticker like NVDA, SpaceX, or clear the search query.
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
                onSelect={handleSelectBasket}
                isCompared={comparedBasketIds.includes(basket.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}
      </section>

      {/* Comparison Modal */}
      <BasketComparisonModal
        comparedBaskets={comparedBaskets}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveBasket={(id) => setComparedBasketIds((prev) => prev.filter((i) => i !== id))}
        onSelectBasket={(b) => {
          setIsCompareModalOpen(false);
          handleSelectBasket(b);
        }}
      />

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(6, 9, 14, 0.95)',
        padding: '16px 24px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
        }}>
          <div>
            <strong style={{ color: '#ffffff' }}>xCase</strong> • SmallCase for Crypto on Solana
          </div>
        </div>
      </footer>
    </main>
  );
}
