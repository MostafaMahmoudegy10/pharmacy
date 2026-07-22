import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { BellRing, Boxes, ClipboardList, FileImage, MessageCircle, Plus, Search } from 'lucide-react';
import { categories } from '../../../data/pharmacyData';
import { InputField } from '../../../components/ui/InputField';
import { MetricCard } from '../../../components/ui/MetricCard';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { WorkspaceHero } from '../../../components/ui/WorkspaceHero';
import type { Locale, Medicine, Prescription } from '../../../types/pharmacy';
import {
  categoryLabel,
  formatCurrency,
  normalize,
  prescriptionArea,
  prescriptionItemAlternative,
  prescriptionItemName,
  prescriptionNotes,
  prescriptionRecommendation,
  prescriptionResponse,
  prescriptionStatusLabel,
  prescriptionUploadedAt,
} from '../../../utils/pharmacy';

const copy = {
  ar: {
    title: 'مكتب صيدلي منظم للروشتات والمخزون',
    description: 'كل روشتة تظهر بحالتها، الأدوية المطلوبة، البدائل، ورد واضح يرجع للعميل.',
    queue: 'طابور الروشتات',
    queueSearch: 'ابحث في الروشتات...',
    pending: 'روشتات منتظرة',
    pendingDetail: 'تحتاج رد واضح للعميل',
    inventoryValue: 'قيمة المخزون',
    inventoryDetail: 'صنف داخل السيستم',
    lowStock: 'نواقص حرجة',
    lowStockDetail: 'أصناف تحتاج طلب توريد',
    file: 'ملف الروشتة',
    qty: 'كمية',
    noAlternative: 'لا توجد بدائل مسجلة',
    reply: 'رد الصيدلي للعميل',
    recommendation: 'الترشيحات والبدائل',
    send: 'إرسال الرد للعميل',
    defaultReply: 'تمت مراجعة الروشتة. المتاح هيتجهز، والناقص له بدائل مناسبة بعد موافقة العميل.',
    defaultRecommendation: 'البدائل المقترحة لا تستخدم إلا بعد تأكيد الصيدلي وموافقة العميل.',
    noAlternativeFallback: 'الصيدلي هيقترح بديل مناسب',
    inventory: 'المخزون',
    addMedicine: 'إضافة دواء جديد',
    arName: 'الاسم العربي',
    name: 'الاسم التجاري',
    ingredient: 'المادة الفعالة',
    category: 'القسم',
    price: 'السعر',
    stock: 'الكمية',
    branch: 'الفرع عربي',
    branchEn: 'الفرع إنجليزي',
    requiresRx: 'يحتاج روشتة',
    add: 'إضافة للمخزون',
  },
  en: {
    title: 'A focused pharmacist desk for prescriptions and stock',
    description: 'Each prescription shows state, required items, alternatives, and the reply sent back to the customer.',
    queue: 'Prescription queue',
    queueSearch: 'Search prescriptions...',
    pending: 'Pending prescriptions',
    pendingDetail: 'Need a clear customer reply',
    inventoryValue: 'Inventory value',
    inventoryDetail: 'items in the system',
    lowStock: 'Critical shortages',
    lowStockDetail: 'Items that need restocking',
    file: 'Prescription file',
    qty: 'Qty',
    noAlternative: 'No alternative recorded',
    reply: 'Pharmacist reply',
    recommendation: 'Recommendations and alternatives',
    send: 'Send customer reply',
    defaultReply: 'Prescription reviewed. Available items will be prepared, and missing items have suggested alternatives after approval.',
    defaultRecommendation: 'Suggested alternatives should only be used after pharmacist confirmation and customer approval.',
    noAlternativeFallback: 'The pharmacist will suggest a suitable alternative',
    inventory: 'Inventory',
    addMedicine: 'Add new medicine',
    arName: 'Arabic name',
    name: 'Trade name',
    ingredient: 'Active ingredient',
    category: 'Category',
    price: 'Price',
    stock: 'Stock',
    branch: 'Branch Arabic',
    branchEn: 'Branch English',
    requiresRx: 'Requires Rx',
    add: 'Add to inventory',
  },
};

