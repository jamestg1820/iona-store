"use client";

import Link from 'next/link';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { UIProduct } from '@/types/shopify';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';

const mockProducts: UIProduct[] = [
  { id: '1', handle: 'morral-universitario', name: 'Morral Universitario Expandible', price: 129900, originalPrice: 159900, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80', badge: 'NUEVO' },
  { id: '2', handle: 'maleta-viaje-20', name: 'Maleta de Viaje 20" Cabina', price: 259900, originalPrice: undefined, image: 'https://images.unsplash.com/photo-1552858725-2758b5fb1286?auto=format&fit=crop&w=400&q=80', badge: undefined },
  { id: '3', handle: 'chaqueta-impermeable', name: 'Chaqueta Impermeable Hombre', price: 189900, originalPrice: undefined, image: 'https://images.unsplash.com/photo-1551028719-01c1eb562a45?auto=format&fit=crop&w=400&q=80', badge: 'MÁS VENDIDO' },
  { id: '4', handle: 'morral-infantil-mickey', name: 'Morral Infantil Mickey Mouse', price: 109900, originalPrice: 129900, image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=400&q=80', badge: '-15%' },
];

export default function ProductCarousel({ title, products = mockProducts }: { title: string, products?: UIProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Duplicamos los productos para crear el efecto de "loop" infinito visualmente
  const displayProducts = [...products, ...products, ...products];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 300;
      const scrollAmount = direction === 'left' ? -(itemWidth + 24) : (itemWidth + 24); // 24 es el gap
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // Si llegamos casi al final del scroll, regresamos silenciosamente al inicio (o suavemente)
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: UIProduct) => {
    e.preventDefault(); // Prevenir que navegue a la página del producto
    
    // Normalizar el producto para el carrito
    const cartProduct = {
      id: product.id,
      handle: product.handle || '',
      name: product.name,
      price: product.price,
      image: product.image,
      variantId: product.variantId
    };

    addItem(cartProduct, 1);
    toast.success(`${cartProduct.name} agregado al carrito`, {
      description: "¡Excelente elección!",
    });
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-white relative"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative group/section">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-heading tracking-tight text-gray-900 uppercase">
            {title}
          </h2>
        </div>
        
        {/* Contenedor relativo para posicionar las flechas */}
        <div className="relative">
          {/* Flecha Izquierda */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-4 md:-left-6 top-[40%] -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-10 hidden md:flex text-gray-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Flecha Derecha */}
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-4 md:-right-6 top-[40%] -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-10 hidden md:flex text-gray-800"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-8 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
          {displayProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="min-w-[280px] w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start bg-white border border-gray-100 rounded-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group/card flex flex-col relative">
              <Link href={`/producto/${product.handle}`} className="flex flex-col h-full">
                <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-[#e4d2ef] text-gray-800 text-[10px] font-bold px-2.5 py-1 z-10 tracking-wider">
                      {product.badge}
                    </div>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${product.secondImage ? 'group-hover/card:opacity-0' : 'group-hover/card:scale-105'}`}
                  />
                  {product.secondImage && (
                    <img 
                      src={product.secondImage} 
                      alt={`${product.name} alternate`} 
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 ease-in-out"
                    />
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 group-hover/card:text-[#e4d2ef] transition-colors mb-2 line-clamp-2 min-h-[48px]">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-3 mt-3">
                    <span className="font-black text-xl text-gray-900">${Number(product.price).toLocaleString('es-CO')}</span>
                    {product.originalPrice && (
                      <span className="text-sm font-medium text-gray-400 line-through">${Number(product.originalPrice).toLocaleString('es-CO')}</span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Contenedor del botón que calza exactamente con el área de la imagen */}
              <div className="absolute top-0 left-0 right-0 aspect-[4/5] pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-[120%] group-hover/card:translate-y-0 transition-transform duration-300 ease-in-out z-20 pointer-events-auto">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(e, product);
                    }}
                    className="w-full bg-[#e4d2ef] text-gray-800 py-3 rounded font-bold hover:bg-black hover:text-white transition-colors flex items-center justify-center shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    AGREGAR AL CARRITO
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
