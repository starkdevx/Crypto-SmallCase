'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

export type SolanaNetwork = 'devnet' | 'mainnet-beta';

export interface WalletInfo {
  id: 'phantom' | 'solflare' | 'backpack' | 'injected';
  name: string;
  icon: string;
  isInstalled: boolean;
  installUrl: string;
}

export interface SolanaWalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  walletAddress: string | null;
  walletName: string | null;
  balance: number | null;
  network: SolanaNetwork;
  setNetwork: (network: SolanaNetwork) => void;
  availableWallets: WalletInfo[];
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  connect: (walletId?: 'phantom' | 'solflare' | 'backpack' | 'injected') => Promise<boolean>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  requestAirdrop: () => Promise<string | null>;
  executeTransaction: (params: {
    recipientAddress?: string;
    amountSol?: number;
    memoText?: string;
  }) => Promise<{ signature: string; explorerUrl: string }>;
}

const SolanaWalletContext = createContext<SolanaWalletContextType | null>(null);

export function useSolanaWallet() {
  const context = useContext(SolanaWalletContext);
  if (!context) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider');
  }
  return context;
}

// Helpers to get specific provider from window
function getProvider(walletId: string) {
  if (typeof window === 'undefined') return null;
  const anyWindow = window as any;

  if (walletId === 'phantom') {
    if (anyWindow.phantom?.solana?.isPhantom) return anyWindow.phantom.solana;
    if (anyWindow.solana?.isPhantom) return anyWindow.solana;
    return null;
  }

  if (walletId === 'solflare') {
    if (anyWindow.solflare?.isSolflare) return anyWindow.solflare;
    return null;
  }

  if (walletId === 'backpack') {
    if (anyWindow.backpack?.isBackpack) return anyWindow.backpack;
    return null;
  }

  // Fallback: any standard Solana provider
  return anyWindow.solana || anyWindow.phantom?.solana || anyWindow.solflare || anyWindow.backpack || null;
}

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [activeWalletId, setActiveWalletId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  // Solana RPC Connection
  const connection = useMemo(() => {
    const endpoint = network === 'devnet' 
      ? 'https://api.devnet.solana.com' 
      : clusterApiUrl('mainnet-beta');
    return new Connection(endpoint, 'confirmed');
  }, [network]);

  // Detected wallets
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([
    {
      id: 'phantom',
      name: 'Phantom',
      icon: 'https://phantom.app/favicon.ico',
      isInstalled: false,
      installUrl: 'https://phantom.app/download',
    },
    {
      id: 'solflare',
      name: 'Solflare',
      icon: 'https://solflare.com/favicon.ico',
      isInstalled: false,
      installUrl: 'https://solflare.com/download',
    },
    {
      id: 'backpack',
      name: 'Backpack',
      icon: 'https://backpack.app/favicon.ico',
      isInstalled: false,
      installUrl: 'https://backpack.app/download',
    },
    {
      id: 'injected',
      name: 'Browser Wallet',
      icon: 'https://solana.com/favicon.ico',
      isInstalled: false,
      installUrl: 'https://phantom.app/download',
    },
  ]);

  // Check which wallets are installed in browser
  const detectWallets = useCallback(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;
    setAvailableWallets([
      {
        id: 'phantom',
        name: 'Phantom',
        icon: 'https://phantom.app/favicon.ico',
        isInstalled: !!(w.phantom?.solana?.isPhantom || w.solana?.isPhantom),
        installUrl: 'https://phantom.app/download',
      },
      {
        id: 'solflare',
        name: 'Solflare',
        icon: 'https://solflare.com/favicon.ico',
        isInstalled: !!w.solflare?.isSolflare,
        installUrl: 'https://solflare.com/download',
      },
      {
        id: 'backpack',
        name: 'Backpack',
        icon: 'https://backpack.app/favicon.ico',
        isInstalled: !!w.backpack?.isBackpack,
        installUrl: 'https://backpack.app/download',
      },
      {
        id: 'injected',
        name: 'Injected Solana',
        icon: 'https://solana.com/favicon.ico',
        isInstalled: !!w.solana,
        installUrl: 'https://phantom.app/download',
      },
    ]);
  }, []);

  // Fetch balance from RPC
  const refreshBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    try {
      const lamports = await connection.getBalance(publicKey, 'confirmed');
      setBalance(Number((lamports / LAMPORTS_PER_SOL).toFixed(4)));
    } catch (err) {
      console.warn('Failed to fetch SOL balance:', err);
    }
  }, [publicKey, connection]);

  // Request devnet airdrop for user testing
  const requestAirdrop = useCallback(async (): Promise<string | null> => {
    if (!publicKey || network !== 'devnet') return null;
    try {
      const airdropSig = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(airdropSig, 'confirmed');
      await refreshBalance();
      return airdropSig;
    } catch (err: any) {
      console.error('Airdrop failed:', err);
      alert('Devnet airdrop rate limit reached. Please use https://faucet.solana.com with your address: ' + publicKey.toBase58());
      return null;
    }
  }, [publicKey, network, connection, refreshBalance]);

  // Connect wallet
  const connect = useCallback(async (walletId?: 'phantom' | 'solflare' | 'backpack' | 'injected'): Promise<boolean> => {
    setConnecting(true);
    detectWallets();

    // Default to phantom or first installed wallet
    const targetId = walletId || (
      (window as any)?.phantom?.solana ? 'phantom' :
      (window as any)?.solflare ? 'solflare' :
      (window as any)?.backpack ? 'backpack' :
      (window as any)?.solana ? 'injected' : 'phantom'
    );

    const provider = getProvider(targetId);

    if (!provider) {
      setConnecting(false);
      setIsWalletModalOpen(true);
      return false;
    }

    try {
      // Standard connect call
      const resp = await provider.connect();
      const pubkey = resp?.publicKey || provider.publicKey;

      if (pubkey) {
        const pk = new PublicKey(pubkey.toString());
        setPublicKey(pk);
        setConnected(true);
        setActiveWalletId(targetId);
        const nameMap: Record<string, string> = {
          phantom: 'Phantom',
          solflare: 'Solflare',
          backpack: 'Backpack',
          injected: 'Solana Wallet',
        };
        setWalletName(nameMap[targetId] || 'Solana Wallet');
        setIsWalletModalOpen(false);
        try {
          localStorage.setItem('xcase_wallet_connected', targetId);
        } catch (_) {}
        setConnecting(false);
        return true;
      }
    } catch (err: any) {
      console.warn('Wallet connection cancelled or failed:', err);
    }

    setConnecting(false);
    return false;
  }, [detectWallets]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (activeWalletId) {
      const provider = getProvider(activeWalletId);
      if (provider?.disconnect) {
        try {
          await provider.disconnect();
        } catch (_) {}
      }
    }
    setConnected(false);
    setPublicKey(null);
    setBalance(null);
    setWalletName(null);
    setActiveWalletId(null);
    try {
      localStorage.removeItem('xcase_wallet_connected');
    } catch (_) {}
  }, [activeWalletId]);

  // Execute real on-chain transaction
  const executeTransaction = useCallback(async (params: {
    recipientAddress?: string;
    amountSol?: number;
    memoText?: string;
  }): Promise<{ signature: string; explorerUrl: string }> => {
    if (!publicKey || !connected || !activeWalletId) {
      throw new Error('Please connect your Solana wallet first');
    }

    const provider = getProvider(activeWalletId);
    if (!provider) {
      throw new Error('Wallet provider disconnected');
    }

    // Default treasury recipient (Stocklana/xCase devnet recipient)
    const recipientKey = params.recipientAddress 
      ? new PublicKey(params.recipientAddress) 
      : publicKey; // fallback to self-transfer or fee recipient

    // Convert amount to lamports (default nominal 0.001 SOL for test devnet transaction)
    const lamports = params.amountSol 
      ? Math.round(params.amountSol * LAMPORTS_PER_SOL) 
      : 1000; // 0.000001 SOL

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: publicKey,
    });

    // Add transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientKey,
        lamports,
      })
    );

    // Request wallet to sign and broadcast
    let signature: string;
    if (provider.signAndSendTransaction) {
      const res = await provider.signAndSendTransaction(transaction);
      signature = res.signature || res;
    } else if (provider.signTransaction) {
      const signedTx = await provider.signTransaction(transaction);
      signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
    } else {
      throw new Error('Wallet does not support transaction signing');
    }

    // Confirm transaction on Solana RPC
    await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      'confirmed'
    );

    // Refresh balance after transaction
    await refreshBalance();

    const clusterQuery = network === 'devnet' ? '?cluster=devnet' : '';
    const explorerUrl = `https://explorer.solana.com/tx/${signature}${clusterQuery}`;

    return {
      signature,
      explorerUrl,
    };
  }, [publicKey, connected, activeWalletId, connection, network, refreshBalance]);

  // Check for auto-connect on load
  useEffect(() => {
    detectWallets();

    const savedWallet = typeof window !== 'undefined' ? localStorage.getItem('xcase_wallet_connected') : null;
    if (savedWallet) {
      const provider = getProvider(savedWallet);
      if (provider) {
        provider.connect({ onlyIfTrusted: true })
          .then((resp: any) => {
            const pubkey = resp?.publicKey || provider.publicKey;
            if (pubkey) {
              setPublicKey(new PublicKey(pubkey.toString()));
              setConnected(true);
              setActiveWalletId(savedWallet);
              const nameMap: Record<string, string> = {
                phantom: 'Phantom',
                solflare: 'Solflare',
                backpack: 'Backpack',
                injected: 'Solana Wallet',
              };
              setWalletName(nameMap[savedWallet] || 'Solana Wallet');
            }
          })
          .catch(() => {
            // User has not trusted or disconnected, ignore
          });
      }
    }

    // Check on window load for delayed wallet injections (e.g. Phantom / Solflare extensions)
    const timer = setTimeout(() => {
      detectWallets();
    }, 1000);
    return () => clearTimeout(timer);
  }, [detectWallets]);

  // Listen for account change / disconnect on active provider
  useEffect(() => {
    if (!activeWalletId) return;
    const provider = getProvider(activeWalletId);
    if (!provider?.on) return;

    const handleDisconnect = () => {
      setConnected(false);
      setPublicKey(null);
      setBalance(null);
    };

    const handleAccountChange = (newPubkey: any) => {
      if (newPubkey) {
        setPublicKey(new PublicKey(newPubkey.toString()));
      } else {
        handleDisconnect();
      }
    };

    provider.on('disconnect', handleDisconnect);
    provider.on('accountChanged', handleAccountChange);

    return () => {
      if (provider.removeListener) {
        provider.removeListener('disconnect', handleDisconnect);
        provider.removeListener('accountChanged', handleAccountChange);
      }
    };
  }, [activeWalletId]);

  // Update balance when publicKey or network changes
  useEffect(() => {
    if (publicKey) {
      refreshBalance();
      const interval = setInterval(refreshBalance, 15000); // 15s poll
      return () => clearInterval(interval);
    }
  }, [publicKey, refreshBalance]);

  const value: SolanaWalletContextType = {
    connected,
    connecting,
    publicKey,
    walletAddress: publicKey ? publicKey.toBase58() : null,
    walletName,
    balance,
    network,
    setNetwork,
    availableWallets,
    isWalletModalOpen,
    setIsWalletModalOpen,
    connect,
    disconnect,
    refreshBalance,
    requestAirdrop,
    executeTransaction,
  };

  return (
    <SolanaWalletContext.Provider value={value}>
      {children}
    </SolanaWalletContext.Provider>
  );
}
