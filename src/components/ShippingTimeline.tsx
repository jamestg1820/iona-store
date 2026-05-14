"use client";

import { useEffect, useState } from "react";

export default function ShippingTimeline() {
  const [dates, setDates] = useState({
    compra: "",
    despacho: "",
    entrega: ""
  });

  useEffect(() => {
    const now = new Date();
    
    // 1. Compra
    const compraDate = new Date(now);
    
    // 2. Despachamos (si es antes de las 15:00 hoy, sino mañana)
    const despachoDate = new Date(now);
    if (now.getHours() >= 15) {
      despachoDate.setDate(despachoDate.getDate() + 1);
    }
    
    // 3. Entrega (2 días después del despacho)
    const entregaDate = new Date(despachoDate);
    entregaDate.setDate(entregaDate.getDate() + 2);
    
    // Si la entrega cae en fin de semana, se mueve al lunes
    if (entregaDate.getDay() === 6) {
      // Es sábado, mover 2 días al lunes
      entregaDate.setDate(entregaDate.getDate() + 2);
    } else if (entregaDate.getDay() === 0) {
      // Es domingo, mover 1 día al lunes
      entregaDate.setDate(entregaDate.getDate() + 1);
    }

    const formatDate = (d: Date) => {
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear().toString().slice(-2);
      return `${day}/${month}/${year}`;
    };

    setDates({
      compra: formatDate(compraDate),
      despacho: formatDate(despachoDate),
      entrega: formatDate(entregaDate)
    });
  }, []);

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <div className="flex items-start justify-between relative w-full">
        {/* Línea conectora central */}
        <div className="absolute top-6 left-[16.6%] right-[16.6%] h-[2px] bg-black -z-10"></div>
        
        {/* Paso 1: Compra */}
        <div className="flex flex-col items-center w-1/3">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white z-10">
            {/* Ícono de Carrito con + */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 6h2m-1-1v2" />
            </svg>
          </div>
          <span className="font-bold text-sm mt-3">{dates.compra || "..."}</span>
          <span className="text-sm text-gray-800">Compra</span>
        </div>

        {/* Paso 2: Despachamos */}
        <div className="flex flex-col items-center w-1/3">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white z-10">
            {/* Ícono de Camión */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <span className="font-bold text-sm mt-3">{dates.despacho || "..."}</span>
          <span className="text-sm text-gray-800">Despachamos</span>
        </div>

        {/* Paso 3: Entrega */}
        <div className="flex flex-col items-center w-1/3">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white z-10">
            {/* Ícono de Regalo */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <span className="font-bold text-sm mt-3">{dates.entrega || "..."}</span>
          <span className="text-sm text-gray-800">Entrega</span>
        </div>
      </div>
    </div>
  );
}
