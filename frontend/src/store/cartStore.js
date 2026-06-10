import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty = 1) => {
        const exist = get().items.find(i => i._id === product._id);
        if (exist) {
          set({ items: get().items.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i) });
        } else {
          set({ items: [...get().items, { ...product, qty }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter(i => i._id !== id) }),
      updateQty: (id, qty) => {
        if (qty < 1) return;
        set({ items: get().items.map(i => i._id === id ? { ...i, qty } : i) });
      },
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
      total: () => get().items.reduce((s, i) => s + (i.salePrice || i.price) * i.qty, 0)
    }),
    { name: 'myshop-cart' }
  )
);
