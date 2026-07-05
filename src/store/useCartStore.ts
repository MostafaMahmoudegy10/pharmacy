import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Medicine } from '../api/mockDb';
import { api } from '../api/apiClient';

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  coupon: { code: string; percent: number } | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  addItem: (medicine: Medicine, quantity?: number) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

const SHIPPING_FEE = 15.0;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      subtotal: 0,
      shipping: SHIPPING_FEE,
      discount: 0,
      total: 0,
      
      addItem: (medicine, quantity = 1) => {
        const items = [...get().items];
        const existingIdx = items.findIndex(i => i.medicine.id === medicine.id);
        if (existingIdx !== -1) {
          items[existingIdx] = {
            ...items[existingIdx],
            quantity: items[existingIdx].quantity + quantity
          };
        } else {
          items.push({ medicine, quantity });
        }
        set({ items });
        get().calculateTotals();
      },
      
      removeItem: (medicineId) => {
        const items = get().items.filter(i => i.medicine.id !== medicineId);
        set({ items });
        get().calculateTotals();
      },
      
      updateQuantity: (medicineId, quantity) => {
        const items = get().items.map(i => {
          if (i.medicine.id === medicineId) {
            return { ...i, quantity: Math.max(1, quantity) };
          }
          return i;
        });
        set({ items });
        get().calculateTotals();
      },
      
      applyCoupon: async (code) => {
        try {
          const percent = await api.coupons.validate(code);
          set({ coupon: { code, percent } });
          get().calculateTotals();
        } catch (err) {
          throw err;
        }
      },
      
      removeCoupon: () => {
        set({ coupon: null });
        get().calculateTotals();
      },
      
      clearCart: () => {
        set({ items: [], coupon: null, subtotal: 0, discount: 0, total: 0 });
      },
      
      calculateTotals: () => {
        const items = get().items;
        const subtotal = items.reduce((acc, item) => acc + (item.medicine.price * item.quantity), 0);
        const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
        const coupon = get().coupon;
        const discount = coupon ? (subtotal * (coupon.percent / 100)) : 0;
        const total = Math.max(0, subtotal + shipping - discount);
        set({ subtotal, shipping, discount, total });
      }
    }),
    {
      name: 'rxflow-cart-store',
    }
  )
);
