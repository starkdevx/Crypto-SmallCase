'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Sparkles, BarChart3, Sliders, Home } from 'lucide-react';
import { WalletUserMenu } from './WalletUserMenu';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  compareCount?: number;
  onOpenCompare?: () => void;
  onOpenWalletInfo?: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  compareCount = 0,
  onOpenCompare,
  onOpenWalletInfo,
}: HeaderProps) {
  const pathname = usePathname() || '/';

  // Automatically determine active tab from URL path
  const currentTab = (() => {
    if (activeTab) return activeTab;
    if (pathname.startsWith('/baskets') || pathname.startsWith('/basket/')) return 'baskets';
    if (pathname.startsWith('/stocks')) return 'stocks';
    if (pathname.startsWith('/builder')) return 'builder';
    if (pathname === '/') return 'home';
    return '';
  })();

  const getTabStyle = (tabKey: string) => {
    const isActive = currentTab === tabKey;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '0.86rem',
      fontWeight: 600,
      color: isActive ? '#ffffff' : 'var(--text-secondary)',
      background: isActive
        ? 'linear-gradient(135deg, rgba(153, 69, 255, 0.3), rgba(20, 241, 149, 0.2))'
        : 'transparent',
      border: isActive ? '1px solid rgba(153, 69, 255, 0.4)' : '1px solid transparent',
      textDecoration: 'none',
      transition: 'all 0.15s ease',
      cursor: 'pointer',
    };
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(7, 9, 14, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Brand Logo - Links to Home */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--solana-purple) 0%, var(--solana-green) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(153, 69, 255, 0.35)',
            flexShrink: 0,
          }}>
            <Layers size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                xCase
              </span>
              <span style={{
                background: 'rgba(20, 241, 149, 0.12)',
                color: 'var(--solana-green)',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(20, 241, 149, 0.3)',
                letterSpacing: '0.04em',
              }}>
                SOLANA
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              SmallCase for Crypto
            </div>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(18, 25, 40, 0.8)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          gap: '4px',
        }}>
          <Link href="/" style={getTabStyle('home')}>
            <Home size={15} />
            <span>Home</span>
          </Link>

          <Link href="/baskets" style={getTabStyle('baskets')}>
            <Layers size={15} />
            <span>Explore Baskets</span>
          </Link>

          <Link href="/stocks" style={getTabStyle('stocks')}>
            <BarChart3 size={15} />
            <span>Stock Universe</span>
          </Link>

          <Link href="/builder" style={getTabStyle('builder')}>
            <Sliders size={15} />
            <span>Basket Builder</span>
          </Link>
        </nav>

        {/* Actions: Compare & Wallet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {compareCount > 0 && onOpenCompare && (
            <button
              onClick={onOpenCompare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: 'rgba(20, 241, 149, 0.15)',
                color: 'var(--solana-green)',
                border: '1px solid rgba(20, 241, 149, 0.35)',
                cursor: 'pointer',
              }}
            >
              <span>Compare</span>
              <span style={{
                background: 'var(--solana-green)',
                color: '#07090e',
                borderRadius: '999px',
                padding: '1px 6px',
                fontSize: '0.72rem',
                fontWeight: 800,
              }}>
                {compareCount}
              </span>
            </button>
          )}

          <WalletUserMenu />
        </div>
      </div>
    </header>
  );
}
