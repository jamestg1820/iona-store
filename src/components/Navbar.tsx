"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, MapPin, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const { openCart, items } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { name: 'MORRALES', href: '/coleccion/morrales' },
    { name: 'MUJER', href: '/coleccion/mujer' },
    { name: 'HOMBRE', href: '/coleccion/hombre' },
    { name: 'CARTERAS', href: '/coleccion/carteras' },
    { name: 'VIAJE', href: '/coleccion/viaje' },
    { name: 'BOLSOS', href: '/coleccion/bolsos' }
  ];

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
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-800 md:hidden p-1">
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

      {/* Main Navigation (Bottom Row - Desktop) */}
      <nav className="hidden md:flex justify-center space-x-8 pb-4">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className="text-[11px] font-black tracking-widest text-gray-900 hover:text-[#e4d2ef] transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Menu */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#e4d2ef]/10">
              <span className="font-heading text-2xl tracking-[0.05em] uppercase">Menú</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600 hover:text-black">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col py-6 px-6 space-y-6">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] font-black tracking-widest text-gray-900 hover:text-[#e4d2ef] transition-colors">
                INICIO
              </Link>
              
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] font-black tracking-widest text-gray-900 hover:text-[#e4d2ef] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-6 mt-2 border-t border-gray-100">
                <Link 
                  href="https://wa.me/573163516844" 
                  target="_blank"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-[13px] font-black tracking-widest text-[#25D366] hover:opacity-80 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  <span>CONTACTO (WhatsApp)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
