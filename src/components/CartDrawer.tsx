"use client";

import { useCartStore } from "@/store/cartStore";
import { X, ShoppingBag, Trash2, Edit2 } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity } = useCartStore();
  const router = useRouter();

  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Prevenir scroll en el body cuando el carrito está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro (Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Panel del Carrito */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center">
                <ShoppingBag className="w-6 h-6 mr-3" />
                TU CARRITO
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-500 mb-8">Parece que aún no has agregado nada. ¡Descubre nuestra nueva colección!</p>
                  <button 
                    onClick={closeCart}
                    className="bg-[#e4d2ef] text-gray-800 px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-colors"
                  >
                    Seguir Comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6">
                      <div className="w-24 h-32 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-gray-800 font-light text-[15px] pr-4 tracking-wide mb-1.5">{item.product.name}</h3>
                        
                        {Object.entries(item.product.selectedOptions || {}).map(([key, value]) => (
                          <div key={key} className="text-[11px] text-gray-500 flex items-center mb-1 tracking-wider">
                            <span className="mr-1 uppercase font-medium">{key}:</span>
                            <span className="font-black text-gray-900 uppercase">{value as string}</span>
                          </div>
                        ))}
                        
                        <div className="flex items-center gap-3 text-gray-600 mb-4">
                          <button className="hover:text-black transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-gray-300 rounded-full px-2 py-0.5">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black"
                            >-</button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black"
                            >+</button>
                          </div>
                          <p className="font-bold text-gray-900 text-sm">${item.product.price.toLocaleString('es-CO')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer del Carrito */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-600">Costo de envío</span>
                <span className="font-bold text-green-600">GRATIS</span>
              </div>
              <div className="flex justify-between mb-5">
                <span className="font-medium text-gray-600">Subtotal</span>
                <span className="font-black text-gray-900">${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <button 
                disabled={items.length === 0}
                onClick={() => {
                  closeCart();
                  router.push('/checkout');
                }}
                className="w-full flex flex-col items-center justify-center bg-[#e4d2ef] text-gray-800 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-sm active:scale-[0.98] mb-3"
              >
                <span className="font-bold text-lg tracking-wider">COMPRAR</span>
                <span className="text-xs font-medium opacity-90">Pago contra entrega</span>
              </button>

              <button 
                onClick={closeCart}
                className="w-full py-3 rounded-full border-2 border-gray-100 text-gray-400 font-bold text-xs tracking-[0.2em] hover:border-[#e4d2ef] hover:text-[#e4d2ef] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-300 italic">←</span>
                AGREGAR MÁS PRODUCTOS
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
