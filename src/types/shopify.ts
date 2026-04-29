export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  featuredImage: ShopifyImage;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
}

// Interfaz para adaptar los productos de Shopify a nuestros componentes de UI
export interface UIProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  secondImage?: string;
  badge?: string;
  handle: string;
  variantId?: string;
}

export function mapShopifyToUIProduct(product: ShopifyProduct): UIProduct {
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  let originalPrice = undefined;
  
  if (product.compareAtPriceRange?.minVariantPrice?.amount) {
    originalPrice = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
  }

  let badge = undefined;
  if (product.tags.includes('NUEVO')) badge = 'NUEVO';
  else if (product.tags.includes('MÁS VENDIDO')) badge = 'MÁS VENDIDO';
  else if (originalPrice && originalPrice > price) badge = 'OFERTA';

  return {
    id: product.id,
    handle: product.handle,
    name: product.title,
    price,
    originalPrice,
    image: product.featuredImage?.url || '',
    badge,
  };
}
