'use client';

import React, { useState } from 'react';
import { Layers, Sparkles, Wallet, ShieldAlert, BarChart3, Sliders, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeTab: 'baskets' | 'stocks' | 'builder';
  setActiveTab: (tab: 'baskets' | 'stocks' | 'builder') => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenWalletInfo: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  compareCount,
  onOpenCompare,
  onOpenWalletInfo,
}: HeaderProps) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--solana-purple) 0%, var(--solana-green) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(153, 69, 255, 0.35)',
          }}>
            <Layers size={24} color="#ffffff" />
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
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Tokenized Thematic Stock Baskets on Solana
            </div>
          </div>
        </div>

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
          <button
            onClick={() => setActiveTab('baskets')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: activeTab === 'baskets' ? '#ffffff' : 'var(--text-secondary)',
              background: activeTab === 'baskets' ? 'linear-gradient(135deg, rgba(153, 69, 255, 0.3), rgba(20, 241, 149, 0.2))' : 'transparent',
              border: activeTab === 'baskets' ? '1px solid rgba(153, 69, 255, 0.4)' : '1px solid transparent',
            }}
          >
            <Layers size={16} />
            Explore Baskets
          </button>

          <button
            onClick={() => setActiveTab('stocks')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: activeTab === 'stocks' ? '#ffffff' : 'var(--text-secondary)',
              background: activeTab === 'stocks' ? 'linear-gradient(135deg, rgba(153, 69, 255, 0.3), rgba(20, 241, 149, 0.2))' : 'transparent',
              border: activeTab === 'stocks' ? '1px solid rgba(153, 69, 255, 0.4)' : '1px solid transparent',
            }}
          >
            <BarChart3 size={16} />
            Stock Universe
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: activeTab === 'builder' ? '#ffffff' : 'var(--text-secondary)',
              background: activeTab === 'builder' ? 'linear-gradient(135deg, rgba(153, 69, 255, 0.3), rgba(20, 241, 149, 0.2))' : 'transparent',
              border: activeTab === 'builder' ? '1px solid rgba(153, 69, 255, 0.4)' : '1px solid transparent',
            }}
          >
            <Sliders size={16} />
            Basket Builder
          </button>
        </nav>

        {/* Actions: Compare & Wallet Modal Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {compareCount > 0 && (
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

          <button
            onClick={onOpenWalletInfo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, var(--solana-purple) 0%, #7c3aed 100%)',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(153, 69, 255, 0.25)',
            }}
          >
            <Wallet size={16} />
            <span>Connect Wallet</span>
          </button>
        </div>
      </div>
    </header>
  );
}
