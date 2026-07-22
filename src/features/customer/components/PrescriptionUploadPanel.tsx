import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, UploadCloud } from 'lucide-react';
import { InputField } from '../../../components/ui/InputField';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import type { Locale } from '../../../types/pharmacy';

type PrescriptionPayload = {
  customer: string;
  phone: string;
  area: string;
  address: string;
  locationUrl: string;
  notes: string;
  fileName: string;
};

const copy = {
  ar: {
    eyebrow: 'الروشتة',
    title: 'رفع ومراجعة من الصيدلي',
    description: 'العميل يرفع الصورة والصيدلي يرد بالمتاح والبدائل قبل تأكيد الطلب.',
    customer: 'اسم العميل',
    phone: 'الموبايل',
    area: 'المنطقة',
    notes: 'ملاحظات الروشتة',
    notesPlaceholder: 'اكتب أي ملاحظة للصيدلي، طريقة الدفع، أو ميعاد التسليم...',
    upload: 'اختيار صورة الروشتة',
    submit: 'إرسال للصيدلي',
    placeholders: {
      customer: 'مريم حسن',
      phone: '0127 008 4411',
      area: 'المعادي',
    },
  },
  en: {
    eyebrow: 'Prescription',
    title: 'Upload and pharmacist review',
    description: 'The customer uploads the file, then the pharmacist confirms availability and alternatives.',
    customer: 'Customer name',
    phone: 'Phone',
    area: 'Area',
    notes: 'Prescription notes',
    notesPlaceholder: 'Add delivery time, payment preference, or notes for the pharmacist...',
    upload: 'Choose prescription image',
    submit: 'Send to pharmacist',
    placeholders: {
      customer: 'Mariam Hassan',
      phone: '0127 008 4411',
      area: 'Maadi',
    },
  },
};

export function PrescriptionUploadPanel({
  locale,
  uploadPrescription,
}: {
  locale: Locale;
  uploadPrescription: (payload: PrescriptionPayload) => void;
}) {
  const [form, setForm] = useState<PrescriptionPayload>({
    customer: '',
    phone: '',
    area: '',
    address: '',
    locationUrl: '',
    notes: '',
    fileName: '',
  });
  const text = copy[locale];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    uploadPrescription(form);
    setForm({ ...form, notes: '', fileName: '' });
  };

  return (
    <article id="prescription" className="rx-upload-card">
      <div className="rx-upload-visual">
        <img src="/rxflow-prescription-upload.png" alt="" />
        <div><UploadCloud size={28}/><b>{locale === 'ar' ? 'صورة واضحة = مراجعة أسرع' : 'A clear image means a faster review'}</b><small>{locale === 'ar' ? 'PNG, JPG أو PDF' : 'PNG, JPG or PDF'}</small></div>
      </div>
      <div className="p-6 md:p-8">
          <SectionHeading
            eyebrow={text.eyebrow}
            title={text.title}
            description={text.description}
            compact
          />
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <InputField
                label={text.customer}
                value={form.customer}
                placeholder={text.placeholders.customer}
                onChange={(value) => setForm({ ...form, customer: value })}
              />
              <InputField
                label={text.phone}
                value={form.phone}
                placeholder={text.placeholders.phone}
                onChange={(value) => setForm({ ...form, phone: value })}
              />
              <InputField
                label={text.area}
                value={form.area}
                placeholder={text.placeholders.area}
                onChange={(value) => setForm({ ...form, area: value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InputField label={locale === 'ar' ? 'العنوان بالتفصيل' : 'Full address'} value={form.address} placeholder={locale === 'ar' ? 'رقم العمارة، الشارع، علامة مميزة' : 'Building, street, landmark'} onChange={(value) => setForm({ ...form, address: value })} />
              <InputField label={locale === 'ar' ? 'رابط اللوكيشن من Google Maps' : 'Google Maps location link'} value={form.locationUrl} placeholder="https://maps.google.com/..." onChange={(value) => setForm({ ...form, locationUrl: value })} />
            </div>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#49645d]">{text.notes}</span>
              <textarea
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                rows={3}
                placeholder={text.notesPlaceholder}
                className="min-h-28 rounded-xl border border-[#d7e8e2] bg-[#fbfdfc] p-4 text-sm font-semibold leading-7 text-[#173d36] outline-none transition placeholder:text-[#8aa098] focus:border-[#0f7f6d] focus:bg-white focus:ring-4 focus:ring-[#0f7f6d]/5"
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="upload-dropzone">
                <UploadCloud size={18} />
                {form.fileName || text.upload}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(event) => setForm({ ...form, fileName: event.target.files?.[0]?.name || '' })}
                />
              </label>
              <button
                type="submit"
                className="primary-btn min-h-14 px-7"
              >
                <ArrowRight size={18} />
                {text.submit}
              </button>
            </div>
          </form>
      </div>
    </article>
  );
}
