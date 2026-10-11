import { NextRequest, NextResponse } from 'next/server';
import { getBasketChartData } from '@/lib/chartService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const basketId = searchParams.get('basketId');

  if (!basketId) {
    return NextResponse.json({ error: 'Missing basketId parameter' }, { status: 400 });
  }

  try {
    const data = await getBasketChartData(basketId);
    if (!data) {
      return NextResponse.json({ error: 'Basket not found' }, { status: 404 });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching basket chart data:', error);
    return NextResponse.json({ error: 'Failed to load chart data' }, { status: 500 });
  }
}
