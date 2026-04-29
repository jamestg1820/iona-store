import { create } from 'zustand';

export interface CartItem {
  id: string;
  product: any; // Mantenemos any para aceptar tanto UIProduct del carrusel como el producto detallado de la página
  quantity: number;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: any, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  items: [],
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  addItem: (product, quantity) => set((state) => {
    // Rastrear evento en Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price * quantity,
        currency: 'COP'
      });
    }

    const existingItem = state.items.find(item => item.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        ),
        isOpen: true
      };
    }
    return {
      items: [...state.items, { id: product.id, product, quantity }],
      isOpen: true
    };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  }))
}));
