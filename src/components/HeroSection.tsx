import React from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, ShieldCheck, Zap, ArrowRight, Layers, BarChart3 } from 'lucide-react';

interface HeroSectionProps {
  onLearnMore?: () => void;
}

export function HeroSection({ onLearnMore }: HeroSectionProps) {

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
            <Link
              href="/baskets"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--solana-green) 0%, #059669 100%)',
                color: '#07090e',
                fontWeight: 800,
                fontSize: '0.94rem',
                textDecoration: 'none',
                boxShadow: '0 0 25px rgba(20, 241, 149, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              <Layers size={18} />
              <span>Explore Baskets</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/stocks"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.35)',
                color: 'var(--solana-cyan)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <BarChart3 size={17} />
              <span>Tokenized Stocks</span>
            </Link>
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
