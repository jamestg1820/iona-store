"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Truck, Wallet, Calendar, ArrowRight, Package } from "lucide-react";

function GraciasContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const name = searchParams.get("n") || "Cliente";
  const address = searchParams.get("a") || "tu dirección";
  const city = searchParams.get("c") || "tu ciudad";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Confetti / Success Header */}
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="bg-[#e4d2ef] p-10 flex flex-col items-center text-center text-gray-800">
          <div className="bg-white/40 p-4 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-gray-800" />
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">¡MUCHAS GRACIAS!</h1>
          <p className="text-lg font-medium opacity-90">Tu pedido ha sido confirmado con éxito</p>
        </div>

        <div className="p-8 md:p-12">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4">¡Hola, {name}!</h2>
            <p className="text-gray-500 leading-relaxed max-w-md mx-auto">
              Estamos muy felices de que hayas elegido a <span className="font-bold text-black italic tracking-tighter">IONA</span>. Tu pedido ya está en manos de nuestro equipo de logística.
            </p>
          </div>

          {/* Delivery Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                <Truck className="w-6 h-6 text-[#e4d2ef]" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-2">Entrega estimada</h3>
                <p className="text-gray-600 text-sm">3 a 5 días hábiles</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-gray-700 bg-[#e4d2ef]/30 px-2 py-1 rounded w-fit uppercase tracking-tighter">
                  <Calendar className="w-3 h-3" />
                  Llega pronto
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                <Package className="w-6 h-6 text-[#e4d2ef]" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-2">Dirección de envío</h3>
                <p className="text-gray-600 text-sm">{address}</p>
                <p className="text-gray-400 text-xs mt-1">{city}, Colombia</p>
              </div>
            </div>
          </div>

          {/* Important Reminder */}
          <div className="bg-yellow-50 p-8 rounded-3xl border-2 border-dashed border-yellow-200 mb-12 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-yellow-400 p-4 rounded-2xl">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg font-black text-yellow-900 mb-1 uppercase tracking-tight">Recordatorio Importante</h4>
              <p className="text-yellow-800 text-sm leading-relaxed">
                Recuerda tener el <span className="font-bold underline">dinero en efectivo</span> al momento de recibir tu pedido. El mensajero no podrá entregarte el producto sin el pago completo.
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/"
              className="w-full sm:w-auto bg-[#e4d2ef] text-gray-800 px-10 py-4 rounded-full font-black text-sm tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#e4d2ef]/20"
            >
              SEGUIR COMPRANDO
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="https://wa.me/573000000000" 
              target="_blank"
              className="w-full sm:w-auto bg-white border-2 border-gray-100 text-gray-500 px-10 py-4 rounded-full font-black text-sm tracking-widest hover:border-black hover:text-black transition-all flex items-center justify-center gap-3"
            >
              ¿NECESITAS AYUDA?
            </Link>
          </div>
        </div>
      </div>
      
      <p className="text-gray-400 text-xs mt-12 text-center">
        © 2026 Totto Headless - Todos los derechos reservados.<br/>
        Bogotá, Colombia
      </p>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#e4d2ef] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}
