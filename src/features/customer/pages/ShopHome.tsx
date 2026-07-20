import { motion } from 'framer-motion';
import { BadgeCheck, Bot, ClipboardList, RefreshCcw, Search, ShoppingCart, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard } from '../../../components/ui/MetricCard';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { CartItem, Locale, Medicine, Prescription } from '../../../types/pharmacy';
import {
  formatCurrency,
  prescriptionStatusLabel,
} from '../../../utils/pharmacy';
import { PromoCarousel } from '../components/PromoCarousel';

const copy = {
  ar: {
    badge: 'صيدلية أونلاين داخل مصر',
    ai: 'AI يساعدك تختار المسار الأسرع',
    title: 'صيدليتك جاهزة للطلب والروشتة والتوصيل',
    description: 'اطلب الدواء، ارفع الروشتة للصيدلي، وتابع التحضير والتوصيل من صفحة واحدة مرتبة.',
    searchPlaceholder: 'ابحث: كونكور، صداع، metformin، فرع الدقي...',
    startOrder: 'ابدأ الطلب',
    uploadRx: 'ارفع روشتة',
    results: 'نتائج البحث',
    resultsDetail: 'بحث بالاسم والمادة والعرض',
    latestRx: 'آخر روشتة',
    refill: 'اشتراكك الشهري',
    cart: 'السلة',
    active: 'نشط',
    paused: 'متوقف',
    itemsReady: 'أصناف جاهزة',
    refillMeds: 'أدوية مضافة',
    day: 'يوم',
    journey: [
      ['اختار', 'دواء أو خدمة'],
      ['راجع', 'الصيدلي يؤكد المتاح'],
      ['ادفع', 'كاش أو كارت عند الاستلام'],
      ['استلم', 'توصيل بمتابعة واضحة'],
    ],
  },
  en: {
    badge: 'Online pharmacy in Egypt',
    ai: 'AI helps choose the fastest path',
    title: 'Your pharmacy is ready for orders, prescriptions, and delivery',
    description: 'Order medicine, upload prescriptions for pharmacist review, and track preparation and delivery from one page.',
    searchPlaceholder: 'Search: Concor, headache, metformin, Dokki branch...',
    startOrder: 'Start order',
    uploadRx: 'Upload Rx',
    results: 'Search results',
    resultsDetail: 'Name, ingredient, symptom, branch',
    latestRx: 'Latest Rx',
    refill: 'Monthly refill',
    cart: 'Cart',
    active: 'Active',
    paused: 'Paused',
    itemsReady: 'items ready',
    refillMeds: 'medicines selected',
    day: 'Day',
    journey: [
      ['Choose', 'Medicine or service'],
      ['Review', 'Pharmacist confirms availability'],
      ['Pay', 'Cash or card on delivery'],
      ['Receive', 'Tracked delivery handoff'],
    ],
  },
};

export function ShopHome({
  locale,
  medicines,
  allMedicines,
  query,
  setQuery,
  cartItems,
  cartTotal,
  prescriptions,
  refillDay,
  refillMedicineIds,
  subscriptionActive,
}: {
  locale: Locale;
  medicines: Medicine[];
  allMedicines: Medicine[];
  query: string;
  setQuery: (query: string) => void;
  cartItems: CartItem[];
  cartTotal: number;
  prescriptions: Prescription[];
  refillDay: string;
  refillMedicineIds: string[];
  subscriptionActive: boolean;
}) {
  const text = copy[locale];
  const latestPrescription = prescriptions[0];
  const selectedRefillMeds = allMedicines.filter((medicine) => refillMedicineIds.includes(medicine.id));

  return (
    <div className="pb-8">
      <section id="home" className="customer-hero">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:py-10">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="float-card relative overflow-hidden rounded-lg border border-white/80 bg-white p-5 shadow-2xl shadow-emerald-950/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_88%_26%,rgba(14,165,233,0.12),transparent_26%)]" />
            <div className="absolute inset-y-0 end-0 hidden w-[42%] bg-[url('/rxflow-pharmacy-hero.png')] bg-cover bg-center opacity-22 lg:block" />
            <div className="relative z-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <div className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#edf7f3] px-3 text-sm font-black text-[#0f7f6d]">
                  <BadgeCheck size={17} />
                  {text.badge}
                </div>
                <div className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#eaf6ff] px-3 text-sm font-black text-[#166a9f]">
                  <Bot size={17} />
                  {text.ai}
                </div>
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#123d35] md:text-6xl">
                {text.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-[#5f756e] md:text-lg">
                {text.description}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="mt-6 flex flex-col gap-3 rounded-lg border border-[#d7e8e2] bg-white/94 p-3 shadow-xl shadow-emerald-950/5 sm:flex-row">
                <label className="flex min-h-12 flex-1 items-center gap-3 rounded-md border border-[#d7e8e2] bg-white px-4">
                  <Search className="text-[#0f7f6d]" size={20} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={text.searchPlaceholder}
                    className="w-full bg-transparent text-sm font-bold text-[#183c35] outline-none placeholder:text-[#7d918b]"
                  />
                </label>
                <Link
                  to="/customer/products"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0f7f6d] px-5 text-sm font-black text-white transition hover:bg-[#0a5f52]"
                >
                  <ShoppingCart size={18} />
                  {text.startOrder}
                </Link>
                <Link
                  to="/customer/prescription"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#0f7f6d] bg-white px-5 text-sm font-black text-[#0f7f6d] transition hover:bg-[#edf7f3]"
                >
                  <UploadCloud size={18} />
                  {text.uploadRx}
                </Link>
              </div>

              <div className="grid gap-2 sm:grid-cols-4">
                {text.journey.map(([title, detail], index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + index * 0.06 }}
                    className="rounded-lg border border-[#d7e8e2] bg-white/84 p-3"
                  >
                    <StatusBadge tone={index === 0 ? 'green' : index === 1 ? 'blue' : index === 2 ? 'violet' : 'amber'}>
                      {String(index + 1).padStart(2, '0')}
                    </StatusBadge>
                    <p className="mt-2 text-sm font-black text-[#173d36]">{title}</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-[#6f827c]">{detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.article>

          <PromoCarousel locale={locale} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-4 lg:px-8">
        <MetricCard icon={Search} label={text.results} value={`${medicines.length}`} detail={text.resultsDetail} />
        <MetricCard
          icon={ClipboardList}
          label={text.latestRx}
          value={latestPrescription.id}
          detail={prescriptionStatusLabel(latestPrescription.status, locale)}
        />
        <MetricCard
          icon={RefreshCcw}
          label={text.refill}
          value={subscriptionActive ? `${text.day} ${refillDay}` : text.paused}
          detail={`${selectedRefillMeds.length} ${text.refillMeds}`}
        />
        <MetricCard
          icon={ShoppingCart}
          label={text.cart}
          value={formatCurrency(cartTotal, locale)}
          detail={`${cartItems.length} ${text.itemsReady}`}
        />
      </section>
    </div>
  );
}
