"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { sendGAEvent } from '@next/third-parties/google';
import Accordion from "@/components/Accordion";

export default function AddToCart({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initialOptions: Record<string, string> = {};
    product.options?.forEach((option: any) => {
      if (option.name !== 'Title' || !option.values.includes('Default Title')) {
        initialOptions[option.name] = option.values[0];
      }
    });
    return initialOptions;
  });

  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  // Encontrar la variante actual basada en las opciones seleccionadas
  const selectedVariant = product.variants.find((variant: any) => 
    variant.selectedOptions.every((opt: any) => selectedOptions[opt.name] === opt.value)
  ) || product.variants[0];

  const handleAddToCart = () => {
    const cartProduct = {
      id: selectedVariant.id, // Usamos variantId como ID único en el carrito
      handle: product.handle || '',
      name: product.title || product.name,
      price: selectedVariant.price,
      image: selectedVariant.image?.url || (product.images ? product.images[0]?.url : product.image),
      variantId: selectedVariant.id,
      selectedOptions: selectedOptions
    };

    addItem(cartProduct, quantity);
    
    const numericVariantId = selectedVariant.id.match(/\d+$/)?.[0] || selectedVariant.id;

    // 🎯 RASTREO: Enviar evento AddToCart a Google Analytics 4
    sendGAEvent('event', 'add_to_cart', {
      currency: 'COP',
      value: selectedVariant.price * quantity,
      items: [
        {
          item_id: numericVariantId,
          item_name: product.title || product.name,
          price: selectedVariant.price,
          quantity: quantity
        }
      ]
    });

    // 🎯 RASTREO: Enviar evento AddToCart a Facebook (Pixel + CAPI)
    const eventId = `atc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. Envío al Píxel (Navegador)
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [numericVariantId],
        content_name: product.title,
        content_type: 'product',
        value: selectedVariant.price * quantity,
        currency: 'COP'
      }, { eventID: eventId });
    }

    // 2. Envío a CAPI (Servidor)
    const sendCAPI = async () => {
      try {
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };

        await fetch('/api/meta-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'AddToCart',
            eventId: eventId,
            url: window.location.href,
            clientData: {
              fbp: getCookie('_fbp'),
              fbc: getCookie('_fbc'),
            },
            customData: {
              content_ids: [numericVariantId],
              content_name: product.title,
              content_type: 'product',
              value: selectedVariant.price * quantity,
              currency: 'COP'
            }
          })
        });
      } catch (err) {
        console.error('CAPI Error:', err);
      }
    };

    sendCAPI();

    toast.success("Producto agregado al carrito");
  };

  const handleBuyNow = () => {
    const cartProduct = {
      id: selectedVariant.id,
      handle: product.handle || '',
      name: product.title || product.name,
      price: selectedVariant.price,
      image: selectedVariant.image?.url || (product.images ? product.images[0]?.url : product.image),
      variantId: selectedVariant.id,
      selectedOptions: selectedOptions
    };
    addItem(cartProduct, quantity, false);
    
    const numericVariantId = selectedVariant.id.match(/\d+$/)?.[0] || selectedVariant.id;

    // 🎯 RASTREO: Enviar evento InitiateCheckout a Google Analytics 4
    sendGAEvent('event', 'begin_checkout', {
      currency: 'COP',
      value: selectedVariant.price * quantity,
      items: [
        {
          item_id: numericVariantId,
          item_name: product.title || product.name,
          price: selectedVariant.price,
          quantity: quantity
        }
      ]
    });

    // 🎯 RASTREO: Enviar evento InitiateCheckout a Facebook (Pixel + CAPI)
    const eventId = `ic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. Envío al Píxel (Navegador)
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: [numericVariantId],
        content_name: product.title,
        content_type: 'product',
        value: selectedVariant.price * quantity,
        currency: 'COP'
      }, { eventID: eventId });
    }

    // 2. Envío a CAPI (Servidor)
    const sendCAPI = async () => {
      try {
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };

        // No esperamos (await) el fetch para no bloquear la redirección
        fetch('/api/meta-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true, // Importante para que el request sobreviva a la navegación
          body: JSON.stringify({
            eventName: 'InitiateCheckout',
            eventId: eventId,
            url: window.location.href,
            clientData: {
              fbp: getCookie('_fbp'),
              fbc: getCookie('_fbc'),
            },
            customData: {
              content_ids: [numericVariantId],
              content_name: product.title,
              content_type: 'product',
              value: selectedVariant.price * quantity,
              currency: 'COP'
            }
          })
        }).catch(err => console.error('CAPI Error:', err));
      } catch (err) {
        console.error('CAPI Error:', err);
      }
    };

    sendCAPI();

    // Redirigir al checkout
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col">
      {/* Opciones del Producto (Lista de Colores) */}
      <div className="flex flex-col space-y-8 mt-4">
        {product.options && product.options
          .filter((option: any) => !(option.name === 'Title' && option.values.includes('Default Title')))
          .map((option: any) => {
            const isColor = option.name.toLowerCase().includes('color');
            return (
              <div key={option.name} className="flex flex-col space-y-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                  SELECCIONA {option.name}: <span className="font-light text-gray-500 ml-2">{selectedOptions[option.name]}</span>
                </h3>
                <div className="flex flex-col space-y-2">
                  {option.values.map((value: string) => (
                    <button
                      key={value}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                      className={`flex items-center w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                        selectedOptions[option.name] === value 
                          ? 'border-black bg-black text-white shadow-lg transform scale-[1.01]' 
                          : 'border-gray-100 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                        selectedOptions[option.name] === value 
                          ? 'border-white bg-white' 
                          : 'border-gray-300 bg-transparent group-hover:border-gray-400'
                      }`}>
                        {selectedOptions[option.name] === value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-black animate-in fade-in zoom-in duration-300" />
                        )}
                      </div>
                      <span className="text-[13px] font-black uppercase tracking-widest">{value}</span>
                      {selectedOptions[option.name] === value && (
                        <span className="ml-auto text-[10px] font-bold opacity-60">SELECCIONADO</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      </div>

      {/* Botón de Ayuda WhatsApp */}
      <div className="mt-6">
        <a 
          href={`https://wa.me/573163516844?text=Hola,%20necesito%20ayuda%20con%20este%20producto:%20${product.title}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all text-sm font-medium"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
            alt="WhatsApp" 
            className="w-5 h-5 mr-3"
          />
          ¿Necesitas ayuda? Escríbenos
        </a>
      </div>

      {/* Acordeones */}
      <div className="mt-6 border-t border-gray-200">
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

      <div className="flex flex-col items-center w-full space-y-4 mt-8 pt-6 border-t border-gray-100">
        {/* Selector de Cantidad Estilo Pill (A la izquierda) */}
        <div className="w-full flex justify-start">
          <div className="flex items-center justify-between border border-gray-200 rounded-full w-[100px] px-3 py-2 bg-gray-50/50">
            <button onClick={handleDecrease} className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-400 hover:text-black transition-colors">−</button>
            <span className="font-black text-sm text-gray-900">{quantity}</span>
            <button onClick={handleIncrease} className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-400 hover:text-black transition-colors">+</button>
          </div>
        </div>

        {/* Botón de Comprar (Checkout Inmediato) */}
        <button 
          onClick={handleBuyNow}
          data-buy-now
          className="w-full bg-black text-white py-4 rounded-full font-black tracking-[0.2em] text-sm hover:bg-[#e4d2ef] hover:text-black transition-all duration-300 shadow-xl active:scale-[0.98] mx-auto border-2 border-black"
        >
          COMPRAR AHORA
        </button>

        {/* Botón de Agregar al carrito */}
        <button 
          onClick={handleAddToCart}
          data-add-to-cart
          className="w-full bg-[#e4d2ef] text-gray-800 py-4 rounded-full font-black tracking-[0.2em] text-sm hover:bg-black hover:text-white transition-all duration-300 shadow-xl active:scale-[0.98] mx-auto"
        >
          AGREGAR AL CARRITO
        </button>

        {/* Imagen de Medios de Pago Centrada */}
        <div className="w-full max-w-[260px] flex justify-center mx-auto mt-2">
          <img 
            src="https://parchita.com.co/cdn/shop/files/Medios-de-pago_1.png?v=1754669083&width=600" 
            alt="Medios de Pago" 
            className="w-full h-auto opacity-80"
          />
        </div>
      </div>
    </div>
  );
}
