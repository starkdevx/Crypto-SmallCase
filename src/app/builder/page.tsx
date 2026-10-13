'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { TickerMarquee } from '../../components/TickerMarquee';
import { BasketBuilderSandbox } from '../../components/BasketBuilderSandbox';
import { ArrowLeft, Sliders } from 'lucide-react';

export default function BuilderPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <Header />

      {/* Ticker Marquee */}
      <TickerMarquee />

      {/* Breadcrumbs */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 24px 0', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
          <span style={{ color: 'var(--text-muted)', opacity: 0.4 }}>/</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--solana-purple)', fontWeight: 600 }}>
            Basket Builder
          </span>
        </div>
      </div>

      {/* Basket Builder Sandbox */}
      <div style={{ width: '100%' }}>
        <BasketBuilderSandbox />
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(6, 9, 14, 0.95)',
        padding: '16px 24px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
        }}>
          <div>
            <strong style={{ color: '#ffffff' }}>xCase</strong> • SmallCase for Crypto on Solana
          </div>
        </div>
      </footer>
    </main>
  );
}
