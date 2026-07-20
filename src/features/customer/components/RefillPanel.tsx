import { BellRing } from 'lucide-react';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import type { Locale, Medicine } from '../../../types/pharmacy';
import { categoryLabel, formatCurrency, medicineName } from '../../../utils/pharmacy';

const copy = {
  ar: {
    eyebrow: 'الاشتراك',
    title: 'روشتة شهرية بتذكير',
    description: 'حدد أدوية المتابعة ويوم التسليم، وسيب التذكير والتحضير للنظام.',
    active: 'نشط',
    paused: 'متوقف',
    day: 'يوم التوصيل',
    dayLabel: 'يوم',
    total: 'إجمالي تقريبي كل شهر',
  },
  en: {
    eyebrow: 'Refills',
    title: 'Monthly prescription reminders',
    description: 'Choose recurring medicines and the delivery day. The system keeps the flow visible.',
    active: 'Active',
    paused: 'Paused',
    day: 'Delivery day',
    dayLabel: 'Day',
    total: 'Estimated monthly total',
  },
};

export function RefillPanel({
  locale,
  medicines,
  refillMedicineIds,
  toggleRefillMedicine,
  refillDay,
  setRefillDay,
  refillTotal,
  subscriptionActive,
  setSubscriptionActive,
}: {
  locale: Locale;
  medicines: Medicine[];
  refillMedicineIds: string[];
  toggleRefillMedicine: (id: string) => void;
  refillDay: string;
  setRefillDay: (day: string) => void;
  refillTotal: number;
  subscriptionActive: boolean;
  setSubscriptionActive: (active: boolean) => void;
}) {
  const text = copy[locale];
  const separator = locale === 'ar' ? '، ' : ', ';

  return (
    <article id="refills" className="rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          eyebrow={text.eyebrow}
          title={text.title}
          description={text.description}
          compact
        />
        <button
          type="button"
          onClick={() => setSubscriptionActive(!subscriptionActive)}
          className={[
            'inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-xs font-black transition',
            subscriptionActive ? 'bg-[#edf7f3] text-[#0f7f6d]' : 'bg-[#fff1f1] text-[#ba3b3b]',
          ].join(' ')}
        >
          <BellRing size={16} />
          {subscriptionActive ? text.active : text.paused}
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[150px_1fr]">
        <label className="grid gap-2">
          <span className="text-xs font-black text-[#49645d]">{text.day}</span>
          <select
            value={refillDay}
            onChange={(event) => setRefillDay(event.target.value)}
            className="min-h-12 rounded-md border border-[#d7e8e2] bg-white px-3 text-sm font-black text-[#173d36] outline-none transition focus:border-[#0f7f6d]"
          >
            {['01', '05', '10', '15', '20', '25'].map((day) => (
              <option key={day} value={day}>{text.dayLabel} {day}</option>
            ))}
          </select>
        </label>
        <div className="rounded-lg bg-[#f7faf8] p-4">
          <p className="text-xs font-black text-[#6c807a]">{text.total}</p>
          <p className="mt-1 text-3xl font-black text-[#0f7f6d]">
            {formatCurrency(refillTotal, locale)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto pr-1">
        {medicines.filter((medicine) => medicine.requiresRx).map((medicine) => (
          <label
            key={medicine.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-[#d7e8e2] p-3 transition hover:border-[#0f7f6d]"
          >
            <span className="min-w-0">
              <span className="block font-black text-[#173d36]">{medicineName(medicine, locale)}</span>
              <span className="text-xs font-bold text-[#748780]">
                {categoryLabel(medicine.category, locale)}{separator}{formatCurrency(medicine.price, locale)}
              </span>
            </span>
            <input
              type="checkbox"
              checked={refillMedicineIds.includes(medicine.id)}
              onChange={() => toggleRefillMedicine(medicine.id)}
              className="size-5 accent-[#0f7f6d]"
            />
          </label>
        ))}
      </div>
    </article>
  );
}
