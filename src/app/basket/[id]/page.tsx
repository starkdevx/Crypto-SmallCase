import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { STOCK_BASKETS, getBasket } from '../../../data/baskets';
import { BasketDetailPageClient } from '../../../components/BasketDetailPageClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const params: { id: string }[] = [];
  STOCK_BASKETS.forEach((b) => {
    params.push({ id: b.id });
    if (b.slug && b.slug !== b.id) {
      params.push({ id: b.slug });
    }
  });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const basket = getBasket(id);

  if (!basket) {
    return {
      title: 'Basket Not Found | xCase',
    };
  }

  return {
    title: `${basket.title} (${basket.category}) | xCase`,
    description: basket.description || basket.tagline,
    openGraph: {
      title: `${basket.title} - Tokenized Stock Basket on Solana`,
      description: basket.description,
    },
  };
}

export default async function BasketPage({ params }: Props) {
  const { id } = await params;
  const basket = getBasket(id);

  if (!basket) {
    notFound();
  }

  return <BasketDetailPageClient basket={basket} />;
}
