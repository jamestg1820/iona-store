"use client";

import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Truck } from "lucide-react";

const DEPARTAMENTOS = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", 
  "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", 
  "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", 
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", 
  "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", 
  "Vaupés", "Vichada"
];

export default function CheckoutClient() {
  const { items } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Capturar datos del formulario
    const formData = new FormData(e.currentTarget);
    const nombres = formData.get('nombres') as string;
    const apellidos = " "; // Shopify pide nombre y apellido, los mandamos juntos en firstName por ahora o los separamos
    
    const payload = {
      items: items,
      customer: {
        firstName: nombres,
        lastName: apellidos,
        phone: formData.get('celular'),
      },
      shippingAddress: {
        address1: formData.get('direccion'),
        city: formData.get('ciudad'),
        province: formData.get('departamento'),
        neighborhood: formData.get('barrio')
      },
      note: formData.get('notas')
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error procesando la orden');
      }

      toast.success("¡Pedido confirmado!", {
        description: "Tu pedido será despachado pronto.",
      });

      // 🎯 Enviar evento Purchase a Facebook Pixel
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
          value: subtotal,
          currency: 'COP',
          content_type: 'product',
          content_ids: items.map(item => item.product.id),
          contents: items.map(item => ({
            id: item.product.id,
            quantity: item.quantity,
            item_price: item.product.price
          })),
          num_items: items.reduce((total, item) => total + item.quantity, 0)
        });
      }
      
      // Limpiar carrito y redirigir
      useCartStore.getState().items.forEach(item => useCartStore.getState().removeItem(item.id));
      
      // Parámetros para la página de gracias
      const params = new URLSearchParams({
        n: nombres,
        a: formData.get('direccion') as string,
        c: formData.get('ciudad') as string
      });

      router.push(`/gracias?${params.toString()}`);
      
    } catch (error: any) {
      toast.error("Hubo un problema con tu pedido", {
        description: "Por favor intenta nuevamente. Error: " + error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
        <button 
          onClick={() => router.push('/')}
          className="bg-[#e4d2ef] text-gray-800 px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-colors"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Formulario */}
      <div className="w-full lg:w-3/5 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Truck className="w-5 h-5 mr-2 text-[#e4d2ef]" />
          Datos de Envío
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombres y Apellidos *</label>
            <input 
              name="nombres"
              type="text" 
              required
              minLength={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B5BCE5] focus:ring-2 focus:ring-[#B5BCE5]/20 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Ej. María Pérez"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
              <select 
                name="departamento"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B5BCE5] focus:ring-2 focus:ring-[#B5BCE5]/20 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
              >
                <option value="">Selecciona...</option>
                {DEPARTAMENTOS.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
              <input 
                name="ciudad"
                type="text" 
                required
                minLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B5BCE5] focus:ring-2 focus:ring-[#B5BCE5]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Ej. Medellín"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barrio *</label>
              <input 
                name="barrio"
                type="text" 
                required
                minLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B5BCE5] focus:ring-2 focus:ring-[#B5BCE5]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Nombre de tu barrio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número Celular *</label>
              <input 
                name="celular"
                type="text" 
                required
                pattern="[0-9]{10}"
                maxLength={10}
                minLength={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B5BCE5] focus:ring-2 focus:ring-[#B5BCE5]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="3001234567"
                title="Debe contener exactamente 10 dígitos numéricos"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección exacta de entrega *</label>
            <input 
              name="direccion"
              type="text" 
              required
              minLength={10}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B5BCE5] focus:ring-2 focus:ring-[#B5BCE5]/20 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Calle 10 # 20 - 30, Apto 401"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas del pedido (Opcional)</label>
            <textarea 
              name="notas"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B5BCE5] focus:ring-2 focus:ring-[#B5BCE5]/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
              placeholder="Ej. Dejar en portería, la casa es de rejas blancas, etc."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex flex-col items-center justify-center bg-[#e4d2ef] text-gray-800 py-3 rounded-full hover:bg-black hover:text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-bold text-xl tracking-wide">
                {isSubmitting ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
              </span>
              <span className="text-sm font-medium opacity-80 mt-1">
                Pagas al recibir en casa
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Resumen del Pedido */}
      <div className="w-full lg:w-2/5">
        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.product.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(item.product.selectedOptions || {}).map(([key, value]) => (
                      <span key={key} className="text-[10px] text-gray-400 font-bold uppercase">
                        {value as string}
                      </span>
                    ))}
                    <span className="text-[10px] text-gray-400 font-bold uppercase">QTY: {item.quantity}</span>
                  </div>
                  <p className="font-black text-gray-900 mt-1">${(item.product.price * item.quantity).toLocaleString('es-CO')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Costo de envío</span>
              <span className="font-bold text-green-600">GRATIS</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-lg font-bold text-gray-900">Total a pagar</span>
              <span className="text-2xl font-black text-[#e4d2ef]">${subtotal.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center p-4 bg-green-50 rounded-xl text-green-700">
            <ShieldCheck className="w-6 h-6 mr-3" />
            <span className="font-medium text-sm">Compra 100% segura. Pagas cuando tengas el producto en tus manos.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
