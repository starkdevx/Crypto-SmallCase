'use client';

import React from 'react';
import { Basket, Timeframe } from '../types/basket';
import { ArrowUpRight, ArrowDownRight, Layers, Check, Plus } from 'lucide-react';

interface BasketCardProps {
  basket: Basket;
  selectedTimeframe: Timeframe;
  onSelect: (basket: Basket) => void;
  isCompared: boolean;
  onToggleCompare: (basket: Basket) => void;
}

export function BasketCard({
  basket,
  selectedTimeframe,
  onSelect,
  isCompared,
  onToggleCompare,
}: BasketCardProps) {
  const getReturn = (tf: Timeframe) => {
    switch (tf) {
      case '1D': return basket.returns.d1;
      case '1W': return basket.returns.w1;
      case '1M': return basket.returns.m1;
      case '1Y': return basket.returns.y1;
    }
  };

  const currentReturn = getReturn(selectedTimeframe);
  const isPositive = currentReturn >= 0;

  // Colors for risk tiers
  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case 'Low':
        return { color: 'var(--gain)', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' };
      case 'Moderate':
        return { color: 'var(--solana-cyan)', bg: 'rgba(0, 229, 255, 0.1)', border: 'rgba(0, 229, 255, 0.3)' };
      case 'High':
        return { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.3)' };
      case 'Aggressive':
      default:
        return { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)', border: 'rgba(192, 132, 252, 0.3)' };
    }
  };

  const riskStyle = getRiskStyle(basket.riskTier);

  // Dynamic sparkline points adapting to selectedTimeframe
  const chartSlice = (() => {
    if (selectedTimeframe === '1D') return basket.historicalChart.slice(-3);
    if (selectedTimeframe === '1W') return basket.historicalChart.slice(-5);
    if (selectedTimeframe === '1M') return basket.historicalChart.slice(-8);
    return basket.historicalChart;
  })();

  const points = chartSlice.map((pt) => pt.nav);
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;
  const svgWidth = 260;
  const svgHeight = 52;
  const coords = points.map((val, idx) => {
    const x = (idx / Math.max(1, points.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minVal) / range) * (svgHeight - 12) - 6;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Gradient area fill for sparkline
  const areaCoords = points.length > 1
    ? `M 0,${svgHeight} ` +
      points.map((val, idx) => {
        const x = (idx / Math.max(1, points.length - 1)) * svgWidth;
        const y = svgHeight - ((val - minVal) / range) * (svgHeight - 12) - 6;
        return `L ${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ') +
      ` L ${svgWidth},${svgHeight} Z`
    : '';

  // Colors for constituents stacked bar
  const segmentColors = ['#9945FF', '#14F195', '#00E5FF', '#F59E0B', '#EC4899', '#6366F1', '#3B82F6'];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={() => onSelect(basket)}
    >

      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            padding: '3px 9px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#cbd5e1',
          }}>
            {basket.category}
          </span>

          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '6px',
            background: riskStyle.bg,
            color: riskStyle.color,
            border: `1px solid ${riskStyle.border}`,
          }}>
            {basket.riskTier} Volatility
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '6px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          {basket.title}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.45,
          marginBottom: '18px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {basket.tagline}
        </p>

        {/* Performance & Price Metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '14px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Basket NAV
            </div>
            <div className="num-mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc' }}>
              ${basket.nav.toFixed(2)}{' '}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>USDC</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {selectedTimeframe} Return
            </div>
            <div
              className={`num-mono ${isPositive ? 'badge-gain' : 'badge-loss'}`}
              style={{ fontSize: '0.92rem', padding: '4px 10px', marginTop: '2px' }}
            >
              {isPositive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              {isPositive ? '+' : ''}{currentReturn.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Mini Sparkline Chart */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>Historical Trajectory</span>
            <span className="num-mono">{selectedTimeframe} Trend</span>
          </div>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ width: '100%', height: '46px', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id={`sparkGrad-${basket.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? 'var(--solana-green)' : 'var(--loss)'} stopOpacity="0.22" />
                <stop offset="100%" stopColor={isPositive ? 'var(--solana-green)' : 'var(--loss)'} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {areaCoords && <path d={areaCoords} fill={`url(#sparkGrad-${basket.id})`} />}
            <polyline
              fill="none"
              stroke={isPositive ? 'var(--solana-green)' : 'var(--loss)'}
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={coords}
            />
          </svg>
        </div>

        {/* Constituent Allocation Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span>Holdings Breakdown ({basket.constituents.length} tokenized xStocks)</span>
            <span style={{ color: 'var(--text-muted)' }}>Min ${basket.minInvestmentUsdc}</span>
          </div>
          {/* Stacked Bar */}
          <div style={{
            height: '8px',
            borderRadius: '999px',
            display: 'flex',
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            gap: '2px',
          }}>
            {basket.constituents.map((item, idx) => (
              <div
                key={item.stock.ticker}
                title={`${item.stock.name} (${item.stock.ticker}): ${item.weight}%`}
                style={{
                  width: `${item.weight}%`,
                  backgroundColor: segmentColors[idx % segmentColors.length],
                }}
              />
            ))}
          </div>

          {/* Constituent Token Badges with Real CoinGecko Images - Showing Every Stock Clearly */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            {basket.constituents.map((item) => (
              <span
                key={item.stock.ticker}
                title={`${item.stock.name} (${item.weight}%)`}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#f1f5f9',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {item.stock.image && (
                  <img
                    src={item.stock.image}
                    alt={item.stock.ticker}
                    style={{ width: '13px', height: '13px', borderRadius: '50%', objectFit: 'contain' }}
                  />
                )}
                <span>{item.stock.ticker}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 500 }}>
                  {item.weight}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Curator & Actions */}
      <div style={{
        paddingTop: '14px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
      }}>
        {/* Basket Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Min <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${basket.minInvestmentUsdc} USDC</span>
            <span style={{ margin: '0 6px', opacity: 0.4 }}>•</span>
            <span>{basket.rebalanceFrequency}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleCompare(basket)}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.74rem',
              fontWeight: 600,
              background: isCompared ? 'rgba(20, 241, 149, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: isCompared ? 'var(--solana-green)' : 'var(--text-secondary)',
              border: isCompared ? '1px solid var(--solana-green)' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isCompared ? <Check size={12} /> : <Plus size={12} />}
            <span>Compare</span>
          </button>

          <button
            onClick={() => onSelect(basket)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, rgba(153, 69, 255, 0.8), rgba(124, 58, 237, 0.9))',
              color: '#ffffff',
            }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
