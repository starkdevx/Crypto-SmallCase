'use client';

import React from 'react';
import { ALL_STOCKS } from '../data/stocks';
import { ArrowUpRight, ArrowDownRight, Radio } from 'lucide-react';

export function TickerMarquee() {
  const stockList = Object.values(ALL_STOCKS);

  return (
    <div style={{
      width: '100%',
      background: 'rgba(10, 15, 26, 0.95)',
      borderBottom: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.8rem',
      height: '38px',
    }}>
      {/* Oracle Status Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 16px',
        background: 'rgba(18, 26, 43, 0.95)',
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
        <span style={{ fontWeight: 700, fontSize: '0.74rem', color: '#cbd5e1' }}>
          PYTH & PRESTOCKS ORACLES
        </span>
      </div>

      {/* Marquee Track */}
      <div style={{
        display: 'flex',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
        flex: 1,
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          animation: 'tickerMarquee 42s linear infinite',
          paddingLeft: '12px',
        }}>
          {/* Double array for seamless loop */}
          {[...stockList, ...stockList].map((stock, idx) => {
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
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stock.ticker.replace('PRE:', '⚡')}
                </span>
                <span className="num-mono" style={{ color: '#e2e8f0' }}>
                  ${stock.price.toFixed(2)}
                </span>
                <span
                  className="num-mono"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    color: isPositive ? 'var(--gain)' : 'var(--loss)',
                    fontWeight: 600,
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
