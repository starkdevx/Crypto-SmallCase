'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSolanaWallet } from '../context/SolanaWalletContext';
import {
  Wallet,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  RefreshCw,
  Coins,
  ChevronDown,
  Globe,
} from 'lucide-react';

export function WalletUserMenu() {
  const {
    connected,
    connecting,
    walletAddress,
    walletName,
    balance,
    network,
    setNetwork,
    disconnect,
    refreshBalance,
    requestAirdrop,
    setIsWalletModalOpen,
  } = useSolanaWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAirdrop = async () => {
    setIsAirdropping(true);
    await requestAirdrop();
    setIsAirdropping(false);
  };

  if (!connected || !walletAddress) {
    return (
      <button
        onClick={() => setIsWalletModalOpen(true)}
        disabled={connecting}
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
          cursor: 'pointer',
          border: 'none',
        }}
      >
        <Wallet size={16} />
        <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    );
  }

  const truncatedAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 14px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(153, 69, 255, 0.35)',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Network & Live Balance indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--solana-green)',
            boxShadow: '0 0 8px var(--solana-green)',
            display: 'inline-block',
          }} />
          <span className="num-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>
            {balance !== null ? `${balance} SOL` : '0 SOL'}
          </span>
        </div>

        {/* Truncated Address */}
        <div style={{
          padding: '3px 8px',
          background: 'rgba(153, 69, 255, 0.2)',
          borderRadius: '8px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#c084fc',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>{truncatedAddress}</span>
          <ChevronDown size={13} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '280px',
          background: 'rgba(14, 18, 30, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(153, 69, 255, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
          zIndex: 100,
        }}>
          {/* Header row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '12px',
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Connected via</div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                {walletName || 'Solana Wallet'}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(20, 241, 149, 0.1)',
              border: '1px solid rgba(20, 241, 149, 0.25)',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--solana-green)',
            }}>
              <Globe size={11} />
              <span>{network.toUpperCase()}</span>
            </div>
          </div>

          {/* Full address pill with copy */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '12px',
            fontSize: '0.76rem',
          }}>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              {truncatedAddress}
            </span>
            <button
              onClick={handleCopy}
              style={{
                background: 'transparent',
                border: 'none',
                color: copied ? 'var(--solana-green)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Actions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* View on Explorer */}
            <a
              href={`https://explorer.solana.com/address/${walletAddress}${network === 'devnet' ? '?cluster=devnet' : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={14} color="var(--solana-cyan)" />
                <span>View on Solana Explorer</span>
              </div>
            </a>

            {/* Devnet 1 SOL Faucet / Airdrop */}
            {network === 'devnet' && (
              <button
                onClick={handleAirdrop}
                disabled={isAirdropping}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  color: 'var(--solana-green)',
                  background: 'rgba(20, 241, 149, 0.08)',
                  border: '1px solid rgba(20, 241, 149, 0.2)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Coins size={14} />
                  <span>{isAirdropping ? 'Requesting SOL...' : 'Request 1 Devnet SOL'}</span>
                </div>
                <RefreshCw size={12} className={isAirdropping ? 'animate-spin' : ''} />
              </button>
            )}

            {/* Disconnect */}
            <button
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.06)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              <LogOut size={14} />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
