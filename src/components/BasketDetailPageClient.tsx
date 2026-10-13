'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Basket } from '../types/basket';
import { BasketChartData } from '../lib/chartService';
import { Header } from './Header';
import { TickerMarquee } from './TickerMarquee';
import { WalletRoadmapModal } from './WalletRoadmapModal';
import { BasketComparisonModal } from './BasketComparisonModal';
import { BasketBuyModal } from './BasketBuyModal';
import { STOCK_BASKETS } from '../data/baskets';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  ExternalLink,
  Info,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';

interface BasketDetailPageClientProps {
  basket: Basket;
}

export function BasketDetailPageClient({ basket }: BasketDetailPageClientProps) {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<'30D' | '3M' | '1Y'>('1Y');
  const [viewMode, setViewMode] = useState<string>('aggregate'); // 'aggregate' | 'all' | ticker
  const [chartData, setChartData] = useState<BasketChartData | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [comparedBasketIds, setComparedBasketIds] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Fetch real 24-hour cached CoinGecko market chart data
  useEffect(() => {
    let isMounted = true;
    setIsLoadingChart(true);
    setHoverIndex(null);
    setHoverPos(null);

    fetch(`/api/basket-chart?basketId=${basket.id}&_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        Pragma: 'no-cache',
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
  }, [basket.id]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleToggleCompare = () => {
    setComparedBasketIds((prev) => {
      if (prev.includes(basket.id)) {
        return prev.filter((i) => i !== basket.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 baskets at a time.');
        return prev;
      }
      return [...prev, basket.id];
    });
  };

  const comparedBaskets = STOCK_BASKETS.filter((b) => comparedBasketIds.includes(b.id));

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
      currentPeriodReturn = timeframe === '30D' ? basket.returns.m1 : timeframe === '3M' ? Number((basket.returns.m1 * 2.5).toFixed(2)) : basket.returns.y1;
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
  const chartWidth = 980;
  const chartHeight = 280;
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
  const paddingLeft = 65;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  // Helper coordinate mapper
  const getY = (val: number) => {
    return chartHeight - paddingBottom - ((val - minVal) / range) * innerHeight;
  };
  const getX = (idx: number, total: number) => {
    return paddingLeft + (idx / Math.max(1, total - 1)) * innerWidth;
  };

  // Y-axis tick guidelines & value labels (4 evenly spaced ticks)
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount }, (_, i) => {
    const ratio = i / (yTicksCount - 1);
    const val = minVal + ratio * (maxVal - minVal);
    const y = getY(val);
    let label = '';
    if (viewMode === 'all') {
      label = `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
    } else if (val >= 1000) {
      label = `$${val.toFixed(0)}`;
    } else if (val >= 100) {
      label = `$${val.toFixed(1)}`;
    } else {
      label = `$${val.toFixed(2)}`;
    }
    return { val, y, label };
  });

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
    ? `M ${getX(0, activeNavSeries.length)},${chartHeight - paddingBottom} ` +
      activeNavSeries.map((pt, idx) => `L ${getX(idx, activeNavSeries.length)},${getY(pt.nav)}`).join(' ') +
      ` L ${getX(activeNavSeries.length - 1, activeNavSeries.length)},${chartHeight - paddingBottom} Z`
    : '';

  // SVG Area path for Single Stock Mode
  const singleStockAreaPath = activeSingleStockSeries.length > 1
    ? `M ${getX(0, activeSingleStockSeries.length)},${chartHeight - paddingBottom} ` +
      activeSingleStockSeries.map((pt, idx) => `L ${getX(idx, activeSingleStockSeries.length)},${getY(pt.price)}`).join(' ') +
      ` L ${getX(activeSingleStockSeries.length - 1, activeSingleStockSeries.length)},${chartHeight - paddingBottom} Z`
    : '';

  // Handle interactive hover over SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || pointsCount === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const normalizedX = (clientX / rect.width) * chartWidth;
    const clampedX = Math.max(paddingLeft, Math.min(chartWidth - paddingRight, normalizedX));
    const ratio = (clampedX - paddingLeft) / innerWidth;
    const index = Math.round(ratio * (pointsCount - 1));
    setHoverIndex(Math.max(0, Math.min(pointsCount - 1, index)));
    setHoverPos({ x: clientX, y: clientY });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setHoverPos(null);
  };

  // Hovered data point details
  const hoveredNavPoint = hoverIndex !== null && activeNavSeries[hoverIndex] ? activeNavSeries[hoverIndex] : null;
  const hoveredStockPoint = hoverIndex !== null && activeSingleStockSeries[hoverIndex] ? activeSingleStockSeries[hoverIndex] : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar: Main Navigation Header */}
      <Header
        compareCount={comparedBasketIds.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
      />

      {/* Stocks Pricing Moving Layer (Ticker Marquee) */}
      <TickerMarquee />

      {/* Breadcrumb Navigation Bar */}
      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '20px 24px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
          <Link
            href="/baskets"
            style={{
              color: 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to All Baskets</span>
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>/</span>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>{basket.title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCopyLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            {copiedLink ? <Check size={14} color="var(--solana-green)" /> : <Share2 size={14} />}
            <span>{copiedLink ? 'Link Copied' : 'Share Basket'}</span>
          </button>

          <button
            onClick={handleToggleCompare}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: comparedBasketIds.includes(basket.id) ? 'rgba(153, 69, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: comparedBasketIds.includes(basket.id) ? '#c084fc' : 'var(--text-secondary)',
              border: comparedBasketIds.includes(basket.id) ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <Layers size={14} />
            <span>{comparedBasketIds.includes(basket.id) ? 'In Compare List' : 'Add to Compare'}</span>
          </button>
        </div>
      </div>

      {/* Main Basket Detail Page Content */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 24px 80px' }}>
        {/* Hero Header Section */}
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.76rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '6px',
              background: 'rgba(153, 69, 255, 0.15)',
              color: '#c084fc',
              border: '1px solid rgba(153, 69, 255, 0.3)',
            }}>
              {basket.category}
            </span>

            <span style={{
              fontSize: '0.76rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '6px',
              background: 'rgba(20, 241, 149, 0.12)',
              color: 'var(--solana-green)',
              border: '1px solid rgba(20, 241, 149, 0.25)',
            }}>
              {basket.riskTier} Volatility
            </span>

            <span style={{
              fontSize: '0.76rem',
              color: 'var(--solana-cyan)',
              background: 'rgba(0, 229, 255, 0.1)',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--solana-green)' }} />
              Live CoinGecko 24h Cached
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            {basket.title}
          </h1>

          <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '900px', marginBottom: '28px' }}>
            {basket.description}
          </p>

          {/* Key Metrics Snapshot Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            padding: '20px',
            borderRadius: '18px',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                {currentMetricLabel}
              </div>
              <div className="num-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                ${currentPriceOrNavDisplay.toFixed(2)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>USDC</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                {timeframe} Return
              </div>
              <div className={`num-mono ${currentPeriodReturn >= 0 ? 'badge-gain' : 'badge-loss'}`} style={{ marginTop: '4px', fontSize: '1.05rem', padding: '4px 12px' }}>
                {currentPeriodReturn >= 0 ? '+' : ''}{currentPeriodReturn}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Min Investment
              </div>
              <div className="num-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                ${basket.minInvestmentUsdc} USDC
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Constituents
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#cbd5e1', marginTop: '4px' }}>
                {basket.constituents.length} Tokenized xStocks
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Rebalance Cadence
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#cbd5e1', marginTop: '4px' }}>
                {basket.rebalanceFrequency}
              </div>
            </div>
          </div>
        </div>

        {/* Historical Performance Chart Section */}
        <div style={{
          marginBottom: '28px',
          padding: '28px',
          borderRadius: '24px',
          background: 'rgba(15, 22, 36, 0.85)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}>
          {/* Chart Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--solana-green)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                  {viewMode === 'aggregate'
                    ? 'Aggregate Basket NAV Performance'
                    : viewMode === 'all'
                    ? 'Constituent Multi-Stock Comparison'
                    : `${activeConstituent?.name || viewMode} Price History`}
                </h2>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
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
                    setHoverPos(null);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: timeframe === tf ? 'var(--solana-purple)' : 'transparent',
                    color: timeframe === tf ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                >
                  {tf === '30D' ? '30 Days' : tf === '3M' ? '3 Months' : '1 Year'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart View Mode Selector Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <button
              onClick={() => {
                setViewMode('aggregate');
                setHoverIndex(null);
                setHoverPos(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: viewMode === 'aggregate' ? 'rgba(20, 241, 149, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: viewMode === 'aggregate' ? 'var(--solana-green)' : 'var(--text-secondary)',
                border: viewMode === 'aggregate' ? '1px solid var(--solana-green)' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--solana-green)' }} />
              Aggregate Basket NAV
            </button>

            <button
              onClick={() => {
                setViewMode('all');
                setHoverIndex(null);
                setHoverPos(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: viewMode === 'all' ? 'rgba(153, 69, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: viewMode === 'all' ? '#c084fc' : 'var(--text-secondary)',
                border: viewMode === 'all' ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
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
                    setHoverPos(null);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    background: isSelected ? `${color}25` : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? color : '#cbd5e1',
                    border: isSelected ? `1px solid ${color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  {item.stock.image && (
                    <img
                      src={item.stock.image}
                      alt={item.stock.ticker}
                      style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'contain' }}
                    />
                  )}
                  <span>{item.stock.ticker}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.weight}%</span>
                </button>
              );
            })}
          </div>

          {/* SVG Canvas Area */}
          <div style={{ width: '100%', height: '280px', position: 'relative' }}>
            {isLoadingChart ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid rgba(20, 241, 149, 0.2)',
                  borderTopColor: 'var(--solana-green)',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <span>Loading 24h cached CoinGecko historical series...</span>
              </div>
            ) : (
              <svg
                ref={svgRef}
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                style={{ width: '100%', height: '100%', overflow: 'visible', cursor: 'pointer' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id="pageBasketAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--solana-green)" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="var(--solana-green)" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="pageStockAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Guidelines & Value Ticks */}
                {yTicks.map((tick, idx) => (
                  <g key={idx}>
                    <line
                      x1={paddingLeft}
                      y1={tick.y}
                      x2={chartWidth - paddingRight}
                      y2={tick.y}
                      stroke="rgba(255, 255, 255, 0.07)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={tick.y}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="var(--font-mono, monospace)"
                    >
                      {tick.label}
                    </text>
                  </g>
                ))}

                {/* VIEW MODE 1: Aggregate Basket NAV */}
                {viewMode === 'aggregate' && (
                  <>
                    {areaPath && <path d={areaPath} fill="url(#pageBasketAreaGrad)" />}
                    <polyline
                      fill="none"
                      stroke="var(--solana-green)"
                      strokeWidth="1.8"
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
                          strokeWidth="1.3"
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
                    {singleStockAreaPath && <path d={singleStockAreaPath} fill="url(#pageStockAreaGrad)" />}
                    <polyline
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="1.8"
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
                    y1={paddingTop}
                    x2={getX(hoverIndex, pointsCount)}
                    y2={chartHeight - paddingBottom}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeDasharray="3 3"
                    strokeWidth="1.2"
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
                    r="4.5"
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
                          y={chartHeight - 8}
                          textAnchor={idx === 0 ? 'start' : idx === 4 ? 'end' : 'middle'}
                          fill="#64748b"
                          fontSize="10.5"
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

            {/* Dynamic Floating Interactive Tooltip positioned near cursor */}
            {hoverIndex !== null && hoverPos && (
              <div
                style={{
                  position: 'absolute',
                  left: `${hoverPos.x}px`,
                  top: `${Math.max(10, Math.min(200, hoverPos.y - 25))}px`,
                  transform: hoverPos.x > 550 ? 'translate(-108%, 0)' : 'translate(14px, 0)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(9, 14, 26, 0.96)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.75)',
                  pointerEvents: 'none',
                  fontSize: '0.8rem',
                  zIndex: 30,
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.08s ease-out',
                }}
              >
                {viewMode === 'aggregate' && hoveredNavPoint && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{hoveredNavPoint.date}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.02rem', color: '#ffffff' }}>
                      ${hoveredNavPoint.nav.toFixed(2)} USDC
                    </div>
                    <div className={hoveredNavPoint.returnPct >= 0 ? 'badge-gain' : 'badge-loss'} style={{ display: 'inline-block', marginTop: '3px' }}>
                      {hoveredNavPoint.returnPct >= 0 ? '+' : ''}{hoveredNavPoint.returnPct}% from start
                    </div>
                  </div>
                )}

                {viewMode === 'all' && chartData && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '4px' }}>
                      {hoveredNavPoint?.date}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 10px', maxHeight: '120px', overflowY: 'auto' }}>
                      {chartData.constituents.map((c) => {
                        const pt = c.timeframes[timeframe][hoverIndex];
                        return (
                          <div key={c.ticker} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}>
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
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{hoveredStockPoint.date}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.02rem', color: '#00E5FF' }}>
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
          padding: '24px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(20, 241, 149, 0.04) 0%, rgba(153, 69, 255, 0.04) 100%)',
          border: '1px solid rgba(20, 241, 149, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Calculator size={20} color="var(--solana-green)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              Historical Investment Calculator
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Investment Amount</span>
                <span className="num-mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>$50</span>
                <span>$2,500</span>
                <span>$5,000</span>
                <span>$10,000</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '18px 22px',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Simulated Value based on real {timeframe} performance ({currentPeriodReturn >= 0 ? '+' : ''}{currentPeriodReturn}%):
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                <span className="num-mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
                  ${calculatedFutureValue.toFixed(2)} USDC
                </span>
                <span className={`num-mono ${profitLoss >= 0 ? 'color-gain' : 'color-loss'}`} style={{ fontSize: '0.94rem', fontWeight: 700 }}>
                  ({profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)})
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                *Past simulation based on CoinGecko historical oracle data does not guarantee future results.
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Constituents Table with Real Tokenized xStocks Data */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Underlying Tokenized Shares ({basket.constituents.length} xStocks)
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Transparent target weights and live oracle pricing
              </p>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.04)', padding: '4px 10px', borderRadius: '6px' }}>
              Data: CoinGecko xStocks Ecosystem
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Asset</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Sector</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Weight</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Est. Alloc</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Share Price</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>24h %</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>24h High / Low</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Market Cap</th>
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
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {stock.image && (
                            <img
                              src={stock.image}
                              alt={stock.ticker}
                              style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'contain' }}
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
                      <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                        {stock.sector}
                      </td>

                      {/* Weight */}
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          fontWeight: 700,
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          color: '#e2e8f0',
                        }}>
                          {item.weight}%
                        </span>
                      </td>

                      {/* Simulated Dollar alloc */}
                      <td className="num-mono" style={{ padding: '14px', color: '#cbd5e1' }}>
                        ${itemDollarAlloc.toFixed(0)}
                      </td>

                      {/* Price */}
                      <td className="num-mono" style={{ padding: '14px', fontWeight: 600, color: '#ffffff' }}>
                        ${stock.price.toFixed(2)}
                      </td>

                      {/* 24h change */}
                      <td className="num-mono" style={{ padding: '14px' }}>
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
                      <td className="num-mono" style={{ padding: '14px', fontSize: '0.78rem', color: '#94a3b8' }}>
                        ${stock.high24h?.toFixed(2) ?? '-'} / ${stock.low24h?.toFixed(2) ?? '-'}
                      </td>

                      {/* Market Cap */}
                      <td className="num-mono" style={{ padding: '14px', color: '#e2e8f0', fontWeight: 600 }}>
                        {stock.marketCap}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Curator Profile & 1-Click Buy Action Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '24px 32px',
          borderRadius: '20px',
          background: 'rgba(18, 25, 40, 0.9)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(153, 69, 255, 0.25), rgba(20, 241, 149, 0.25))',
              border: '1px solid rgba(20, 241, 149, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--solana-green)',
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>
                  xCase Thematic Index
                </span>
                <CheckCircle2 size={16} color="var(--solana-green)" />
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {basket.constituents.length} tokenized assets • Rebalanced {basket.rebalanceFrequency} • Min ${basket.minInvestmentUsdc} USDC
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/"
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              Browse Other Baskets
            </Link>

            <button
              onClick={() => setIsBuyModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--solana-green) 0%, #059669 100%)',
                color: '#07090e',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>1-Click Buy Basket</span>
              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
      </main>

      {/* Modals on Basket Page */}
      <BasketBuyModal
        basket={basket}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

      <WalletRoadmapModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      <BasketComparisonModal
        comparedBaskets={comparedBaskets}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveBasket={(id) => setComparedBasketIds((prev) => prev.filter((i) => i !== id))}
        onSelectBasket={(b) => {
          setIsCompareModalOpen(false);
          router.push(`/basket/${b.slug || b.id}`);
        }}
      />
    </div>
  );
}
