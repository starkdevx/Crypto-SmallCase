'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Basket } from '../types/basket';
import { BasketChartData, ConstituentChartSeries } from '../lib/chartService';
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
  Activity,
  Layers,
  Database,
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
  const [timeframe, setTimeframe] = useState<'30D' | '3M' | '1Y'>('1Y');
  const [viewMode, setViewMode] = useState<string>('aggregate'); // 'aggregate' | 'all' | ticker
  const [chartData, setChartData] = useState<BasketChartData | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Fetch real 24-hour cached CoinGecko market chart data
  useEffect(() => {
    if (!basket) return;
    let isMounted = true;
    setIsLoadingChart(true);
    setHoverIndex(null);

    fetch(`/api/basket-chart?basketId=${basket.id}&_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch chart data');
        return res.json();
      })
      .then((data: BasketChartData) => {
        if (isMounted) {
          setChartData(data);
          setIsLoadingChart(false);
        }
      })
      .catch((err) => {
        console.error('Chart load error:', err);
        if (isMounted) setIsLoadingChart(false);
      });

    return () => {
      isMounted = false;
    };
  }, [basket?.id]);

  if (!basket) return null;

  // Active series resolution
  const activeNavSeries = chartData?.timeframes[timeframe] || [];
  const activeConstituent = chartData?.constituents.find((c) => c.ticker === viewMode);
  const activeSingleStockSeries = activeConstituent?.timeframes[timeframe] || [];

  // Determine current return % based on timeframe and active view
  let currentPeriodReturn = 0;
  let currentPriceOrNavDisplay = basket.nav;
  let currentMetricLabel = 'Basket NAV';

  if (viewMode === 'aggregate' || viewMode === 'all') {
    if (activeNavSeries.length > 0) {
      currentPeriodReturn = activeNavSeries[activeNavSeries.length - 1].returnPct;
      currentPriceOrNavDisplay = activeNavSeries[activeNavSeries.length - 1].nav;
    } else {
      currentPeriodReturn = timeframe === '30D' ? basket.returns.m1 : timeframe === '3M' ? basket.returns.m1 * 2.5 : basket.returns.y1;
    }
    currentMetricLabel = 'Basket NAV';
  } else if (activeConstituent && activeSingleStockSeries.length > 0) {
    currentPeriodReturn = activeSingleStockSeries[activeSingleStockSeries.length - 1].returnPct;
    currentPriceOrNavDisplay = activeSingleStockSeries[activeSingleStockSeries.length - 1].price;
    currentMetricLabel = `${activeConstituent.ticker} Price`;
  }

  // Investment return calculation based on real period return
  const calculatedFutureValue = calcAmount * (1 + currentPeriodReturn / 100);
  const profitLoss = calculatedFutureValue - calcAmount;

  // SVG Chart Dimensions
  const chartWidth = 760;
  const chartHeight = 240;
  const segmentColors = ['#14F195', '#9945FF', '#00E5FF', '#F59E0B', '#EC4899', '#6366F1', '#3B82F6', '#10B981', '#E11D48'];

  // Calculate coordinates for SVG rendering
  let pointsCount = activeNavSeries.length;
  let minVal = 0;
  let maxVal = 100;

  if (viewMode === 'aggregate') {
    pointsCount = activeNavSeries.length;
    if (pointsCount > 0) {
      const values = activeNavSeries.map((d) => d.nav);
      minVal = Math.min(...values);
      maxVal = Math.max(...values);
    }
  } else if (viewMode === 'all') {
    pointsCount = activeNavSeries.length;
    if (chartData && chartData.constituents.length > 0) {
      const allReturns = chartData.constituents.flatMap((c) => c.timeframes[timeframe].map((p) => p.returnPct));
      minVal = Math.min(0, ...allReturns);
      maxVal = Math.max(10, ...allReturns);
    }
  } else if (activeSingleStockSeries.length > 0) {
    pointsCount = activeSingleStockSeries.length;
    const values = activeSingleStockSeries.map((d) => d.price);
    minVal = Math.min(...values);
    maxVal = Math.max(...values);
  }

  const range = maxVal - minVal || 1;
  const paddingX = 35;
  const paddingY = 25;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  // Helper coordinate mapper
  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minVal) / range) * innerHeight;
  };
  const getX = (idx: number, total: number) => {
    return paddingX + (idx / Math.max(1, total - 1)) * innerWidth;
  };

  // Polyline for aggregate basket
  const navCoords = activeNavSeries
    .map((pt, idx) => `${getX(idx, activeNavSeries.length).toFixed(1)},${getY(pt.nav).toFixed(1)}`)
    .join(' ');

  // Polyline for single stock
  const singleStockCoords = activeSingleStockSeries
    .map((pt, idx) => `${getX(idx, activeSingleStockSeries.length).toFixed(1)},${getY(pt.price).toFixed(1)}`)
    .join(' ');

  // SVG Area path for Aggregate Mode
  const areaPath = activeNavSeries.length > 1
    ? `M ${getX(0, activeNavSeries.length)},${chartHeight - paddingY} ` +
      activeNavSeries.map((pt, idx) => `L ${getX(idx, activeNavSeries.length)},${getY(pt.nav)}`).join(' ') +
      ` L ${getX(activeNavSeries.length - 1, activeNavSeries.length)},${chartHeight - paddingY} Z`
    : '';

  // SVG Area path for Single Stock Mode
  const singleStockAreaPath = activeSingleStockSeries.length > 1
    ? `M ${getX(0, activeSingleStockSeries.length)},${chartHeight - paddingY} ` +
      activeSingleStockSeries.map((pt, idx) => `L ${getX(idx, activeSingleStockSeries.length)},${getY(pt.price)}`).join(' ') +
      ` L ${getX(activeSingleStockSeries.length - 1, activeSingleStockSeries.length)},${chartHeight - paddingY} Z`
    : '';

  // Handle interactive hover over SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || pointsCount === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const normalizedX = (clientX / rect.width) * chartWidth;
    const clampedX = Math.max(paddingX, Math.min(chartWidth - paddingX, normalizedX));
    const ratio = (clampedX - paddingX) / innerWidth;
    const index = Math.round(ratio * (pointsCount - 1));
    setHoverIndex(Math.max(0, Math.min(pointsCount - 1, index)));
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Hovered data point details
  const hoveredNavPoint = hoverIndex !== null && activeNavSeries[hoverIndex] ? activeNavSeries[hoverIndex] : null;
  const hoveredStockPoint = hoverIndex !== null && activeSingleStockSeries[hoverIndex] ? activeSingleStockSeries[hoverIndex] : null;

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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--solana-green)' }} />
              Live CoinGecko 24h Cached
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
          marginBottom: '24px',
          padding: '16px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {currentMetricLabel}
            </div>
            <div className="num-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
              ${currentPriceOrNavDisplay.toFixed(2)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {timeframe} Return
            </div>
            <div className={`num-mono ${currentPeriodReturn >= 0 ? 'badge-gain' : 'badge-loss'}`} style={{ marginTop: '2px' }}>
              {currentPeriodReturn >= 0 ? '+' : ''}{currentPeriodReturn}%
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
              Constituents
            </div>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#cbd5e1', marginTop: '2px' }}>
              {basket.constituents.length} xStocks
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
          background: 'rgba(15, 22, 36, 0.85)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}>
          {/* Chart Header Bar: Title + Timeframes */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--solana-green)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                  {viewMode === 'aggregate'
                    ? 'Aggregate Basket NAV Performance'
                    : viewMode === 'all'
                    ? 'Constituent Multi-Stock Comparison'
                    : `${activeConstituent?.name || viewMode} Price History`}
                </h3>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {viewMode === 'all'
                  ? 'All underlying stocks plotted on normalized % return baseline'
                  : 'Sourced from live CoinGecko market_chart oracle • Cached for 24 hours'}
              </div>
            </div>

            {/* Timeframe Selector Pills (30D, 3M, 1Y) */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              {(['30D', '3M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setHoverIndex(null);
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: timeframe === tf ? 'var(--solana-purple)' : 'transparent',
                    color: timeframe === tf ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tf === '30D' ? '30 Days' : tf === '3M' ? '3 Months' : '1 Year'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart View Mode Selector Pills (Aggregate vs. Compare All vs. Each Stock) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <button
              onClick={() => {
                setViewMode('aggregate');
                setHoverIndex(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                background: viewMode === 'aggregate' ? 'rgba(20, 241, 149, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: viewMode === 'aggregate' ? 'var(--solana-green)' : 'var(--text-secondary)',
                border: viewMode === 'aggregate' ? '1px solid var(--solana-green)' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--solana-green)' }} />
              Aggregate Basket NAV
            </button>

            <button
              onClick={() => {
                setViewMode('all');
                setHoverIndex(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                background: viewMode === 'all' ? 'rgba(153, 69, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: viewMode === 'all' ? '#c084fc' : 'var(--text-secondary)',
                border: viewMode === 'all' ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Layers size={13} />
              Compare All Stocks
            </button>

            <span style={{ color: 'rgba(255, 255, 255, 0.2)', margin: '0 4px' }}>|</span>

            {/* Individual Stock Selector Pills */}
            {basket.constituents.map((item, idx) => {
              const isSelected = viewMode === item.stock.ticker;
              const color = segmentColors[idx % segmentColors.length];
              return (
                <button
                  key={item.stock.ticker}
                  onClick={() => {
                    setViewMode(isSelected ? 'aggregate' : item.stock.ticker);
                    setHoverIndex(null);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: isSelected ? `${color}25` : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? color : '#cbd5e1',
                    border: isSelected ? `1px solid ${color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {item.stock.image && (
                    <img
                      src={item.stock.image}
                      alt={item.stock.ticker}
                      style={{ width: '12px', height: '12px', borderRadius: '50%', objectFit: 'contain' }}
                    />
                  )}
                  <span>{item.stock.ticker}</span>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{item.weight}%</span>
                </button>
              );
            })}
          </div>

          {/* SVG Canvas Area */}
          <div style={{ width: '100%', height: '240px', position: 'relative' }}>
            {isLoadingChart ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '2px solid rgba(20, 241, 149, 0.2)',
                  borderTopColor: 'var(--solana-green)',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <span>Loading 24h cached CoinGecko historical data...</span>
              </div>
            ) : (
              <svg
                ref={svgRef}
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                style={{ width: '100%', height: '100%', overflow: 'visible', cursor: 'crosshair' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id="basketAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--solana-green)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--solana-green)" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="stockAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                {[0.2, 0.45, 0.7, 0.95].map((pct, idx) => (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={chartHeight * pct}
                    x2={chartWidth - paddingX}
                    y2={chartHeight * pct}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* VIEW MODE 1: Aggregate Basket NAV */}
                {viewMode === 'aggregate' && (
                  <>
                    {areaPath && <path d={areaPath} fill="url(#basketAreaGrad)" />}
                    <polyline
                      fill="none"
                      stroke="var(--solana-green)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={navCoords}
                    />
                  </>
                )}

                {/* VIEW MODE 2: Compare All Constituents */}
                {viewMode === 'all' && chartData && (
                  <>
                    {chartData.constituents.map((c, cIdx) => {
                      const cSlice = c.timeframes[timeframe];
                      const color = segmentColors[cIdx % segmentColors.length];
                      const cCoords = cSlice
                        .map((pt, idx) => `${getX(idx, cSlice.length).toFixed(1)},${getY(pt.returnPct).toFixed(1)}`)
                        .join(' ');
                      return (
                        <polyline
                          key={c.ticker}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          strokeOpacity="0.85"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={cCoords}
                        />
                      );
                    })}
                  </>
                )}

                {/* VIEW MODE 3: Single Constituent Stock */}
                {viewMode !== 'aggregate' && viewMode !== 'all' && (
                  <>
                    {singleStockAreaPath && <path d={singleStockAreaPath} fill="url(#stockAreaGrad)" />}
                    <polyline
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={singleStockCoords}
                    />
                  </>
                )}

                {/* Interactive Crosshair Tracking Line */}
                {hoverIndex !== null && pointsCount > 0 && (
                  <line
                    x1={getX(hoverIndex, pointsCount)}
                    y1={paddingY}
                    x2={getX(hoverIndex, pointsCount)}
                    y2={chartHeight - paddingY}
                    stroke="rgba(255, 255, 255, 0.35)"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                )}

                {/* Interactive Dot at hover point */}
                {hoverIndex !== null && pointsCount > 0 && (
                  <circle
                    cx={getX(hoverIndex, pointsCount)}
                    cy={
                      viewMode === 'aggregate' && hoveredNavPoint
                        ? getY(hoveredNavPoint.nav)
                        : viewMode !== 'all' && hoveredStockPoint
                        ? getY(hoveredStockPoint.price)
                        : getY(hoveredNavPoint ? hoveredNavPoint.returnPct : 0)
                    }
                    r="5"
                    fill="#ffffff"
                    stroke={viewMode === 'aggregate' ? 'var(--solana-green)' : '#00E5FF'}
                    strokeWidth="2.5"
                  />
                )}

                {/* X-Axis Dates */}
                {(viewMode !== 'aggregate' && viewMode !== 'all' ? activeSingleStockSeries : activeNavSeries).length > 0 && (
                  <>
                    {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                      const activeSeries = viewMode !== 'aggregate' && viewMode !== 'all' ? activeSingleStockSeries : activeNavSeries;
                      const dataIdx = Math.min(
                        activeSeries.length - 1,
                        Math.round(pct * (activeSeries.length - 1))
                      );
                      const pt = activeSeries[dataIdx];
                      if (!pt) return null;
                      const x = getX(dataIdx, activeSeries.length);
                      return (
                        <text
                          key={idx}
                          x={x}
                          y={chartHeight - 6}
                          textAnchor={idx === 0 ? 'start' : idx === 4 ? 'end' : 'middle'}
                          fill="#64748b"
                          fontSize="10"
                          fontWeight="500"
                        >
                          {pt.date}
                        </text>
                      );
                    })}
                  </>
                )}
              </svg>
            )}

            {/* Floating Interactive Tooltip */}
            {hoverIndex !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '16px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(10, 15, 29, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
                  pointerEvents: 'none',
                  fontSize: '0.78rem',
                }}
              >
                {viewMode === 'aggregate' && hoveredNavPoint && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{hoveredNavPoint.date}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
                      ${hoveredNavPoint.nav.toFixed(2)} USDC
                    </div>
                    <div className={hoveredNavPoint.returnPct >= 0 ? 'badge-gain' : 'badge-loss'} style={{ display: 'inline-block', marginTop: '3px' }}>
                      {hoveredNavPoint.returnPct >= 0 ? '+' : ''}{hoveredNavPoint.returnPct}% from start
                    </div>
                  </div>
                )}

                {viewMode === 'all' && chartData && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '4px' }}>
                      {hoveredNavPoint?.date}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 10px', maxHeight: '110px', overflowY: 'auto' }}>
                      {chartData.constituents.map((c) => {
                        const pt = c.timeframes[timeframe][hoverIndex];
                        return (
                          <div key={c.ticker} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                            <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{c.ticker}:</span>
                            <span className={pt?.returnPct >= 0 ? 'color-gain' : 'color-loss'}>
                              {pt?.returnPct >= 0 ? '+' : ''}{pt?.returnPct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {viewMode !== 'aggregate' && viewMode !== 'all' && hoveredStockPoint && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{hoveredStockPoint.date}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#00E5FF' }}>
                      ${hoveredStockPoint.price.toFixed(2)}
                    </div>
                    <div className={hoveredStockPoint.returnPct >= 0 ? 'badge-gain' : 'badge-loss'} style={{ display: 'inline-block', marginTop: '3px' }}>
                      {hoveredStockPoint.returnPct >= 0 ? '+' : ''}{hoveredStockPoint.returnPct}% in {timeframe}
                    </div>
                  </div>
                )}
              </div>
            )}
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
                Simulated Value based on real {timeframe} performance ({currentPeriodReturn >= 0 ? '+' : ''}{currentPeriodReturn}%):
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                <span className="num-mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
                  ${calculatedFutureValue.toFixed(2)} USDC
                </span>
                <span className={`num-mono ${profitLoss >= 0 ? 'color-gain' : 'color-loss'}`} style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                  ({profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)})
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                *Past simulation based on CoinGecko historical oracle data does not guarantee future results.
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
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(153, 69, 255, 0.2), rgba(20, 241, 149, 0.2))',
              border: '1px solid rgba(20, 241, 149, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--solana-green)',
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.96rem', color: '#ffffff' }}>
                  Stocklana Thematic Index
                </span>
                <CheckCircle2 size={16} color="var(--solana-green)" />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {basket.constituents.length} tokenized assets • Rebalanced {basket.rebalanceFrequency} • Min ${basket.minInvestmentUsdc} USDC
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
