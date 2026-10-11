'use client';

import React, { useState } from 'react';
import { ALL_XSTOCKS } from '../data/stocks';
import { STOCK_BASKETS } from '../data/baskets';
import { Stock, Basket } from '../types/basket';
import { Search, ArrowUpRight, ArrowDownRight, Layers, SlidersHorizontal, Sparkles } from 'lucide-react';

interface StockUniverseTableProps {
  onSelectBasket: (basket: Basket) => void;
}

export function StockUniverseTable({ onSelectBasket }: StockUniverseTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rank' | 'volume' | 'change' | 'price' | 'market_cap'>('rank');

  const sectors = [
    'All',
    'Semiconductors & AI Silicon',
    'MegaCap Titans',
    'Fintech & Bitcoin Treasuries',
    'Market Index ETFs',
    'Aerospace & Hard Tech',
    'Sovereign Commodities',
    'Enterprise Cloud & Software',
  ];

  // Helper to format volume
  const formatVolume = (vol: number | undefined) => {
    if (!vol) return '$0';
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `$${(vol / 1e3).toFixed(1)}K`;
    return `$${vol.toLocaleString()}`;
  };

  // Filter & sort
  const filteredStocks = ALL_XSTOCKS
    .filter((stock) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        stock.ticker.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query) ||
        stock.sector.toLowerCase().includes(query);

      const matchesSector =
        selectedSector === 'All' || stock.sector.toLowerCase().includes(selectedSector.toLowerCase());

      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      if (sortBy === 'rank') {
        const rankA = a.marketCapRank ?? 9999;
        const rankB = b.marketCapRank ?? 9999;
        return rankA - rankB;
      }
      if (sortBy === 'volume') return (b.volume24h ?? 0) - (a.volume24h ?? 0);
      if (sortBy === 'change') return b.change24h - a.change24h;
      if (sortBy === 'price') return b.price - a.price;
      return 0;
    });

  // Find which baskets contain a given stock ticker
  const getBasketsForStock = (ticker: string) => {
    return STOCK_BASKETS.filter((b) =>
      b.constituents.some((c) => c.stock.ticker === ticker)
    );
  };

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          borderRadius: '999px',
          background: 'rgba(0, 229, 255, 0.1)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          color: 'var(--solana-cyan)',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '10px',
        }}>
          <Sparkles size={14} />
          <span>CoinGecko xStocks Ecosystem (100 Live Tokenized Stocks)</span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Tokenized Stock Universe & Oracle Feeds
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '780px' }}>
          Explore the full ecosystem of 100 tokenized equities traded onchain. View live prices, 24h volumes, market capitalizations, and underlying basket memberships.
        </p>
      </div>

      {/* Sector filter pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '20px',
      }}>
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec)}
            style={{
              padding: '7px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              background: selectedSector === sec ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedSector === sec ? 'var(--solana-cyan)' : 'var(--text-secondary)',
              border: selectedSector === sec ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid var(--border-subtle)',
            }}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
        background: 'rgba(18, 25, 40, 0.6)',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search 100 tokenized stocks by ticker or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '10px 14px 10px 36px',
              color: '#ffffff',
              fontSize: '0.86rem',
            }}
          />
        </div>

        {/* Sort By */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={15} color="var(--text-muted)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <option value="rank">Market Cap Rank</option>
            <option value="volume">24h Trading Volume</option>
            <option value="change">Highest 24h % Rise</option>
            <option value="price">Share Price</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Rank & Asset</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Sector</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>24h Change</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>24h High / Low</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>24h Volume</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Market Cap</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Baskets</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => {
              const isPositive24h = stock.change24h >= 0;
              const containingBaskets = getBasketsForStock(stock.ticker);

              return (
                <tr
                  key={stock.ticker}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {/* Rank, Image, Ticker & Name */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        minWidth: '28px',
                      }}>
                        #{stock.marketCapRank ?? '-'}
                      </span>
                      {stock.image && (
                        <img
                          src={stock.image}
                          alt={stock.ticker}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'contain' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em' }}>
                          {stock.ticker}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sector */}
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                    {stock.sector}
                  </td>

                  {/* Price */}
                  <td className="num-mono" style={{ padding: '14px 16px', fontWeight: 800, color: '#ffffff', fontSize: '0.94rem' }}>
                    ${stock.price.toFixed(2)}
                  </td>

                  {/* 24h Change */}
                  <td className="num-mono" style={{ padding: '14px 16px' }}>
                    <span className={isPositive24h ? 'badge-gain' : 'badge-loss'}>
                      {isPositive24h ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {isPositive24h ? '+' : ''}{stock.change24h}%
                    </span>
                  </td>

                  {/* 24h High/Low */}
                  <td className="num-mono" style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#94a3b8' }}>
                    ${stock.high24h?.toFixed(2) ?? '-'} / ${stock.low24h?.toFixed(2) ?? '-'}
                  </td>

                  {/* 24h Volume */}
                  <td className="num-mono" style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                    {formatVolume(stock.volume24h)}
                  </td>

                  {/* Market Cap */}
                  <td className="num-mono" style={{ padding: '14px 16px', color: '#ffffff', fontWeight: 600 }}>
                    {stock.marketCap}
                  </td>

                  {/* Included In Baskets */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {containingBaskets.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => onSelectBasket(b)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: '#cbd5e1',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                          title={`Click to view ${b.title}`}
                        >
                          <Layers size={10} color="var(--solana-green)" />
                          <span>{b.title.split(' ')[0]}</span>
                        </button>
                      ))}
                      {containingBaskets.length === 0 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Standalone</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
