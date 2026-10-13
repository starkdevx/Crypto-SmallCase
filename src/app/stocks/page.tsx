'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { TickerMarquee } from '../../components/TickerMarquee';
import { StockUniverseTable } from '../../components/StockUniverseTable';
import { Basket } from '../../types/basket';

export default function StocksUniversePage() {
  const router = useRouter();

  const handleSelectBasket = (basket: Basket) => {
    router.push(`/basket/${basket.slug || basket.id}`);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <Header />

      {/* Ticker Marquee */}
      <TickerMarquee />

      {/* Stock Universe Table */}
      <div style={{ width: '100%' }}>
        <StockUniverseTable onSelectBasket={handleSelectBasket} />
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
