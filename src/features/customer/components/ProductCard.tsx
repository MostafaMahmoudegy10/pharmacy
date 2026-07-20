import { motion } from 'framer-motion';
import { BadgeCheck, MapPin, Pill, ShoppingCart } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Locale, Medicine } from '../../../types/pharmacy';
import {
  categoryLabel,
  formatCurrency,
  medicineBranch,
  medicineName,
  medicineSecondaryName,
} from '../../../utils/pharmacy';

const copy = {
  ar: {
    price: 'السعر',
    stock: 'المخزون',
    available: 'متاح',
    rx: 'روشتة',
    lowStock: 'كمية قليلة',
    unavailable: 'غير متاح',
    add: 'أضف للسلة',
    request: 'اطلب توفيره',
    popularity: 'الأكثر طلبًا',
  },
  en: {
    price: 'Price',
    stock: 'Stock',
    available: 'Available',
    rx: 'Rx required',
    lowStock: 'Low stock',
    unavailable: 'Unavailable',
    add: 'Add to cart',
    request: 'Request stock',
    popularity: 'Popular',
  },
};

export function ProductCard({
  medicine,
  index,
  locale,
  addToCart,
}: {
  medicine: Medicine;
  index: number;
  locale: Locale;
  addToCart: (medicine: Medicine) => void;
}) {
  const text = copy[locale];
  const lowStock = medicine.stock > 0 && medicine.stock <= 5;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.04 }}
      className="product-card min-h-[380px] w-[292px] shrink-0 snap-start rounded-lg border border-[#d7e8e2] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#0f7f6d] hover:shadow-lg"
    >
      <div className="relative grid h-32 place-items-center overflow-hidden rounded-lg bg-[#e9f8f3]">
        <div className="absolute inset-0 product-pattern" />
        <div className="absolute left-3 top-3">
          <StatusBadge tone="blue">{categoryLabel(medicine.category, locale)}</StatusBadge>
        </div>
        <div className="relative grid size-20 place-items-center rounded-lg bg-white text-[#0f7f6d] shadow-sm">
          <Pill size={38} />
        </div>
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-white/92 px-2 py-1 text-[11px] font-black text-[#0f7f6d]">
          <BadgeCheck size={13} />
          {text.popularity} {medicine.popularity}%
        </div>
      </div>

      <div className="mt-4 min-h-[76px]">
        <h3 className="text-lg font-black leading-7 text-[#173d36]">
          {medicineName(medicine, locale)}
        </h3>
        <p className="mt-1 text-xs font-bold text-[#6f827c]">
          {medicineSecondaryName(medicine, locale)}
        </p>
        <p className="mt-2 line-clamp-1 text-sm font-bold text-[#4f6b63]">
          {medicine.ingredient}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {medicine.requiresRx && <StatusBadge tone="amber">{text.rx}</StatusBadge>}
        {medicine.stock === 0 && <StatusBadge tone="red">{text.unavailable}</StatusBadge>}
        {lowStock && <StatusBadge tone="amber">{text.lowStock}</StatusBadge>}
        {medicine.stock > 5 && <StatusBadge>{text.available}</StatusBadge>}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#6d807a]">
        <MapPin size={15} className="text-[#0f7f6d]" />
        {medicineBranch(medicine, locale)}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#e4f0ec] pt-4">
        <div>
          <p className="text-xs font-black text-[#7a8d87]">{text.price}</p>
          <p className="text-2xl font-black text-[#0f7f6d]">
            {formatCurrency(medicine.price, locale)}
          </p>
        </div>
        <div className="text-left">
          <p className="text-xs font-black text-[#7a8d87]">{text.stock}</p>
          <p className="font-black text-[#173d36]">{medicine.stock}</p>
        </div>
      </div>

      <button
        type="button"
        disabled={medicine.stock === 0}
        onClick={() => addToCart(medicine)}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#0f7f6d] px-4 text-sm font-black text-white transition hover:bg-[#0a5f52] disabled:cursor-not-allowed disabled:bg-[#9dbab2]"
      >
        <ShoppingCart size={18} />
        {medicine.stock === 0 ? text.request : text.add}
      </button>
    </motion.article>
  );
}
