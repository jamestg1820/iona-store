import Accordion from "@/components/Accordion";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import AddToCart from "@/components/AddToCart";
import StickyAddToCart from "@/components/StickyAddToCart";
import { getProductByHandle, getProducts } from "@/lib/shopify";
import { Star } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  const recommendedProducts = await getProducts();

  if (!product) {
    return notFound();
  }

  // Obtenemos el precio de la primera variante por defecto
  const defaultVariant = product.variants[0];
  const price = defaultVariant.price;
  const compareAtPrice = defaultVariant.compareAtPrice;
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      {/* Breadcrumbs Estilo Totto */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider overflow-x-auto scrollbar-hide">
          <Link href="/" className="bg-gray-100 px-3 py-1.5 rounded text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0">
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          <Link href="/coleccion/nueva-coleccion" className="bg-gray-100 px-3 py-1.5 rounded text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0">
            Nueva Colección
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded text-black flex-shrink-0 truncate max-w-[150px]">
            {product.title}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2">
        {/* Título, SKU y Garantía - SOLO MÓVIL (Visible hasta md) */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{product.title}</h1>
          <div className="text-[10px] text-gray-400 font-medium mb-3 tracking-wider">
            {product.variants[0]?.sku || 'REF: N/A'}
          </div>
          <div className="flex items-center gap-2 text-[#4CAF50]">
            <div className="w-4 h-4 rounded-full border-2 border-[#4CAF50] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-2 h-2 fill-current">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wide">Producto garantizado</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Columna Izquierda - Galería de Imágenes */}
          <div className="w-full md:w-3/5">
            <ImageCarousel images={product.images} />
          </div>

          {/* Columna Derecha - Información del Producto */}
          <div className="w-full md:w-2/5 md:sticky md:top-24 self-start">
            <div className="mb-6">
              {/* Título, SKU y Garantía - SOLO DESKTOP (Oculto en móvil) */}
              <div className="hidden md:block">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">{product.title}</h1>
                <div className="text-xs text-gray-400 font-medium mb-4 tracking-wider">
                  {product.variants[0]?.sku || 'REF: N/A'}
                </div>
                <div className="flex items-center gap-2 text-[#4CAF50] mb-6">
                  <div className="w-5 h-5 rounded-full border-2 border-[#4CAF50] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide">Producto garantizado</span>
                </div>
              </div>
              
              {/* Reseñas */}
              <div className="flex items-center space-x-1 mb-6">
                <div className="flex text-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-400 ml-2">0 Reseñas</span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 text-2xl">
                  {hasDiscount && (
                    <span className="text-gray-400 line-through font-light">${compareAtPrice.toLocaleString('es-CO')}</span>
                  )}
                  <span className={`font-black ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                    ${price.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              {/* Mención de Envío y Pago */}
              <div className="flex items-center gap-2 mt-2 mb-4 text-gray-500">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                  <path d="M10 17h4V5H2v12h3m0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM17 17h-3v-5h9v5h-2m-5-5L17 5h5v7" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Envío gratis, pago contra entrega
                </span>
              </div>
            </div>

            <div className="mt-4">
              <AddToCart product={product} />
            </div>

            {/* Acordeones */}
            <div className="border-t border-gray-200">
              <Accordion title="Descripción" defaultOpen={true}>
                <div className="shopify-description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              </Accordion>
              
              <Accordion title="Envíos y Devoluciones">
                <p><strong>Envío Gratis:</strong> En compras superiores a $150.000 a nivel nacional.</p>
                <p className="mt-2"><strong>Devoluciones:</strong> Si realizaste una compra en Colombia, puedes solicitar el cambio de tu(s) artículo(s) dentro de los siguientes 30 días calendario posteriores a la entrega.</p>
              </Accordion>
              
              <Accordion title="Medios de Pago">
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Tarjetas de Crédito (Visa, MasterCard, Amex)</li>
                  <li>PSE (Débito bancario)</li>
                  <li>Addi (Paga a cuotas)</li>
                  <li>Pago contra entrega en ciudades principales</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Sección "Esto te va a encantar" */}
      <div className="mt-12 bg-gray-50/50 py-12">
        <ProductCarousel title="ESTO TE VA A ENCANTAR" products={recommendedProducts} />
      </div>

      <StickyAddToCart price={price} />
    </div>
  );
}
