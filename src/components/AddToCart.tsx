"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";

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
      id: product.id,
      handle: product.handle || '',
      name: product.title || product.name,
      price: selectedVariant.price,
      image: selectedVariant.image?.url || (product.images ? product.images[0]?.url : product.image),
      variantId: selectedVariant.id,
      selectedOptions: selectedOptions
    };

    addItem(cartProduct, quantity);
    
    // Abrir el carrito
    openCart();
  };

  // Función para obtener la imagen de una opción de color
  const getColorImage = (optionName: string, value: string) => {
    const variant = product.variants.find((v: any) => 
      v.selectedOptions.some((opt: any) => opt.name === optionName && opt.value === value)
    );
    return variant?.image?.url || product.images[0]?.url;
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Opciones del Producto (Colores como Swatches) */}
      {product.options && product.options
        .filter((option: any) => !(option.name === 'Title' && option.values.includes('Default Title')))
        .map((option: any) => {
          const isColor = option.name.toLowerCase().includes('color');
          return (
            <div key={option.name} className="flex flex-col space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                {option.name}: <span className="font-light text-gray-500 ml-2">{selectedOptions[option.name]}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {option.values.map((value: string) => (
                  <button
                    key={value}
                    onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                    className={`relative transition-all duration-200 ${
                      isColor 
                        ? `w-14 h-14 rounded-md overflow-hidden border-2 ${selectedOptions[option.name] === value ? 'ring-2 ring-[#e4d2ef] ring-offset-2 scale-110 shadow-lg' : 'border border-gray-100 hover:border-[#e4d2ef]/50'}`
                        : `px-6 py-2 rounded-full border-2 text-sm font-bold ${selectedOptions[option.name] === value ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`
                    }`}
                  >
                    {isColor ? (
                      <img 
                        src={getColorImage(option.name, value)} 
                        alt={value} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      value
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

      <div className="flex flex-col items-center w-full space-y-4 pt-2">
        {/* Selector de Cantidad Estilo Pill (A la izquierda) */}
        <div className="w-full flex justify-start">
          <div className="flex items-center justify-between border border-gray-200 rounded-full w-[80px] px-2 py-1 bg-gray-50/50">
            <button onClick={handleDecrease} className="text-sm font-bold text-gray-500 hover:text-[#e4d2ef] transition-colors">−</button>
            <span className="font-bold text-xs text-gray-900">{quantity}</span>
            <button onClick={handleIncrease} className="text-sm font-bold text-gray-500 hover:text-[#e4d2ef] transition-colors">+</button>
          </div>
        </div>

        {/* Botón de Agregar Centrado */}
        <button 
          onClick={handleAddToCart}
          data-add-to-cart
          className="w-full max-w-[280px] bg-[#e4d2ef] text-gray-800 py-3.5 rounded-full font-bold tracking-wider text-sm hover:bg-black hover:text-white transition-all duration-300 shadow-md active:scale-[0.98] mx-auto"
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
