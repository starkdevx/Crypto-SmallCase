import { NextResponse } from 'next/server';
import snapshotData from '@/data/xstocks-snapshot.json';

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=xstocks-ecosystem',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Stocklana-App/1.0',
        },
        next: { revalidate: 86400 }, // 24-hour daily cache
      }
    );

    if (!res.ok) {
      console.warn(`CoinGecko API returned status ${res.status}, using cached snapshot.`);
      return NextResponse.json(snapshotData, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        },
      });
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(snapshotData);
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.warn('CoinGecko fetch failed, returning snapshot fallback:', error);
    return NextResponse.json(snapshotData);
  }
}
