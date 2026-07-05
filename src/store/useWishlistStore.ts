import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Medicine } from '../api/mockDb';

interface WishlistState {
  items: Medicine[];
  toggleWishlist: (medicine: Medicine) => void;
  hasItem: (medicineId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (medicine) => {
        const items = get().items;
        const exists = items.some(i => i.id === medicine.id);
        if (exists) {
          set({ items: items.filter(i => i.id !== medicine.id) });
        } else {
          set({ items: [...items, medicine] });
        }
      },
      hasItem: (medicineId) => {
        return get().items.some(i => i.id === medicineId);
      }
    }),
    {
      name: 'rxflow-wishlist-store',
    }
  )
);
