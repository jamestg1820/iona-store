"use client";

import { useState, useEffect } from "react";

interface StickyAddToCartProps {
  price: number;
}

export default function StickyAddToCart({ price }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainButton = document.querySelector('[data-add-to-cart]');
      if (mainButton) {
        const rect = mainButton.getBoundingClientRect();
        // Mostrar la barra si el botón principal está fuera de la pantalla (arriba)
        setIsVisible(rect.top < 0);
      } else {
        // Fallback si no encuentra el botón
        setIsVisible(window.scrollY > 600);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStickyClick = () => {
    const btn = document.querySelector('[data-add-to-cart]') as HTMLButtonElement;
    if (btn) {
      btn.click();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 md:hidden flex items-center justify-between shadow-[0_-15px_40px_-10px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total</span>
          <span className="text-lg font-black text-black">${price.toLocaleString('es-CO')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2">
            <path d="M10 17h4V5H2v12h3m0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM17 17h-3v-5h9v5h-2m-5-5L17 5h5v7" />
          </svg>
          <span className="text-[8px] font-bold uppercase tracking-wider">Envío gratis, pago contra entrega</span>
        </div>
      </div>
      <button 
        onClick={handleStickyClick}
        className="bg-[#e4d2ef] text-gray-800 px-8 py-3 rounded-full font-black text-xs tracking-widest shadow-lg shadow-[#e4d2ef]/20 active:scale-95 transition-all"
      >
        AGREGAR
      </button>
    </div>
  );
}
