import type { Metadata } from 'next';
import MatrixPortfolio from '@/components/MatrixPortfolio';

export const metadata: Metadata = {
  title: 'Zizhen Liu — Matrix Portfolio',
};

export default function MatrixPage() {
  return <MatrixPortfolio />;
}
