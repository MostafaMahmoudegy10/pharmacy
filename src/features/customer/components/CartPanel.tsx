import { CreditCard, Minus, Pill, Plus, ShoppingCart } from 'lucide-react';
import type { CartItem, Locale } from '../../../types/pharmacy';
import { formatCurrency, medicineName } from '../../../utils/pharmacy';

const copy = {
  ar: {
    eyebrow: 'السلة',
    title: 'طلب سريع',
    empty: 'السلة فاضية',
    unit: 'للعبوة',
    total: 'الإجمالي',
    items: 'أصناف',
    confirm: 'تأكيد الطلب للدليفري',
    decrement: 'تقليل الكمية',
    increment: 'زيادة الكمية',
  },
  en: {
    eyebrow: 'Cart',
    title: 'Quick order',
    empty: 'Cart is empty',
    unit: 'per pack',
    total: 'Total',
    items: 'items',
    confirm: 'Confirm for delivery',
    decrement: 'Decrease quantity',
    increment: 'Increase quantity',
  },
};

export function CartPanel({
  locale,
  cartItems,
  cartTotal,
  updateQty,
  createOrderFromCart,
}: {
  locale: Locale;
  cartItems: CartItem[];
  cartTotal: number;
  updateQty: (medicineId: string, delta: number) => void;
  createOrderFromCart: () => void;
}) {
  const text = copy[locale];

  return (
    <aside className="rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#0f7f6d]">{text.eyebrow}</p>
          <h2 className="text-2xl font-black text-[#173d36]">{text.title}</h2>
        </div>
        <div className="grid size-12 place-items-center rounded-lg bg-[#edf7f3] text-[#0f7f6d]">
          <ShoppingCart size={22} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {cartItems.map((item) => (
          <div key={item.medicineId} className="flex items-center justify-between gap-3 border-b border-[#e4f0ec] pb-3">
            <div className="min-w-0">
              <p className="font-black text-[#173d36]">{medicineName(item.medicine, locale)}</p>
              <p className="text-xs font-bold text-[#70837d]">
                {formatCurrency(item.medicine.price, locale)} {text.unit}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => updateQty(item.medicineId, -1)}
                className="grid size-8 place-items-center rounded-md border border-[#d7e8e2] text-[#0f7f6d] transition hover:bg-[#edf7f3]"
                aria-label={text.decrement}
                title={text.decrement}
              >
                <Minus size={14} />
              </button>
              <span className="min-w-6 text-center font-black">{item.qty}</span>
              <button
                type="button"
                onClick={() => updateQty(item.medicineId, 1)}
                className="grid size-8 place-items-center rounded-md border border-[#d7e8e2] text-[#0f7f6d] transition hover:bg-[#edf7f3]"
                aria-label={text.increment}
                title={text.increment}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}

        {!cartItems.length && (
          <div className="rounded-lg border border-dashed border-[#b9d8cf] bg-[#edf7f3] p-5 text-center">
            <Pill className="mx-auto text-[#0f7f6d]" size={30} />
            <p className="mt-2 font-black text-[#173d36]">{text.empty}</p>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-lg bg-[#f7faf8] p-4">
        <div className="flex items-center justify-between gap-3 text-sm font-bold text-[#5e746d]">
          <span>{text.total}</span>
          <span>{cartItems.length} {text.items}</span>
        </div>
        <p className="mt-2 text-3xl font-black text-[#0f7f6d]">
          {formatCurrency(cartTotal, locale)}
        </p>
      </div>

      <button
        type="button"
        onClick={createOrderFromCart}
        disabled={!cartItems.length}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#123d35] px-4 text-sm font-black text-white transition hover:bg-[#0f7f6d] disabled:cursor-not-allowed disabled:bg-[#a8b9b4]"
      >
        <CreditCard size={18} />
        {text.confirm}
      </button>
    </aside>
  );
}
