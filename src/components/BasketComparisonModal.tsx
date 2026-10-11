'use client';

import React from 'react';
import { Basket } from '../types/basket';
import { X, ArrowUpRight, ArrowDownRight, Layers, Trash2 } from 'lucide-react';

interface BasketComparisonModalProps {
  comparedBaskets: Basket[];
  onClose: () => void;
  onRemoveBasket: (id: string) => void;
  onSelectBasket: (basket: Basket) => void;
}

export function BasketComparisonModal({
  comparedBaskets,
  onClose,
  onRemoveBasket,
  onSelectBasket,
}: BasketComparisonModalProps) {
  if (comparedBaskets.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#0c111e',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '32px',
          borderRadius: '24px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Layers size={20} color="var(--solana-green)" />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              Side-by-Side Basket Comparison
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Compare metrics, performance trajectory, constituents, and risk profiles across selected stock baskets.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '14px', width: '22%', color: 'var(--text-muted)', fontWeight: 600 }}>Metric</th>
                {comparedBaskets.map((b) => (
                  <th key={b.id} style={{ padding: '14px', width: `${78 / comparedBaskets.length}%` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.98rem' }}>{b.title}</span>
                      <button
                        onClick={() => onRemoveBasket(b.id)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.15)',
                          color: 'var(--loss)',
                          padding: '4px',
                          borderRadius: '6px',
                        }}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Category */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Theme / Sector</td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} style={{ padding: '12px 14px', color: '#cbd5e1' }}>{b.category}</td>
                ))}
              </tr>

              {/* NAV */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Current NAV</td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} className="num-mono" style={{ padding: '12px 14px', fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>
                    ${b.nav.toFixed(2)} USDC
                  </td>
                ))}
              </tr>

              {/* 1D Rise % */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>1D Rise (%)</td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} className="num-mono" style={{ padding: '12px 14px' }}>
                    <span className={b.returns.d1 >= 0 ? 'badge-gain' : 'badge-loss'}>
                      {b.returns.d1 >= 0 ? '+' : ''}{b.returns.d1}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* 1M Rise % */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>1M Rise (%)</td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} className="num-mono" style={{ padding: '12px 14px' }}>
                    <span className={b.returns.m1 >= 0 ? 'badge-gain' : 'badge-loss'}>
                      {b.returns.m1 >= 0 ? '+' : ''}{b.returns.m1}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* 1Y Rise % */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>1Y Rise (%)</td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} className="num-mono" style={{ padding: '12px 14px' }}>
                    <span className="badge-gain" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      +{b.returns.y1}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Risk Tier */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Risk Tier</td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} style={{ padding: '12px 14px', color: '#cbd5e1' }}>{b.riskTier} Volatility</td>
                ))}
              </tr>

              {/* Min Investment */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Min Investment</td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} className="num-mono" style={{ padding: '12px 14px', color: '#cbd5e1', fontWeight: 600 }}>
                    ${b.minInvestmentUsdc} USDC
                  </td>
                ))}
              </tr>

              {/* Top Holdings */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Constituents</td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {b.constituents.map((item) => (
                        <div key={item.stock.ticker} style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                          <strong style={{ color: '#ffffff' }}>{item.stock.ticker.replace('PRE:', '')}</strong> ({item.weight}%)
                          <span style={{ color: 'var(--text-muted)' }}> • ${item.stock.price}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Rebalance Schedule */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Rebalance Schedule</td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                    {b.rebalanceFrequency}
                  </td>
                ))}
              </tr>

              {/* Detail CTA */}
              <tr>
                <td style={{ padding: '14px' }}></td>
                {comparedBaskets.map((b) => (
                  <td key={b.id} style={{ padding: '14px' }}>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectBasket(b);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--solana-purple) 0%, #7c3aed 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                      }}
                    >
                      View Full Details
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
