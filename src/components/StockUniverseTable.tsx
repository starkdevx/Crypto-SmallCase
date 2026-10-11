'use client';

import React, { useState } from 'react';
import { ALL_STOCKS } from '../data/stocks';
import { STOCK_BASKETS } from '../data/baskets';
import { Stock, Basket } from '../types/basket';
import { Search, ArrowUpRight, ArrowDownRight, Filter, ShieldCheck, Layers } from 'lucide-react';

interface StockUniverseTableProps {
  onSelectBasket: (basket: Basket) => void;
}

export function StockUniverseTable({ onSelectBasket }: StockUniverseTableProps) {
  const stockList = Object.values(ALL_STOCKS);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'1y' | '24h' | 'price'>('1y');

  // Filter & sort
  const filteredStocks = stockList
    .filter((stock) => {
      const matchesSearch =
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProvider =
        selectedProvider === 'All' || stock.provider.includes(selectedProvider);

      return matchesSearch && matchesProvider;
    })
    .sort((a, b) => {
      if (sortBy === '1y') return b.change1y - a.change1y;
      if (sortBy === '24h') return b.change24h - a.change24h;
      return b.price - a.price;
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
          <ShieldCheck size={14} />
          <span>Underlying Equities & Pre-IPO Universe</span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Constituent Stocks & Oracle Feeds
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '720px' }}>
          Browse all 23 tokenized equities that comprise the Stocklana thematic baskets. Verify live pricing, 1-year historical rise, and data provider sources.
        </p>
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
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search stocks by ticker or name..."
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

        {/* Provider Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Provider:</span>
          {['All', 'Pyth', 'PreStocks', 'Tessera', 'xStocks'].map((prov) => (
            <button
              key={prov}
              onClick={() => setSelectedProvider(prov)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: selectedProvider === prov ? 'rgba(153, 69, 255, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedProvider === prov ? '#ffffff' : 'var(--text-secondary)',
                border: selectedProvider === prov ? '1px solid var(--solana-purple)' : '1px solid var(--border-subtle)',
              }}
            >
              {prov}
            </button>
          ))}
        </div>

        {/* Sort By */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <option value="1y">Highest 1Y Rise (%)</option>
            <option value="24h">Highest 24h Change (%)</option>
            <option value="price">Share Price</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Ticker & Company</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Sector</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Share Price</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>24h Change</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>1Y Rise (%)</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Market Cap / Val</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Data Feed Provider</th>
              <th style={{ padding: '14px 16px', fontWeight: 600 }}>Included in Baskets</th>
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
                  {/* Ticker & Name */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: stock.ticker.startsWith('PRE:') ? 'rgba(153, 69, 255, 0.2)' : 'rgba(255, 255, 255, 0.07)',
                        color: stock.ticker.startsWith('PRE:') ? '#c084fc' : '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        fontFamily: 'monospace',
                      }}>
                        {stock.ticker.replace('PRE:', '⚡')}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#ffffff' }}>{stock.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {stock.description.slice(0, 52)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sector */}
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                    {stock.sector}
                  </td>

                  {/* Price */}
                  <td className="num-mono" style={{ padding: '14px 16px', fontWeight: 800, color: '#ffffff' }}>
                    ${stock.price.toFixed(2)}
                  </td>

                  {/* 24h Change */}
                  <td className="num-mono" style={{ padding: '14px 16px' }}>
                    <span className={isPositive24h ? 'badge-gain' : 'badge-loss'}>
                      {isPositive24h ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {isPositive24h ? '+' : ''}{stock.change24h}%
                    </span>
                  </td>

                  {/* 1Y Rise */}
                  <td className="num-mono" style={{ padding: '14px 16px' }}>
                    <span style={{ color: 'var(--gain)', fontWeight: 800 }}>
                      +{stock.change1y}%
                    </span>
                  </td>

                  {/* Market Cap */}
                  <td className="num-mono" style={{ padding: '14px 16px', color: '#94a3b8' }}>
                    {stock.marketCap}
                  </td>

                  {/* Data Feed Provider */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: stock.provider.includes('PreStocks')
                        ? 'rgba(153, 69, 255, 0.15)'
                        : stock.provider.includes('Tessera')
                        ? 'rgba(0, 229, 255, 0.15)'
                        : 'rgba(20, 241, 149, 0.12)',
                      color: stock.provider.includes('PreStocks')
                        ? '#c084fc'
                        : stock.provider.includes('Tessera')
                        ? 'var(--solana-cyan)'
                        : 'var(--solana-green)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}>
                      {stock.provider}
                    </span>
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
                            padding: '3px 7px',
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
