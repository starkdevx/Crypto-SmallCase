'use client';

import React, { useState } from 'react';
import { ALL_XSTOCKS, getStock } from '../data/stocks';
import { Stock } from '../types/basket';
import { Plus, Trash2, Sliders, Sparkles, RefreshCw, CheckCircle2, Info } from 'lucide-react';

interface SelectedItem {
  stock: Stock;
  weight: number;
}

export function BasketBuilderSandbox() {
  const stockList = ALL_XSTOCKS;

  const [basketName, setBasketName] = useState('My Custom xStock Basket');
  const [basketThesis, setBasketThesis] = useState('High conviction basket of tokenized AI silicon, Bitcoin treasuries, and SpaceX.');
  const [selectedConstituents, setSelectedConstituents] = useState<SelectedItem[]>([
    { stock: getStock('NVDAX'), weight: 35 },
    { stock: getStock('SPCXX'), weight: 30 },
    { stock: getStock('MSTRX'), weight: 20 },
    { stock: getStock('COINX'), weight: 15 },
  ]);

  const [searchStock, setSearchStock] = useState('');

  // Total weight
  const totalWeight = selectedConstituents.reduce((acc, curr) => acc + curr.weight, 0);

  // Blended 1Y Rise calculation
  const blended1YRise = totalWeight > 0
    ? selectedConstituents.reduce((acc, curr) => acc + (curr.stock.change1y ?? 50) * (curr.weight / totalWeight), 0)
    : 0;

  // Blended 24h change calculation
  const blended24hChange = totalWeight > 0
    ? selectedConstituents.reduce((acc, curr) => acc + curr.stock.change24h * (curr.weight / totalWeight), 0)
    : 0;

  // Blended NAV
  const simulatedNav = totalWeight > 0
    ? selectedConstituents.reduce((acc, curr) => acc + curr.stock.price * (curr.weight / 100), 0)
    : 0;

  // Auto-normalize weights to 100%
  const handleNormalizeWeights = () => {
    if (selectedConstituents.length === 0) return;
    const equalWeight = Math.floor(100 / selectedConstituents.length);
    const remainder = 100 - equalWeight * selectedConstituents.length;

    const normalized = selectedConstituents.map((item, idx) => ({
      ...item,
      weight: idx === 0 ? equalWeight + remainder : equalWeight,
    }));
    setSelectedConstituents(normalized);
  };

  const handleUpdateWeight = (ticker: string, newWeight: number) => {
    setSelectedConstituents((prev) =>
      prev.map((item) => (item.stock.ticker === ticker ? { ...item, weight: newWeight } : item))
    );
  };

  const handleRemoveStock = (ticker: string) => {
    setSelectedConstituents((prev) => prev.filter((item) => item.stock.ticker !== ticker));
  };

  const handleAddStock = (stock: Stock) => {
    if (selectedConstituents.some((i) => i.stock.ticker === stock.ticker)) return;
    setSelectedConstituents((prev) => [...prev, { stock, weight: 10 }]);
  };

  const availableStocks = stockList.filter(
    (s) =>
      !selectedConstituents.some((item) => item.stock.ticker === s.ticker) &&
      (s.ticker.toLowerCase().includes(searchStock.toLowerCase()) ||
        s.name.toLowerCase().includes(searchStock.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchStock.toLowerCase()))
  );

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px 64px' }}>
      {/* Intro Heading */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          borderRadius: '999px',
          background: 'rgba(20, 241, 149, 0.1)',
          border: '1px solid rgba(20, 241, 149, 0.3)',
          color: 'var(--solana-green)',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '10px',
        }}>
          <Sliders size={14} />
          <span>Interactive Sandbox Simulator</span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Custom xStock Basket Builder & Backtester
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '780px' }}>
          Select from 100 tokenized equities (Nvidia, SpaceX, MicroStrategy, TSMC, Tesla, Circle), calibrate allocation weights, and instantly compute blended NAV and 24h/1Y returns.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '32px',
      }}>
        {/* Left Column: Basket Configuration & Constituents */}
        <div>
          {/* Metadata Inputs */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
              Basket Metadata
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                Basket Title
              </label>
              <input
                type="text"
                value={basketName}
                onChange={(e) => setBasketName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                Investment Thesis & Description
              </label>
              <textarea
                rows={2}
                value={basketThesis}
                onChange={(e) => setBasketThesis(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Active Constituents Sliders */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                  Selected Constituents ({selectedConstituents.length})
                </h3>
                <div style={{ fontSize: '0.76rem', color: totalWeight === 100 ? 'var(--solana-green)' : 'var(--accent-gold)' }}>
                  Total Weight: {totalWeight}% {totalWeight !== 100 && '(Target: 100%)'}
                </div>
              </div>

              <button
                onClick={handleNormalizeWeights}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                }}
              >
                <RefreshCw size={12} />
                <span>Auto-Balance to 100%</span>
              </button>
            </div>

            {selectedConstituents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                No stocks selected. Add stocks below to start building your basket!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedConstituents.map((item) => (
                  <div
                    key={item.stock.ticker}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.stock.image && (
                          <img
                            src={item.stock.image}
                            alt={item.stock.ticker}
                            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'contain' }}
                          />
                        )}
                        <div>
                          <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.92rem' }}>
                            {item.stock.ticker}
                          </span>{' '}
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>${item.stock.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="num-mono" style={{ fontWeight: 800, color: 'var(--solana-green)', fontSize: '0.92rem' }}>
                          {item.weight}%
                        </span>
                        <button
                          onClick={() => handleRemoveStock(item.stock.ticker)}
                          style={{
                            background: 'transparent',
                            color: 'var(--loss)',
                            padding: '4px',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={item.weight}
                        onChange={(e) => handleUpdateWeight(item.stock.ticker, Number(e.target.value))}
                        style={{
                          flex: 1,
                          accentColor: 'var(--solana-purple)',
                          cursor: 'pointer',
                        }}
                      />
                      <span className="num-mono" style={{
                        fontSize: '0.76rem',
                        color: item.stock.change24h >= 0 ? 'var(--gain)' : 'var(--loss)',
                        fontWeight: 600,
                      }}>
                        24h: {item.stock.change24h >= 0 ? '+' : ''}{item.stock.change24h}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Stocks From 100 Universe */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              Add Stocks from 100 xStocks Universe
            </h3>

            <input
              type="text"
              placeholder="Search by symbol (e.g. MSTR, TSLA, NVDA)..."
              value={searchStock}
              onChange={(e) => setSearchStock(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
              {availableStocks.map((stock) => (
                <div
                  key={stock.ticker}
                  onClick={() => handleAddStock(stock)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {stock.image && (
                      <img
                        src={stock.image}
                        alt={stock.ticker}
                        style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'contain' }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#ffffff' }}>
                        {stock.ticker}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ${stock.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'rgba(20, 241, 149, 0.15)',
                    color: 'var(--solana-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Plus size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Computed Performance Card */}
        <div>
          <div className="glass-panel" style={{ padding: '28px', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={18} color="var(--solana-green)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Simulated Basket Preview
              </h3>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(153, 69, 255, 0.12) 0%, rgba(20, 241, 149, 0.08) 100%)',
              border: '1px solid rgba(153, 69, 255, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#c084fc', fontWeight: 700, marginBottom: '4px' }}>
                Simulated 1Y Blended Rise
              </div>
              <div className="num-mono" style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--gain)', letterSpacing: '-0.03em' }}>
                +{blended1YRise.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                Weighted average of underlying CoinGecko tokenized xStocks
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Basket NAV</div>
                <div className="num-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  ${simulatedNav.toFixed(2)} USDC
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>24h Blended Change</div>
                <div className="num-mono" style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: blended24hChange >= 0 ? 'var(--gain)' : 'var(--loss)',
                }}>
                  {blended24hChange >= 0 ? '+' : ''}{blended24hChange.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Allocation Breakdown Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span>Weight Allocation Visualization</span>
                <span className="num-mono">{totalWeight}% / 100%</span>
              </div>
              <div style={{
                height: '10px',
                borderRadius: '999px',
                display: 'flex',
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                gap: '2px',
              }}>
                {selectedConstituents.map((item, idx) => {
                  const colors = ['#9945FF', '#14F195', '#00E5FF', '#F59E0B', '#EC4899', '#6366F1'];
                  return (
                    <div
                      key={item.stock.ticker}
                      title={`${item.stock.ticker}: ${item.weight}%`}
                      style={{
                        width: `${item.weight}%`,
                        backgroundColor: colors[idx % colors.length],
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* v1 Roadmap Notice */}
            <div style={{
              display: 'flex',
              gap: '10px',
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
            }}>
              <Info size={16} color="var(--solana-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                In v1, you will be able to publish this basket onchain, share it with the Solana community, and earn <strong style={{ color: '#ffffff' }}>0.25% creator fees</strong> on every copier investment!
              </div>
            </div>

            {/* Simulated Action */}
            <button
              onClick={() => {
                alert(`Basket "${basketName}" simulated successfully!\nConstituents: ${selectedConstituents.length} xStocks\nBlended 1Y Rise: +${blended1YRise.toFixed(1)}%\n\nOnchain publishing will be enabled in v1 with Solana wallet connection.`);
              }}
              disabled={selectedConstituents.length === 0}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--solana-purple) 0%, var(--solana-green) 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                boxShadow: '0 0 25px rgba(153, 69, 255, 0.3)',
              }}
            >
              Simulate & Save Custom Basket
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
