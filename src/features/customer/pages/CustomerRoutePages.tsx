import { CartPanel } from '../components/CartPanel';
import { CustomerServices } from '../components/CustomerServices';
import { PrescriptionTimeline } from '../components/PrescriptionTimeline';
import { PrescriptionUploadPanel } from '../components/PrescriptionUploadPanel';
import { ProductCarousel } from '../components/ProductCarousel';
import { RefillPanel } from '../components/RefillPanel';
import { ServiceProcessCarousel } from '../components/ServiceProcessCarousel';
import { Search } from 'lucide-react';
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
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_0.9fr] lg:px-8">
      <PrescriptionUploadPanel locale={locale} uploadPrescription={uploadPrescription} />
      <PrescriptionTimeline locale={locale} prescriptions={prescriptions} />
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
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
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