export function PharmacistWorkspace({
  locale,
  medicines,
  prescriptions,
  activePrescription,
  selectedPrescriptionId,
  setSelectedPrescriptionId,
  sendPharmacistReply,
  addMedicine,
  page = 'overview',
}: {
  locale: Locale;
  medicines: Medicine[];
  prescriptions: Prescription[];
  activePrescription: Prescription;
  selectedPrescriptionId: string;
  setSelectedPrescriptionId: (id: string) => void;
  sendPharmacistReply: (id: string, response: string, recommendation: string, availability: Record<string, boolean>) => void;
  addMedicine: (medicine: Omit<Medicine, 'id' | 'popularity'>) => void;
  page?: 'overview' | 'queue' | 'review' | 'inventory';
}) {
  const text = copy[locale];
  const separator = locale === 'ar' ? '، ' : ', ';
  const [response, setResponse] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [rxQuery, setRxQuery] = useState('');
  const [newMedicine, setNewMedicine] = useState({
    arName: '',
    name: '',
    ingredient: '',
    category: 'عناية',
    price: '80',
    stock: '12',
    branch: 'فرع الدقي',
    branchEn: 'Dokki branch',
    requiresRx: true,
  });

  useEffect(() => {
    setResponse(prescriptionResponse(activePrescription, locale) || text.defaultReply);
    setRecommendation(prescriptionRecommendation(activePrescription, locale) || text.defaultRecommendation);
    setAvailability(
      Object.fromEntries(activePrescription.items.map((item) => [item.name, item.available])),
    );
  }, [activePrescription, locale, text.defaultRecommendation, text.defaultReply]);

  const inventoryValue = medicines.reduce((sum, medicine) => sum + medicine.price * medicine.stock, 0);
  const lowStock = medicines.filter((medicine) => medicine.stock <= 5);
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const query = normalize(rxQuery);
    if (!query) return true;
    return normalize([
      prescription.id,
      prescription.customer,
      prescription.phone,
      prescription.area,
      prescription.areaEn,
      prescriptionNotes(prescription, locale),
      prescription.items.map((item) => `${item.name} ${item.nameEn}`).join(' '),
    ].join(' ')).includes(query);
  });

  const submitNewMedicine = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newMedicine.arName.trim() && !newMedicine.name.trim()) return;
    addMedicine({
      arName: newMedicine.arName || newMedicine.name,
      name: newMedicine.name || newMedicine.arName,
      ingredient: newMedicine.ingredient || 'Active ingredient',
      category: newMedicine.category,
      price: Number(newMedicine.price) || 0,
      stock: Number(newMedicine.stock) || 0,
      requiresRx: newMedicine.requiresRx,
      branch: newMedicine.branch,
      branchEn: newMedicine.branchEn,
      tags: [newMedicine.arName, newMedicine.name, newMedicine.ingredient, newMedicine.category],
    });
    setNewMedicine({
      arName: '',
      name: '',
      ingredient: '',
      category: 'عناية',
      price: '80',
      stock: '12',
      branch: 'فرع الدقي',
      branchEn: 'Dokki branch',
      requiresRx: true,
    });
  };

  const showOverview = page === 'overview';
  const showQueue = page === 'queue';
  const showReview = page === 'review';
  const showInventory = page === 'inventory';

  return (
    <div id="staff-home" className="staff-workspace pharmacist-workspace mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:px-8">
      <WorkspaceHero
        role="pharmacist"
        locale={locale}
        title={text.title}
        description={text.description}
      />

      {showOverview && <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={ClipboardList} label={text.pending} value={`${prescriptions.filter((item) => item.status === 'new').length}`} detail={text.pendingDetail} />
        <MetricCard icon={Boxes} label={text.inventoryValue} value={formatCurrency(inventoryValue, locale)} detail={`${medicines.length} ${text.inventoryDetail}`} />
        <MetricCard icon={BellRing} label={text.lowStock} value={`${lowStock.length}`} detail={text.lowStockDetail} />
      </div>}

      {(showQueue || showReview || showInventory) && (
      <div className={showQueue && showReview ? 'grid gap-6 lg:grid-cols-[330px_1fr]' : 'grid gap-6'}>
        {showQueue && (
        <aside id="rx-queue" className="rounded-lg border border-[#d7e8e2] bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2 px-1 text-sm font-black text-[#0f7f6d]">
            <ClipboardList size={18} />
            {text.queue}
          </div>
          <label className="mb-3 flex min-h-11 items-center gap-2 rounded-md border border-[#d7e8e2] px-3">
            <Search size={16} className="text-[#0f7f6d]" />
            <input
              value={rxQuery}
              onChange={(event) => setRxQuery(event.target.value)}
              placeholder={text.queueSearch}
              className="w-full bg-transparent text-sm font-bold text-[#173d36] outline-none placeholder:text-[#8aa098]"
            />
          </label>
          <div className="grid gap-2">
            {filteredPrescriptions.map((prescription) => (
              <button
                key={prescription.id}
                type="button"
                onClick={() => setSelectedPrescriptionId(prescription.id)}
                className={[
                  'rounded-lg border p-3 text-start transition',
                  selectedPrescriptionId === prescription.id
                    ? 'border-[#0f7f6d] bg-[#edf7f3]'
                    : 'border-[#d7e8e2] bg-white hover:border-[#0f7f6d]',
                ].join(' ')}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-black text-[#173d36]">{prescription.customer}</span>
                  <StatusBadge>{prescriptionStatusLabel(prescription.status, locale)}</StatusBadge>
                </span>
                <span className="mt-1 block text-xs font-bold text-[#6f827c]">
                  {prescription.id}{separator}{prescriptionArea(prescription, locale)}
                </span>
              </button>
            ))}
          </div>
        </aside>
        )}

        {(showReview || showInventory) && <div className="grid gap-6">
          {showReview && (
          <article id="rx-review" className="rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black text-[#0f7f6d]">{activePrescription.id}</p>
                <h2 className="mt-1 text-2xl font-black text-[#173d36]">{activePrescription.customer}</h2>
                <p className="mt-1 text-sm font-semibold text-[#667a74]">
                  {activePrescription.phone}{separator}{prescriptionArea(activePrescription, locale)}{separator}{prescriptionUploadedAt(activePrescription, locale)}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-[#edf7f3] px-3 py-2">
                <FileImage className="text-[#0f7f6d]" size={20} />
                <span className="text-sm font-bold text-[#60756f]">{text.file}: {activePrescription.fileName}</span>
              </div>
            </div>

            <p className="mt-4 rounded-lg bg-[#f7faf8] p-3 text-sm font-semibold leading-7 text-[#60756f]">
              {prescriptionNotes(activePrescription, locale)}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {activePrescription.items.map((item) => (
                <label
                  key={item.name}
                  className="flex items-start justify-between gap-3 rounded-lg border border-[#d7e8e2] bg-[#fbfefd] p-3"
                >
                  <span>
                    <span className="block font-black text-[#173d36]">{prescriptionItemName(item, locale)}</span>
                    <span className="mt-1 block text-xs font-bold text-[#6c807a]">
                      {text.qty} {item.qty}{separator}{prescriptionItemAlternative(item, locale) || text.noAlternative}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={availability[item.name] ?? false}
                    onChange={(event) => setAvailability({ ...availability, [item.name]: event.target.checked })}
                    className="mt-1 size-5 accent-[#0f7f6d]"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-black text-[#254a42]">{text.reply}</span>
                <textarea
                  value={response}
                  onChange={(event) => setResponse(event.target.value)}
                  rows={5}
                  className="rounded-md border border-[#d7e8e2] bg-white p-3 text-sm font-semibold leading-7 text-[#173d36] outline-none transition focus:border-[#0f7f6d]"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-black text-[#254a42]">{text.recommendation}</span>
                <textarea
                  value={recommendation}
                  onChange={(event) => setRecommendation(event.target.value)}
                  rows={5}
                  className="rounded-md border border-[#d7e8e2] bg-white p-3 text-sm font-semibold leading-7 text-[#173d36] outline-none transition focus:border-[#0f7f6d]"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => sendPharmacistReply(activePrescription.id, response, recommendation, availability)}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#0f7f6d] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0a5f52]"
            >
              <MessageCircle size={18} />
              {text.send}
            </button>
          </article>
          )}

          {showInventory && (
          <article id="inventory" className="rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-sm">
            <SectionHeading eyebrow={text.inventory} title={text.addMedicine} compact />
            <form onSubmit={submitNewMedicine} className="mt-4 grid gap-3 md:grid-cols-4">
              <InputField label={text.arName} value={newMedicine.arName} onChange={(value) => setNewMedicine({ ...newMedicine, arName: value })} />
              <InputField label={text.name} value={newMedicine.name} onChange={(value) => setNewMedicine({ ...newMedicine, name: value })} />
              <InputField label={text.ingredient} value={newMedicine.ingredient} onChange={(value) => setNewMedicine({ ...newMedicine, ingredient: value })} />
              <label className="grid gap-2">
                <span className="text-xs font-black text-[#49645d]">{text.category}</span>
                <select
                  value={newMedicine.category}
                  onChange={(event) => setNewMedicine({ ...newMedicine, category: event.target.value })}
                  className="min-h-11 rounded-md border border-[#d7e8e2] bg-white px-3 text-sm font-bold text-[#173d36] outline-none transition focus:border-[#0f7f6d]"
                >
                  {categories.filter((item) => item.value !== 'الكل').map((item) => (
                    <option key={item.value} value={item.value}>{categoryLabel(item.value, locale)}</option>
                  ))}
                </select>
              </label>
              <InputField label={text.price} value={newMedicine.price} type="number" onChange={(value) => setNewMedicine({ ...newMedicine, price: value })} />
              <InputField label={text.stock} value={newMedicine.stock} type="number" onChange={(value) => setNewMedicine({ ...newMedicine, stock: value })} />
              <InputField label={text.branch} value={newMedicine.branch} onChange={(value) => setNewMedicine({ ...newMedicine, branch: value })} />
              <InputField label={text.branchEn} value={newMedicine.branchEn} onChange={(value) => setNewMedicine({ ...newMedicine, branchEn: value })} />
              <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d7e8e2] px-3 text-sm font-black text-[#254a42]">
                <input
                  type="checkbox"
                  checked={newMedicine.requiresRx}
                  onChange={(event) => setNewMedicine({ ...newMedicine, requiresRx: event.target.checked })}
                  className="size-5 accent-[#0f7f6d]"
                />
                {text.requiresRx}
              </label>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#123d35] px-4 text-sm font-black text-white transition hover:bg-[#0f7f6d] md:col-span-3"
              >
                <Plus size={18} />
                {text.add}
              </button>
            </form>
          </article>
          )}
        </div>}
      </div>
      )}
    </div>
  );
}
