'use client';

import React, { useState } from 'react';
import { X, Wallet, CheckCircle2, ArrowRight, Zap, ShieldCheck, RefreshCw } from 'lucide-react';
import { STOCK_BASKETS } from '../data/baskets';

interface WalletRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletRoadmapModal({ isOpen, onClose }: WalletRoadmapModalProps) {
  const [selectedBasketId, setSelectedBasketId] = useState(STOCK_BASKETS[0].id);
  const [simulatedAmount, setSimulatedAmount] = useState(250);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedTxHash, setSimulatedTxHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeBasket = STOCK_BASKETS.find((b) => b.id === selectedBasketId) || STOCK_BASKETS[0];

  const handleSimulateBuy = () => {
    setIsSimulating(true);
    setSimulatedTxHash(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulatedTxHash('5UGv8zKj92pLx1...M9qF7wX3k21');
    }, 1200);
  };

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
          maxWidth: '780px',
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

        {/* Modal Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(153, 69, 255, 0.12)',
            border: '1px solid rgba(153, 69, 255, 0.3)',
            color: '#c084fc',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            <Wallet size={14} />
            <span>v1 Roadmap & Interactive Simulation</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Solana Wallet & 1-Click Buy Integration
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            In v0, Stocklana provides portfolio intelligence, constituent breakdowns, and historical % rise metrics. In v1, connect Phantom or Solflare to execute atomic basket purchases.
          </p>
        </div>

        {/* 3 Step Architecture */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '28px',
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--solana-purple)', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ background: 'rgba(153, 69, 255, 0.2)', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>1</span>
              <span>Wallet Adapter</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Connect via Phantom, Solflare, or Backpack with standard Solana Mobile Wallet Adapter.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--solana-green)', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ background: 'rgba(20, 241, 149, 0.2)', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>2</span>
              <span>Meteora Split Swap</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Your deposit in USDC is dynamically routed across constituent pools with optimal slippage.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--solana-cyan)', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ background: 'rgba(0, 229, 255, 0.2)', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>3</span>
              <span>Basket Mint Receipt</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Receive an SPL Basket Token representing proportional ownership of underlying stock tokens.
            </div>
          </div>
        </div>

        {/* Live Interactive Buy Simulation Box */}
        <div style={{
          padding: '22px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(20, 241, 149, 0.05) 0%, rgba(153, 69, 255, 0.05) 100%)',
          border: '1px solid rgba(20, 241, 149, 0.25)',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Zap size={18} color="var(--solana-green)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Test-Drive the v1 Buy Flow (Interactive Simulation)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                Select Stock Basket:
              </label>
              <select
                value={selectedBasketId}
                onChange={(e) => setSelectedBasketId(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                }}
              >
                {STOCK_BASKETS.map((b) => (
                  <option key={b.id} value={b.id}>{b.title} (+{b.returns.y1}% 1Y)</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                Simulated Deposit (USDC):
              </label>
              <input
                type="number"
                value={simulatedAmount}
                onChange={(e) => setSimulatedAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                }}
              />
            </div>
          </div>

          {/* Allocation preview */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '16px',
            fontSize: '0.8rem',
          }}>
            <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
              Multi-Token Split for ${simulatedAmount} USDC deposit:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {activeBasket.constituents.map((item) => (
                <span key={item.stock.ticker} style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '4px 8px', borderRadius: '6px', color: '#cbd5e1' }}>
                  <strong>{item.stock.ticker.replace('PRE:', '')}</strong>: ${(simulatedAmount * item.weight / 100).toFixed(1)} ({item.weight}%)
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleSimulateBuy}
            disabled={isSimulating}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--solana-green) 0%, #059669 100%)',
              color: '#07090e',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isSimulating ? (
              <>
                <RefreshCw size={16} className="animate-pulse-subtle" />
                <span>Simulating Solana Multi-Swap on Devnet...</span>
              </>
            ) : (
              <>
                <span>Execute Simulated 1-Click Buy</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {simulatedTxHash && (
            <div style={{
              marginTop: '14px',
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <CheckCircle2 size={18} color="var(--solana-green)" />
              <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                <strong>Simulation Confirmed!</strong> Splitted ${simulatedAmount} USDC into {activeBasket.constituents.length} constituent tokens. Simulated Tx: <span style={{ fontFamily: 'monospace', color: 'var(--solana-green)' }}>{simulatedTxHash}</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#cbd5e1',
            fontWeight: 600,
            fontSize: '0.86rem',
          }}
        >
          Close Roadmap Preview
        </button>
      </div>
    </div>
  );
}
