'use client';

import { useEffect } from 'react';

interface MetaProductViewProps {
  product: {
    id: string;
    title: string;
    price: number;
  };
}

export default function MetaProductView({ product }: MetaProductViewProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.title,
        content_type: 'product',
        value: product.price,
        currency: 'COP'
      });
    }
  }, [product.id, product.title, product.price]);

  return null; // Este componente no renderiza nada, solo rastrea
}
