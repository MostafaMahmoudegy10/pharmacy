import { CartPanel } from '../components/CartPanel';
import { CustomerServices } from '../components/CustomerServices';
import { PrescriptionTimeline } from '../components/PrescriptionTimeline';
import { PrescriptionUploadPanel } from '../components/PrescriptionUploadPanel';
import { ProductCarousel } from '../components/ProductCarousel';
import { RefillPanel } from '../components/RefillPanel';
import { ServiceProcessCarousel } from '../components/ServiceProcessCarousel';
import { Check, ClipboardCheck, MessageCircle, Search, Truck, UploadCloud } from 'lucide-react';
import type { CartItem, Locale, Medicine, Prescription } from '../../../types/pharmacy';

const productCopy = {
  ar: {
    search: 'ابحث في الأدوية والمواد الفعالة...',
  },
  en: {
    search: 'Search medicines and active ingredients...',
  },
};

export function CustomerServicesPage({ locale }: { locale: Locale }) {
  return (
    <div className="pb-10">
      <CustomerServices locale={locale} />
      <ServiceProcessCarousel locale={locale} />
    </div>
  );
}

export function CustomerProductsPage({
  locale,
  medicines,
  category,
  setCategory,
  cartItems,
  cartTotal,
  query,
  setQuery,
  addToCart,
  updateQty,
  createOrderFromCart,
}: {
  locale: Locale;
  medicines: Medicine[];
  category: string;
  setCategory: (category: string) => void;
  cartItems: CartItem[];
  cartTotal: number;
  query: string;
  setQuery: (query: string) => void;
  addToCart: (medicine: Medicine) => void;
  updateQty: (medicineId: string, delta: number) => void;
  createOrderFromCart: () => void;
}) {
  const text = productCopy[locale];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px] lg:px-8">
      <div className="grid gap-4">
        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[#d7e8e2] bg-white px-4 shadow-sm">
          <Search size={19} className="text-[#0f7f6d]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={text.search}
            className="w-full bg-transparent text-sm font-bold text-[#173d36] outline-none placeholder:text-[#8aa098]"
          />
        </label>
        <ProductCarousel
          locale={locale}
          medicines={medicines}
          category={category}
          setCategory={setCategory}
          addToCart={addToCart}
        />
      </div>

      <CartPanel
        locale={locale}
        cartItems={cartItems}
        cartTotal={cartTotal}
        updateQty={updateQty}
        createOrderFromCart={createOrderFromCart}
      />
    </div>
  );
}

export function CustomerPrescriptionPage({
  locale,
  uploadPrescription,
  prescriptions,
}: {
  locale: Locale;
  uploadPrescription: (payload: { customer: string; phone: string; area: string; notes: string; fileName: string }) => void;
  prescriptions: Prescription[];
}) {
  return (
    <div className="prescription-page pb-16">
      <section className="prescription-top">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <span className="soft-pill"><ClipboardCheck size={16}/>{locale === 'ar' ? 'روشتتك من الصورة لباب البيت' : 'From photo to your door'}</span>
          <h1 className="mt-5 text-3xl font-black text-[#143e36] md:text-5xl">{locale === 'ar' ? 'ارفع الروشتة، والباقي علينا' : 'Upload your prescription. We handle the rest.'}</h1>
          <p className="mt-3 max-w-2xl font-semibold leading-8 text-[#6c817a]">{locale === 'ar' ? 'عملية واحدة واضحة: ترفع الصورة، الصيدلي يراجعها ويتواصل معاك، وبعد التأكيد نجهز ونوصل.' : 'One clear flow: upload, pharmacist review and chat, confirmation, then delivery.'}</p>
          <div className="rx-process mt-10">
            {[
              [UploadCloud, locale === 'ar' ? 'ارفع الروشتة' : 'Upload'],
              [ClipboardCheck, locale === 'ar' ? 'مراجعة الصيدلي' : 'Review'],
              [MessageCircle, locale === 'ar' ? 'تأكيد وشات' : 'Confirm & chat'],
              [Truck, locale === 'ar' ? 'تجهيز وتوصيل' : 'Delivery'],
            ].map(([Icon,label],index) => {
              const StepIcon = Icon as typeof UploadCloud;
              return <div className="rx-process-step" key={String(label)}><div>{index === 0 ? <Check size={18}/> : <StepIcon size={19}/>}</div><b>{String(index + 1).padStart(2,'0')}</b><span>{String(label)}</span></div>;
            })}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
        <PrescriptionUploadPanel locale={locale} uploadPrescription={uploadPrescription} />
        <PrescriptionTimeline locale={locale} prescriptions={prescriptions} />
      </div>
    </div>
  );
}

export function CustomerRefillsPage({
  locale,
  medicines,
  refillMedicineIds,
  setRefillMedicineIds,
  refillDay,
  setRefillDay,
  subscriptionActive,
  setSubscriptionActive,
}: {
  locale: Locale;
  medicines: Medicine[];
  refillMedicineIds: string[];
  setRefillMedicineIds: (ids: string[]) => void;
  refillDay: string;
  setRefillDay: (day: string) => void;
  subscriptionActive: boolean;
  setSubscriptionActive: (active: boolean) => void;
}) {
  const refillTotal = medicines
    .filter((medicine) => refillMedicineIds.includes(medicine.id))
    .reduce((sum, medicine) => sum + medicine.price, 0);

  const toggleRefillMedicine = (id: string) => {
    setRefillMedicineIds(
      refillMedicineIds.includes(id)
        ? refillMedicineIds.filter((item) => item !== id)
        : [...refillMedicineIds, id],
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <div className="mb-9 text-center">
        <span className="eyebrow">{locale === 'ar' ? 'اشتراك الدواء الشهري' : 'Monthly medicine subscription'}</span>
        <h1 className="mt-2 text-3xl font-black text-[#153e36]">{locale === 'ar' ? 'دواءك الشهري من غير ما تفتكر' : 'Monthly medicine without the reminders'}</h1>
        <p className="mt-3 font-semibold text-[#71857e]">{locale === 'ar' ? 'اختار الدواء والميعاد مرة واحدة، وإحنا نفتكرك قبل التحضير والتوصيل.' : 'Choose medicine and date once; we remind you before preparation and delivery.'}</p>
      </div>
      <div className="subscription-process mb-8">
        {[[1,locale==='ar'?'اختار أدويتك':'Choose medicines'],[2,locale==='ar'?'حدد يوم التوصيل':'Set delivery day'],[3,locale==='ar'?'راجع الإجمالي':'Review total'],[4,locale==='ar'?'فعّل الاشتراك':'Activate']].map(([n,label])=><div key={String(label)}><b>{n}</b><span>{label}</span></div>)}
      </div>
      <RefillPanel
        locale={locale}
        medicines={medicines}
        refillMedicineIds={refillMedicineIds}
        toggleRefillMedicine={toggleRefillMedicine}
        refillDay={refillDay}
        setRefillDay={setRefillDay}
        refillTotal={refillTotal}
        subscriptionActive={subscriptionActive}
        setSubscriptionActive={setSubscriptionActive}
      />
    </div>
  );
}

export function CustomerTrackingPage({
  locale,
  prescriptions,
}: {
  locale: Locale;
  prescriptions: Prescription[];
}) {
  return (
    <div className="pt-8">
      <PrescriptionTimeline locale={locale} prescriptions={prescriptions} />
    </div>
  );
}
