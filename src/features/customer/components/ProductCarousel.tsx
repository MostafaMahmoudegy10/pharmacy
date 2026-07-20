import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { categories } from '../../../data/pharmacyData';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import type { Locale, Medicine } from '../../../types/pharmacy';
import { ProductCard } from './ProductCard';

const copy = {
  ar: {
    eyebrow: 'المتجر',
    title: 'منتجات وأدوية ببحث سريع',
    description: 'الأدوية مرتبة حسب الاحتياج، والمخزون والسعر ظاهرين قبل الإضافة للسلة.',
    previous: 'تحريك يمين',
    next: 'تحريك شمال',
    emptyTitle: 'مفيش نتيجة مطابقة',
    emptyBody: 'جرب اسم تجاري، مادة فعالة، أو عرض مختلف.',
  },
  en: {
    eyebrow: 'Shop',
    title: 'Fast product discovery',
    description: 'Medicines are grouped by need, with stock and price visible before adding to cart.',
    previous: 'Scroll back',
    next: 'Scroll forward',
    emptyTitle: 'No matching results',
    emptyBody: 'Try a brand name, active ingredient, or symptom.',
  },
};

export function ProductCarousel({
  locale,
  medicines,
  category,
  setCategory,
  addToCart,
}: {
  locale: Locale;
  medicines: Medicine[];
  category: string;
  setCategory: (category: string) => void;
  addToCart: (medicine: Medicine) => void;
}) {
  const rail = useRef<HTMLDivElement | null>(null);
  const text = copy[locale];

  const scroll = (direction: 'back' | 'forward') => {
    const delta = direction === 'forward' ? 340 : -340;
    rail.current?.scrollBy({ left: locale === 'ar' ? -delta : delta, behavior: 'smooth' });
  };

  return (
    <section className="min-w-0">
      <SectionHeading
        eyebrow={text.eyebrow}
        title={text.title}
        description={text.description}
        action={(
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll('back')}
              className="grid size-10 place-items-center rounded-md border border-[#d7e8e2] bg-white text-[#0f7f6d] transition hover:bg-[#edf7f3]"
              aria-label={text.previous}
              title={text.previous}
            >
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll('forward')}
              className="grid size-10 place-items-center rounded-md border border-[#d7e8e2] bg-white text-[#0f7f6d] transition hover:bg-[#edf7f3]"
              aria-label={text.next}
              title={text.next}
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setCategory(item.value)}
            className={[
              'shrink-0 rounded-md border px-4 py-2 text-sm font-black transition',
              category === item.value
                ? 'border-[#0f7f6d] bg-[#0f7f6d] text-white'
                : 'border-[#d7e8e2] bg-white text-[#44635b] hover:bg-[#edf7f3]',
            ].join(' ')}
          >
            {item.label[locale]}
          </button>
        ))}
      </div>

      <div className="relative">
        <div
          ref={rail}
          className="carousel-mask flex snap-x gap-4 overflow-x-auto pb-3 no-scrollbar"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {medicines.map((medicine, index) => (
            <ProductCard
              key={medicine.id}
              medicine={medicine}
              index={index}
              locale={locale}
              addToCart={addToCart}
            />
          ))}
          {!medicines.length && (
            <div className="w-full rounded-lg border border-dashed border-[#b9d8cf] bg-white p-10 text-center">
              <Search className="mx-auto text-[#0f7f6d]" size={36} />
              <p className="mt-3 text-lg font-black text-[#173d36]">{text.emptyTitle}</p>
              <p className="mt-1 text-sm font-semibold text-[#6d807a]">{text.emptyBody}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
