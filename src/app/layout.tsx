import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Stocklana (Stonkcase) — Tokenized Stock Baskets on Solana',
  description:
    'Invest in thematic baskets of tokenized US equities and pre-IPO technology giants (SpaceX, OpenAI, Nvidia) on Solana. Real-time NAV, Pyth price feeds, and social copy-investing.',
  keywords: [
    'Solana',
    'Stock Baskets',
    'Tokenized Equities',
    'Pre-IPO Stocks',
    'Smallcase for Solana',
    'Pyth Network',
    'PreStocks',
    'Tessera',
    'Stonkcase',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
