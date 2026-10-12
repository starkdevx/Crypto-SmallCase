'use client';

import React from 'react';
import { useSolanaWallet, WalletInfo } from '../context/SolanaWalletContext';
import { X, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export function WalletModal() {
  const {
    isWalletModalOpen,
    setIsWalletModalOpen,
    availableWallets,
    connect,
    connecting,
  } = useSolanaWallet();

  if (!isWalletModalOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'rgba(3, 5, 10, 0.8)',
      backdropFilter: 'blur(16px)',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        background: 'linear-gradient(145deg, rgba(16, 22, 38, 0.95) 0%, rgba(10, 14, 26, 0.98) 100%)',
        border: '1px solid rgba(153, 69, 255, 0.35)',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(153, 69, 255, 0.15)',
      }}>
        {/* Close Button */}
        <button
          onClick={() => setIsWalletModalOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            background: 'rgba(20, 241, 149, 0.12)',
            border: '1px solid rgba(20, 241, 149, 0.3)',
            color: 'var(--solana-green)',
            fontSize: '0.72rem',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            <ShieldCheck size={13} />
            <span>SECURE SOLANA WALLET CONNECTION</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Connect Solana Wallet
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            Select your preferred wallet to manage tokenized stock baskets, verify onchain ownership, and execute transactions.
          </p>
        </div>

        {/* Wallets List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {availableWallets.map((wallet) => (
            <div
              key={wallet.id}
              onClick={async () => {
                if (wallet.isInstalled) {
                  await connect(wallet.id);
                } else {
                  window.open(wallet.installUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '16px',
                background: wallet.isInstalled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: wallet.isInstalled ? '1px solid rgba(153, 69, 255, 0.25)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(153, 69, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(153, 69, 255, 0.45)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = wallet.isInstalled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = wallet.isInstalled ? '1px solid rgba(153, 69, 255, 0.25)' : '1px solid var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {wallet.id === 'phantom' && (
                    <span style={{ fontSize: '1.2rem' }}>👻</span>
                  )}
                  {wallet.id === 'solflare' && (
                    <span style={{ fontSize: '1.2rem' }}>🔥</span>
                  )}
                  {wallet.id === 'backpack' && (
                    <span style={{ fontSize: '1.2rem' }}>🎒</span>
                  )}
                  {wallet.id === 'injected' && (
                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#ffffff' }}>
                    {wallet.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: wallet.isInstalled ? 'var(--solana-green)' : 'var(--text-muted)' }}>
                    {wallet.isInstalled ? '● Detected' : 'Not installed'}
                  </div>
                </div>
              </div>

              <div>
                {wallet.isInstalled ? (
                  <span style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, var(--solana-purple) 0%, #7c3aed 100%)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                  }}>
                    Connect
                  </span>
                ) : (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                  }}>
                    Install <ExternalLink size={12} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info note */}
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: 'rgba(20, 241, 149, 0.04)',
          border: '1px solid rgba(20, 241, 149, 0.15)',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
        }}>
          <CheckCircle2 size={16} color="var(--solana-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            Transactions are signed locally in your wallet and broadcast directly to the Solana RPC cluster. Your private keys never leave your device.
          </div>
        </div>
      </div>
    </div>
  );
}
