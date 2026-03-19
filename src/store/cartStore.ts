import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    storeSlug: string; 
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string, storeSlug: string) => void;
    updateQuantity: (id: string, storeSlug: string, quantity: number) => void;
    clearCart: (storeSlug: string) => void;
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            isCartOpen: false,
            setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
            
            addItem: (newItem) => set((state) => {
                const existingItem = state.items.find((i) => i.id === newItem.id && i.storeSlug === newItem.storeSlug);
                if (existingItem) {
                    return {
                        items: state.items.map((i) => 
                            i.id === newItem.id && i.storeSlug === newItem.storeSlug 
                                ? { ...i, quantity: i.quantity + newItem.quantity }
                                : i
                        )
                    };
                }
                return { items: [...state.items, newItem] };
            }),

            removeItem: (id, storeSlug) => set((state) => ({
                items: state.items.filter((i) => !(i.id === id && i.storeSlug === storeSlug))
            })),

            updateQuantity: (id, storeSlug, quantity) => set((state) => ({
                items: state.items.map((i) => 
                    i.id === id && i.storeSlug === storeSlug
                        ? { ...i, quantity: Math.max(1, quantity) }
                        : i
                )
            })),

            clearCart: (storeSlug) => set((state) => ({
                items: state.items.filter((i) => i.storeSlug !== storeSlug)
            }))
        }),
        {
            name: 'creatiendas-cart',
            partialize: (state) => ({ items: state.items }) // Persist only items
        }
    )
);
