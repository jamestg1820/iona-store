"use client";

import Link from 'next/link';
import { Search, ShoppingCart, User, MapPin, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const { openCart, items } = useCartStore();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-[#e4d2ef] text-gray-800 text-[10px] py-2 text-center font-bold tracking-[0.1em] uppercase">
        ENVIOS GRATIS PAGO CONTRA ENTREGA
      </div>
      
      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu & Desktop Search */}
          <div className="flex-1 flex items-center">
            <button className="text-gray-800 md:hidden p-1">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center w-full max-w-sm group">
              <input 
                type="text" 
                placeholder="¿Qué estás buscando?" 
                className="w-full border-b border-gray-300 py-1.5 pl-8 text-sm focus:outline-none focus:border-black transition-colors bg-transparent font-medium"
              />
              <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-gray-800" />
            </div>
          </div>

          {/* Logo (Center) */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link href="/" className="group flex flex-col items-center">
              <span id="logo-iona" className="text-3xl md:text-5xl font-heading text-black tracking-[0.05em] leading-none uppercase">
                IONA
              </span>
              <div className="w-full h-[3px] bg-black mt-1 group-hover:bg-[#e4d2ef] transition-colors"></div>
            </Link>
          </div>

          {/* Icons (Right) */}
          <div className="flex-1 flex items-center justify-end space-x-5 md:space-x-8">
            <button className="text-gray-900 hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-[1.5]">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button 
              onClick={openCart}
              className="text-gray-900 hover:opacity-70 transition-opacity relative"
            >
              {/* Custom Backpack-style Cart Icon */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-[1.5]">
                <path d="M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <path d="M12 12v4" />
                <path d="M9 14h6" />
              </svg>
              <span className="absolute -top-1 -right-1.5 bg-black text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Exact Totto Style) */}
        <div className="mt-4 md:hidden px-1">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="¿Qué estás buscando?" 
              className="w-full border border-gray-300 rounded-[4px] py-2 pl-3 pr-10 text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-all bg-white"
            />
            <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-black" />
          </div>
        </div>
      </div>

      {/* Main Navigation (Bottom Row) */}
      <nav className="hidden md:flex justify-center space-x-8 pb-4">
        {['DESCUBRE', 'MORRALES', 'MUJER', 'HOMBRE', 'NIÑA', 'NIÑO', 'VIAJE', 'MASCOTAS', 'PERSONAJES', 'ACCESORIOS'].map((item) => (
          <Link 
            key={item} 
            href={`/coleccion/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} 
            className="text-[11px] font-black tracking-widest text-gray-900 hover:text-[#e4d2ef] transition-colors"
          >
            {item}
          </Link>
        ))}
      </nav>
    </header>
  );
}
