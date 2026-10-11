'use client';

import React, { useState } from 'react';
import { Basket, Timeframe } from '../types/basket';
import {
  X,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Clock,
  Sparkles,
  Calculator,
  Wallet,
  ExternalLink,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface BasketDetailModalProps {
  basket: Basket | null;
  onClose: () => void;
  onOpenWalletPreview: () => void;
}

export function BasketDetailModal({
  basket,
  onClose,
  onOpenWalletPreview,
}: BasketDetailModalProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1Y');
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [showSp500, setShowSp500] = useState<boolean>(true);
  const [showSol, setShowSol] = useState<boolean>(true);

  if (!basket) return null;

  const getReturn = (tf: Timeframe) => {
    switch (tf) {
      case '1D': return basket.returns.d1;
      case '1W': return basket.returns.w1;
      case '1M': return basket.returns.m1;
      case '1Y': return basket.returns.y1;
      case 'ALL': return basket.returns.allTime;
    }
  };

  const currentReturn = getReturn(selectedTimeframe);
  const isPositive = currentReturn >= 0;

  // Investment return calculation
  const calculatedFutureValue = calcAmount * (1 + currentReturn / 100);
  const profitLoss = calculatedFutureValue - calcAmount;

  const sp500ReturnMap: Record<Timeframe, number> = {
    '1D': 0.4,
    '1W': 1.2,
    '1M': 3.1,
    '1Y': 24.8,
    'ALL': 45.0,
  };
  const sp500Return = sp500ReturnMap[selectedTimeframe];

  // SVG Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 220;
  const chartData = basket.historicalChart;

  const allNavValues = chartData.map((d) => d.nav);
  const allSpValues = showSp500 ? chartData.map((d) => d.sp500) : [];
  const allSolValues = showSol ? chartData.map((d) => d.sol) : [];
  const combinedValues = [...allNavValues, ...allSpValues, ...allSolValues];

  const minChart = Math.min(...combinedValues);
  const maxChart = Math.max(...combinedValues);
  const chartRange = maxChart - minChart || 1;

  const generateCoords = (key: 'nav' | 'sp500' | 'sol') => {
    return chartData.map((pt, idx) => {
      const x = (idx / (chartData.length - 1)) * (chartWidth - 60) + 30;
      const y = chartHeight - ((pt[key] - minChart) / chartRange) * (chartHeight - 50) - 25;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  const navCoords = generateCoords('nav');
  const spCoords = generateCoords('sp500');
  const solCoords = generateCoords('sol');

  const segmentColors = ['#9945FF', '#14F195', '#00E5FF', '#F59E0B', '#EC4899', '#6366F1', '#3B82F6'];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#0c111e',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '32px',
          borderRadius: '24px',
          position: 'relative',
        }}
      >
        {/* Close button */}
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

        {/* Header section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: '6px',
              background: 'rgba(153, 69, 255, 0.15)',
              color: '#c084fc',
              border: '1px solid rgba(153, 69, 255, 0.3)',
            }}>
              {basket.category}
            </span>

            <span style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '6px',
              background: 'rgba(20, 241, 149, 0.12)',
              color: 'var(--solana-green)',
              border: '1px solid rgba(20, 241, 149, 0.25)',
            }}>
              {basket.riskTier} Volatility
            </span>

            <span style={{
              fontSize: '0.72rem',
              color: 'var(--solana-cyan)',
              background: 'rgba(0, 229, 255, 0.1)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              fontWeight: 600,
            }}>
              CoinGecko xStocks Verified
            </span>
          </div>

          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            {basket.title}
          </h2>

          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {basket.description}
          </p>
        </div>

        {/* Snapshot Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginBottom: '28px',
          padding: '16px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Current Basket NAV
            </div>
            <div className="num-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              ${basket.nav.toFixed(2)} USDC
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              24h Weighted Return
            </div>
            <div className={`num-mono ${basket.returns.d1 >= 0 ? 'badge-gain' : 'badge-loss'}`} style={{ marginTop: '2px' }}>
              {basket.returns.d1 >= 0 ? '+' : ''}{basket.returns.d1}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              1Y Return Trajectory
            </div>
            <div className="num-mono badge-gain" style={{ marginTop: '2px' }}>
              +{basket.returns.y1}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Min Investment
            </div>
            <div className="num-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              ${basket.minInvestmentUsdc} USDC
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Rebalance Cadence
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#cbd5e1', marginTop: '2px' }}>
              {basket.rebalanceFrequency}
            </div>
          </div>
        </div>

        {/* Historical Performance Chart Section */}
        <div style={{
          marginBottom: '28px',
          padding: '20px',
          borderRadius: '18px',
          background: 'rgba(15, 22, 36, 0.8)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                Historical NAV & Benchmark Comparison
              </h3>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Indexed base = 100 baseline
              </div>
            </div>

            {/* Timeframe Selector Pills */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '4px',
              borderRadius: '8px',
            }}>
              {(['1D', '1W', '1M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
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

          {/* Benchmark toggles */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '12px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--solana-green)', fontWeight: 600 }}>
              <span style={{ width: '12px', height: '3px', background: 'var(--solana-green)', borderRadius: '2px' }} />
              {basket.title} (+{currentReturn}%)
            </div>

            <button
              onClick={() => setShowSp500(!showSp500)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: showSp500 ? '#94a3b8' : 'var(--text-muted)',
                background: 'transparent',
                fontWeight: 600,
              }}
            >
              <span style={{ width: '12px', height: '3px', background: '#94a3b8', borderRadius: '2px', opacity: showSp500 ? 1 : 0.3 }} />
              S&P 500 (+{sp500Return}%)
            </button>

            <button
              onClick={() => setShowSol(!showSol)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: showSol ? 'var(--solana-purple)' : 'var(--text-muted)',
                background: 'transparent',
                fontWeight: 600,
              }}
            >
              <span style={{ width: '12px', height: '3px', background: 'var(--solana-purple)', borderRadius: '2px', opacity: showSol ? 1 : 0.3 }} />
              Solana (SOL)
            </button>
          </div>

          {/* SVG Canvas Area */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              {[0.25, 0.5, 0.75].map((pct, idx) => (
                <line
                  key={idx}
                  x1="30"
                  y1={chartHeight * pct}
                  x2={chartWidth - 30}
                  y2={chartHeight * pct}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
              ))}

              {showSp500 && (
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  points={spCoords}
                />
              )}

              {showSol && (
                <polyline
                  fill="none"
                  stroke="var(--solana-purple)"
                  strokeWidth="2"
                  opacity="0.8"
                  points={solCoords}
                />
              )}

              <polyline
                fill="none"
                stroke="var(--solana-green)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={navCoords}
              />

              {chartData.map((pt, idx) => {
                const x = (idx / (chartData.length - 1)) * (chartWidth - 60) + 30;
                return (
                  <text
                    key={pt.date}
                    x={x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {pt.date}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Investment Return Simulator */}
        <div style={{
          marginBottom: '28px',
          padding: '20px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(20, 241, 149, 0.04) 0%, rgba(153, 69, 255, 0.04) 100%)',
          border: '1px solid rgba(20, 241, 149, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calculator size={18} color="var(--solana-green)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Historical Investment Calculator
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Investment Amount</span>
                <span className="num-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  ${calcAmount.toLocaleString()} USDC
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="10000"
                step="50"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--solana-green)',
                  cursor: 'pointer',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>$50</span>
                <span>$2,500</span>
                <span>$5,000</span>
                <span>$10,000</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Simulated Value based on {selectedTimeframe} performance:
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                <div className="num-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--solana-green)' }}>
                  ${calculatedFutureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} USDC
                </div>
                <div className="num-mono badge-gain">
                  +{currentReturn.toFixed(1)}% (+${profitLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })})
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                *Past simulation does not guarantee future results.
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Constituents Table with Real Tokenized xStocks Data */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              Underlying Tokenized Shares ({basket.constituents.length} xStocks)
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Data: CoinGecko xStocks Ecosystem
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Asset</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Sector</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Weight</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Est. Alloc</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Share Price</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>24h %</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>24h High / Low</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {basket.constituents.map((item) => {
                  const stock = item.stock;
                  const itemDollarAlloc = (calcAmount * item.weight) / 100;
                  const isStockPos = stock.change24h >= 0;

                  return (
                    <tr
                      key={stock.ticker}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Asset Ticker, Image & Name */}
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {stock.image && (
                            <img
                              src={stock.image}
                              alt={stock.ticker}
                              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'contain' }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: 800, color: '#ffffff' }}>
                              {stock.ticker}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {stock.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Sector */}
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {stock.sector}
                      </td>

                      {/* Weight */}
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          fontWeight: 700,
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: '#e2e8f0',
                        }}>
                          {item.weight}%
                        </span>
                      </td>

                      {/* Simulated Dollar alloc */}
                      <td className="num-mono" style={{ padding: '12px', color: '#cbd5e1' }}>
                        ${itemDollarAlloc.toFixed(0)}
                      </td>

                      {/* Price */}
                      <td className="num-mono" style={{ padding: '12px', fontWeight: 600, color: '#ffffff' }}>
                        ${stock.price.toFixed(2)}
                      </td>

                      {/* 24h change */}
                      <td className="num-mono" style={{ padding: '12px' }}>
                        <span style={{
                          color: isStockPos ? 'var(--gain)' : 'var(--loss)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontWeight: 600,
                        }}>
                          {isStockPos ? '+' : ''}{stock.change24h}%
                        </span>
                      </td>

                      {/* 24h High/Low */}
                      <td className="num-mono" style={{ padding: '12px', fontSize: '0.78rem', color: '#94a3b8' }}>
                        ${stock.high24h?.toFixed(2) ?? '-'} / ${stock.low24h?.toFixed(2) ?? '-'}
                      </td>

                      {/* Market Cap */}
                      <td className="num-mono" style={{ padding: '12px', color: '#e2e8f0', fontWeight: 600 }}>
                        {stock.marketCap}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Curator Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '18px 24px',
          borderRadius: '16px',
          background: 'rgba(18, 25, 40, 0.8)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={basket.curator.avatar}
              alt={basket.curator.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.96rem', color: '#ffffff' }}>
                  {basket.curator.name}
                </span>
                <CheckCircle2 size={16} color="var(--solana-green)" />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {basket.curator.handle} • {basket.curator.followers.toLocaleString()} Copiers • Fee {basket.curator.feePercent}%
              </div>
            </div>
          </div>

          <button
            onClick={onOpenWalletPreview}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--solana-green) 0%, #059669 100%)',
              color: '#07090e',
              fontWeight: 800,
              fontSize: '0.86rem',
            }}
          >
            <span>v1 1-Click Buy Preview</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
