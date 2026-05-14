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
import ProductReviews from "@/components/ProductReviews";
import MetaProductView from "@/components/MetaProductView";
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
      <MetaProductView product={{ id: product.id, title: product.title, price: price }} />
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
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Columna Izquierda - Galería de Imágenes */}
          <div className="w-full md:w-3/5">
            <ImageCarousel images={product.images} />
          </div>

          {/* Columna Derecha - Información del Producto */}
          <div className="w-full md:w-2/5 md:sticky md:top-24 self-start">
            <AddToCart product={product} />

            <ProductReviews productHandle={product.handle} />

            {/* Botón Ver Catálogo */}
            <div className="mt-8">
              <Link 
                href="/coleccion/Catalogo" 
                className="block w-full bg-black text-white text-center py-4 rounded-full font-bold hover:bg-[#e4d2ef] hover:text-gray-800 transition-all uppercase tracking-widest text-xs shadow-lg"
              >
                Ver catálogo
              </Link>
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
