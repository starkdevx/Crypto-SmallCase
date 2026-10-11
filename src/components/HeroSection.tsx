'use client';

import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Zap, Info } from 'lucide-react';

interface HeroSectionProps {
  onLearnMore: () => void;
}

export function HeroSection({ onLearnMore }: HeroSectionProps) {
  return (
    <section style={{
      padding: '48px 24px 32px',
      maxWidth: '1280px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Top Tag */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '999px',
        background: 'rgba(153, 69, 255, 0.12)',
        border: '1px solid rgba(153, 69, 255, 0.3)',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#c084fc',
        marginBottom: '20px',
      }}>
        <Sparkles size={14} />
        <span>Solana Tokenized Equities • v0 Info & Analytics Release</span>
      </div>

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
              Thematic Stock Baskets
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
            Discover pre-curated baskets of tokenized US mega-caps, high-conviction AI chips, and pre-IPO pioneers (SpaceX, OpenAI, Stripe). Track live NAV, transparent constituent weights, and historical returns across any timeframe.
          </p>

          {/* v0 Roadmap Notice Box */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(20, 241, 149, 0.05)',
            border: '1px solid rgba(20, 241, 149, 0.2)',
            maxWidth: '640px',
          }}>
            <Info size={18} color="var(--solana-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--solana-green)' }}>v0 Info Mode Active:</strong> Explore basket constituents, risk ratings, and % growth metrics. In the upcoming v1 release, you can connect your Phantom / Solflare wallet to purchase whole baskets with 1-click via Meteora multi-token swaps.
            </div>
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
              +114.6%
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Autonomous AI & Compute Grid
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Private Pre-IPOs</span>
              <Zap size={18} color="var(--solana-purple)" />
            </div>
            <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#e2e8f0' }}>
              5 Unicorns
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              SpaceX, OpenAI, Stripe & more
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Oracle Precision</span>
              <ShieldCheck size={18} color="var(--solana-cyan)" />
            </div>
            <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#e2e8f0' }}>
              sub-400ms
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Real-time Pyth & PreStocks Feeds
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Min Investment</span>
              <Sparkles size={18} color="var(--accent-gold)" />
            </div>
            <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#e2e8f0' }}>
              $20 USDC
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Fractional tokenized shares
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
