import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SolanaWalletProvider } from '../context/SolanaWalletContext';
import { WalletModal } from '../components/WalletModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'xCase — Tokenized Stock Baskets on Solana',
  description:
    'Invest in thematic baskets of tokenized US equities and pre-IPO technology giants (SpaceX, OpenAI, Nvidia) on Solana. Real-time NAV, Pyth price feeds, and social copy-investing.',
  keywords: [
    'xCase',
    'Crypto Smallcase',
    'Solana',
    'Stock Baskets',
    'Tokenized Equities',
    'Pre-IPO Stocks',
    'Smallcase for Crypto',
    'Pyth Network',
    'PreStocks',
    'Tessera',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SolanaWalletProvider>
          {children}
          <WalletModal />
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
