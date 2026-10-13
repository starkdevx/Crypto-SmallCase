'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../components/Header';
import { TickerMarquee } from '../components/TickerMarquee';
import { HeroSection } from '../components/HeroSection';
import { WalletRoadmapModal } from '../components/WalletRoadmapModal';
import {
  ArrowRight,
  BarChart3,
  Sliders,
  PieChart,
} from 'lucide-react';

export default function HomePage() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar: Main Navigation Header */}
      <Header
        onOpenWalletInfo={() => setIsWalletModalOpen(true)}
      />

      {/* Stocks Pricing Moving Layer (Ticker Marquee) */}
      <TickerMarquee />

      {/* Hero Section with Explore Baskets CTA */}
      <HeroSection onLearnMore={() => setIsWalletModalOpen(true)} />

      {/* Quick Pillars / Value Props Navigation */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 64px', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(20, 241, 149, 0.12)',
              border: '1px solid rgba(20, 241, 149, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--solana-green)',
              marginBottom: '14px',
            }}>
              <PieChart size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Thematic Basket Investing
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Instead of picking single stocks, buy curated baskets clustering high-growth sectors: AI compute, MegaCap titans, energy, and fintech.
            </p>
            <Link
              href="/baskets"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: 'var(--solana-green)',
                textDecoration: 'none',
              }}
            >
              <span>Explore Baskets</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(0, 229, 255, 0.12)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--solana-cyan)',
              marginBottom: '14px',
            }}>
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              100 Tokenized Equities
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Access 100 onchain tokenized stocks including Nvidia, Apple, SpaceX, MicroStrategy, and Tesla backed by CoinGecko real-time feeds.
            </p>
            <Link
              href="/stocks"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: 'var(--solana-cyan)',
                textDecoration: 'none',
              }}
            >
              <span>View Stock Universe</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(153, 69, 255, 0.12)',
              border: '1px solid rgba(153, 69, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--solana-purple)',
              marginBottom: '14px',
            }}>
              <Sliders size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Custom Basket Builder
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Design your own personalized index. Pick constituents, balance weights, and simulate historical performance in an interactive sandbox.
            </p>
            <Link
              href="/builder"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#c084fc',
                textDecoration: 'none',
              }}
            >
              <span>Build Custom Basket</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Wallet Modal */}
      <WalletRoadmapModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(6, 9, 14, 0.95)',
        padding: '36px 24px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
        }}>
          <div>
            <strong style={{ color: '#ffffff' }}>xCase</strong> • SmallCase for Crypto on Solana
            <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', marginTop: '4px' }}>
              Powered by CoinGecko xStocks Ecosystem, Pyth Network & PreStocks.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: 'var(--solana-green)', fontWeight: 600 }}>● 100 Tokenized xStocks Live</span>
            <span>Solana Devnet Ready</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
