'use client';

import React, { useState } from 'react';
import { Basket } from '../types/basket';
import { useSolanaWallet } from '../context/SolanaWalletContext';
import {
  X,
  Wallet,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface BasketBuyModalProps {
  basket: Basket | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BasketBuyModal({ basket, isOpen, onClose }: BasketBuyModalProps) {
  const {
    connected,
    publicKey,
    walletAddress,
    balance,
    network,
    setIsWalletModalOpen,
    executeTransaction,
  } = useSolanaWallet();

  const [depositAmountUsdc, setDepositAmountUsdc] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [txStep, setTxStep] = useState<'idle' | 'building' | 'awaiting_signature' | 'confirming' | 'success' | 'error'>('idle');
  const [txResult, setTxResult] = useState<{ signature: string; explorerUrl: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !basket) return null;

  const minAmount = basket.minInvestmentUsdc || 25;
  const basketUnits = Number((depositAmountUsdc / basket.nav).toFixed(4));

  const handleBuy = async () => {
    if (!connected) {
      setIsWalletModalOpen(true);
      return;
    }

    if (depositAmountUsdc < minAmount) {
      alert(`Minimum investment for this basket is $${minAmount} USDC`);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setTxStep('building');

      // Small delay for UI clarity
      await new Promise((r) => setTimeout(r, 400));
      setTxStep('awaiting_signature');

      // Execute real Solana transaction (nominal SOL transfer / transaction to verify and record on-chain)
      const res = await executeTransaction({
        amountSol: 0.001, // 0.001 SOL nominal devnet testing transfer
        memoText: `xCase:${basket.id}:${depositAmountUsdc}USDC`,
      });

      setTxStep('confirming');
      await new Promise((r) => setTimeout(r, 600));

      setTxResult(res);
      setTxStep('success');
    } catch (err: any) {
      console.error('Transaction execution error:', err);
      setErrorMessage(err?.message || 'Transaction was rejected or failed on Solana');
      setTxStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTxStep('idle');
    setTxResult(null);
    setErrorMessage(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'rgba(3, 5, 10, 0.85)',
      backdropFilter: 'blur(16px)',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        background: 'linear-gradient(145deg, rgba(16, 22, 38, 0.96) 0%, rgba(9, 13, 24, 0.98) 100%)',
        border: '1px solid rgba(20, 241, 149, 0.3)',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(20, 241, 149, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Close Button */}
        <button
          onClick={() => {
            handleReset();
            onClose();
          }}
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
            <span>SOLANA ONCHAIN 1-CLICK ORDER</span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Buy {basket.title}
          </h2>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Basket NAV: <strong style={{ color: '#ffffff' }}>${basket.nav} USDC</strong> • Min Investment: <strong style={{ color: 'var(--solana-green)' }}>${minAmount} USDC</strong>
          </div>
        </div>

        {/* State: SUCCESS */}
        {txStep === 'success' && txResult ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(20, 241, 149, 0.15)',
              border: '2px solid var(--solana-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--solana-green)',
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Transaction Confirmed on Solana!
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Successfully purchased <strong style={{ color: '#ffffff' }}>{basketUnits} units</strong> of {basket.title} on Solana {network.toUpperCase()}.
            </p>

            {/* Signature Box */}
            <div style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
              fontSize: '0.76rem',
              textAlign: 'left',
            }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                Transaction Signature:
              </div>
              <div style={{ fontFamily: 'monospace', color: 'var(--solana-cyan)', wordBreak: 'break-all' }}>
                {txResult.signature}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <a
                href={txResult.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--solana-purple) 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <span>View on Solana Explorer</span>
                <ExternalLink size={14} />
              </a>

              <button
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* State: INPUT & EXECUTION FLOW */
          <div>
            {/* Amount Input */}
            <div style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Investment Amount
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--solana-green)', fontWeight: 600 }}>
                  Est. {basketUnits} Units
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-secondary)' }}>$</span>
                <input
                  type="number"
                  min={minAmount}
                  step={25}
                  value={depositAmountUsdc}
                  onChange={(e) => setDepositAmountUsdc(Number(e.target.value) || 0)}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    outline: 'none',
                  }}
                />
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#cbd5e1',
                }}>
                  USDC
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                {[50, 100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDepositAmountUsdc(amt)}
                    disabled={isSubmitting}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      background: depositAmountUsdc === amt ? 'rgba(20, 241, 149, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: depositAmountUsdc === amt ? 'var(--solana-green)' : 'var(--text-secondary)',
                      border: depositAmountUsdc === amt ? '1px solid var(--solana-green)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Constituents Allocation Preview */}
            <div style={{
              padding: '14px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>
                Constituent Share Allocation Breakdown ({basket.constituents.length} Assets):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                {basket.constituents.map((item) => {
                  const allocUsd = ((depositAmountUsdc * item.weight) / 100).toFixed(2);
                  return (
                    <div
                      key={item.stock.ticker}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#ffffff' }}>{item.stock.ticker}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({item.weight}%)</span>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--solana-green)' }}>
                        ${allocUsd} USDC
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {txStep === 'error' && (
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: '0.78rem',
                marginBottom: '16px',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage || 'Transaction could not be completed.'}</span>
              </div>
            )}

            {/* Connected Wallet Info or Connect Prompt */}
            {!connected ? (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--solana-purple) 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.94rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <Wallet size={18} />
                <span>Connect Solana Wallet to Buy</span>
              </button>
            ) : (
              <div>
                <button
                  onClick={handleBuy}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: isSubmitting
                      ? 'rgba(20, 241, 149, 0.4)'
                      : 'linear-gradient(135deg, var(--solana-green) 0%, #059669 100%)',
                    color: '#07090e',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    border: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>
                        {txStep === 'building' && 'Preparing Transaction...'}
                        {txStep === 'awaiting_signature' && 'Awaiting Wallet Signature...'}
                        {txStep === 'confirming' && 'Broadcasting to Solana...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Sign on Solana</span>
                      <ArrowUpRight size={18} />
                    </>
                  )}
                </button>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                }}>
                  <span>Wallet: <strong style={{ color: '#ffffff' }}>{walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}</strong></span>
                  <span>Balance: <strong style={{ color: 'var(--solana-green)' }}>{balance !== null ? `${balance} SOL` : '0 SOL'}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
