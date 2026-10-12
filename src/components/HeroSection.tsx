'use client';

import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Zap, Wallet, ArrowUpRight } from 'lucide-react';
import { useSolanaWallet } from '../context/SolanaWalletContext';

interface HeroSectionProps {
  onLearnMore: () => void;
}

export function HeroSection({ onLearnMore }: HeroSectionProps) {
  const { connected, walletAddress, setIsWalletModalOpen } = useSolanaWallet();

  return (
    <section style={{
      padding: '48px 24px 32px',
      maxWidth: '1280px',
      margin: '0 auto',
      position: 'relative',
    }}>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'center',
      }}>
        {/* Main Pitch */}
        <div>
          <h1 style={{
            fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            Invest in{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--solana-green) 0%, var(--solana-cyan) 50%, var(--solana-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Tokenized Stock Baskets
            </span>{' '}
            on Solana.
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '24px',
            maxWidth: '600px',
          }}>
            Thematic portfolio investing built for Web3. Buy diversified baskets of tokenized US equities (Nvidia, Apple, SpaceX, Tesla) and crypto rails in 1-click on Solana—powered by real-time onchain instant liquidity.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            {!connected ? (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--solana-purple) 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  boxShadow: '0 0 25px rgba(153, 69, 255, 0.35)',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <Wallet size={18} />
                <span>Connect Solana Wallet</span>
              </button>
            ) : (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                background: 'rgba(20, 241, 149, 0.12)',
                border: '1px solid rgba(20, 241, 149, 0.3)',
                color: 'var(--solana-green)',
                fontWeight: 700,
                fontSize: '0.88rem',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--solana-green)' }} />
                <span>Wallet Connected: {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}</span>
              </div>
            )}

            <button
              onClick={onLearnMore}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#cbd5e1',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <span>Onchain Mechanics</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

        </div>

        {/* Highlight Stats Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Top 1Y Basket Gain</span>
              <TrendingUp size={18} color="var(--gain)" />
            </div>
            <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--gain)' }}>
              +138.4%
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Bitcoin Treasuries & Onchain FinTech
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tokenized Stocks</span>
              <Zap size={18} color="var(--solana-purple)" />
            </div>
            <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#e2e8f0' }}>
              100 xStocks
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              SpaceX, MSTR, NVDA, TSLA, CRCL
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>API Optimization</span>
              <ShieldCheck size={18} color="var(--solana-cyan)" />
            </div>
            <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#e2e8f0' }}>
              0 Costs
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              24h Daily Edge Revalidation
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Min Investment</span>
              <Sparkles size={18} color="var(--accent-gold)" />
            </div>
            <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#e2e8f0' }}>
              $25 USDC
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Fractional onchain shares
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
