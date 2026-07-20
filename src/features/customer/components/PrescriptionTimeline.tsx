import { motion } from 'framer-motion';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Locale, Prescription } from '../../../types/pharmacy';
import {
  prescriptionNotes,
  prescriptionResponse,
  prescriptionStatusLabel,
} from '../../../utils/pharmacy';

const copy = {
  ar: {
    eyebrow: 'متابعة',
    title: 'ردود الصيدلي على الروشتات',
    description: 'كل روشتة لها حالة واضحة ورد مختصر بدل ما العميل يفضل مش عارف الطلب وصل لفين.',
  },
  en: {
    eyebrow: 'Tracking',
    title: 'Pharmacist replies',
    description: 'Each prescription has a clear state and a concise reply, so the customer knows what happens next.',
  },
};

export function PrescriptionTimeline({
  locale,
  prescriptions,
}: {
  locale: Locale;
  prescriptions: Prescription[];
}) {
  const text = copy[locale];

  return (
    <section id="tracking" className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
      <SectionHeading
        eyebrow={text.eyebrow}
        title={text.title}
        description={text.description}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {prescriptions.slice(0, 4).map((prescription) => {
          const response = prescriptionResponse(prescription, locale);
          return (
            <motion.article
              key={prescription.id}
              layout
              className="rounded-lg border border-[#d7e8e2] bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[#0f7f6d]">{prescription.id}</p>
                  <h3 className="mt-1 text-lg font-black text-[#173d36]">{prescription.customer}</h3>
                </div>
                <StatusBadge>{prescriptionStatusLabel(prescription.status, locale)}</StatusBadge>
              </div>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#60756f]">
                {prescriptionNotes(prescription, locale)}
              </p>
              {response && (
                <div className="mt-3 rounded-lg bg-[#edf7f3] p-3 text-sm font-bold leading-7 text-[#0e5f52]">
                  {response}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
