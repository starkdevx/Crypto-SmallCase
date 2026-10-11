'use client';

import React from 'react';
import { ALL_XSTOCKS } from '../data/stocks';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function TickerMarquee() {
  // Take top 25 high-volume tokenized stocks for smooth scrolling
  const topXStocks = ALL_XSTOCKS.slice(0, 25);

  return (
    <div style={{
      width: '100%',
      background: 'rgba(8, 12, 22, 0.98)',
      borderBottom: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.78rem',
      height: '38px',
    }}>
      {/* Protocol Oracle Status Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 16px',
        background: 'rgba(14, 21, 37, 0.98)',
        borderRight: '1px solid var(--border-subtle)',
        whiteSpace: 'nowrap',
        zIndex: 2,
        height: '100%',
      }}>
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: 'var(--solana-green)',
          display: 'inline-block',
          boxShadow: '0 0 8px var(--solana-green)',
        }} />
        <span style={{ fontWeight: 700, fontSize: '0.72rem', color: '#e2e8f0', letterSpacing: '0.04em' }}>
          COINGECKO xSTOCKS ORACLE (100 ASSETS)
        </span>
      </div>

      {/* Marquee Track */}
      <div style={{
        display: 'flex',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maskImage: 'linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)',
        flex: 1,
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          animation: 'tickerMarquee 48s linear infinite',
          paddingLeft: '12px',
        }}>
          {[...topXStocks, ...topXStocks].map((stock, idx) => {
            const isPositive = stock.change24h >= 0;
            return (
              <div
                key={`${stock.ticker}-${idx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                }}
              >
                {stock.image && (
                  <img
                    src={stock.image}
                    alt={stock.ticker}
                    style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'contain' }}
                  />
                )}
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                  {stock.ticker}
                </span>
                <span className="num-mono" style={{ color: '#f8fafc', fontWeight: 600 }}>
                  ${stock.price.toFixed(2)}
                </span>
                <span
                  className="num-mono"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    color: isPositive ? 'var(--gain)' : 'var(--loss)',
                    fontWeight: 700,
                  }}
                >
                  {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {isPositive ? '+' : ''}{stock.change24h}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
