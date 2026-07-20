import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileImage,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Locale } from '../../../types/pharmacy';

const workflows = {
  ar: [
    {
      id: 'rx',
      title: 'رفع الروشتة',
      eyebrow: 'Prescription Flow',
      image: '/rxflow-prescription-upload.png',
      icon: FileImage,
      steps: [
        ['ارفع الصورة', 'العميل يرفع صورة الروشتة أو PDF ويكتب ملاحظات التسليم.'],
        ['Holding', 'الحالة تبقى قيد المراجعة لحد ما الصيدلي يشوفها.'],
        ['رد الصيدلي', 'الصيدلي يحدد المتاح والناقص والبدائل المقترحة.'],
        ['تأكيد أو رد', 'العميل يؤكد الطلب أو يرد بسؤال قبل التجهيز.'],
      ],
    },
    {
      id: 'refill',
      title: 'اشتراك شهري',
      eyebrow: 'Monthly Care',
      image: '/rxflow-pharmacy-delivery.png',
      icon: RefreshCcw,
      steps: [
        ['اختيار الأدوية', 'حدد أدوية المتابعة المزمنة مرة واحدة.'],
        ['يوم ثابت', 'اختار يوم التسليم الشهري المناسب.'],
        ['تذكير قبلها', 'النظام يجهز تذكير قبل ميعاد الطلب.'],
        ['تأكيد سريع', 'تأكد الكميات أو عدلها قبل ما تتحول للتوصيل.'],
      ],
    },
    {
      id: 'reply',
      title: 'محادثة الصيدلي',
      eyebrow: 'Pharmacist Reply',
      image: '/rxflow-pharmacy-team.png',
      icon: MessageCircle,
      steps: [
        ['سؤال واضح', 'العميل يسأل عن بديل أو جرعة أو طريقة دفع.'],
        ['رد متخصص', 'الصيدلي يرد برسالة منظمة تظهر في المتابعة.'],
        ['اختيار العميل', 'العميل يوافق أو يطلب تعديل قبل الدفع.'],
        ['تحويل لطلب', 'بعد الموافقة الطلب يدخل التحضير والتوصيل.'],
      ],
    },
    {
      id: 'delivery',
      title: 'التوصيل والتحصيل',
      eyebrow: 'Delivery Flow',
      image: '/rxflow-pharmacy-hero.png',
      icon: Truck,
      steps: [
        ['تجهيز الطلب', 'الأصناف تتقفل بالفاتورة النهائية.'],
        ['تعيين مندوب', 'الأدمن أو السيستم يحدد أقرب مندوب.'],
        ['في الطريق', 'العميل يشوف حالة الطلب بدون غموض.'],
        ['تحصيل وباقي', 'المندوب يسجل المدفوع والباقي المطلوب يرجع.'],
      ],
    },
  ],
  en: [
    {
      id: 'rx',
      title: 'Prescription upload',
      eyebrow: 'Prescription Flow',
      image: '/rxflow-prescription-upload.png',
      icon: FileImage,
      steps: [
        ['Upload file', 'The customer uploads an image or PDF and adds delivery notes.'],
        ['Holding', 'The state stays under review until the pharmacist checks it.'],
        ['Pharmacist reply', 'The pharmacist marks available, missing, and suggested alternatives.'],
        ['Confirm or reply', 'The customer confirms the order or asks a follow-up question.'],
      ],
    },
    {
      id: 'refill',
      title: 'Monthly refills',
      eyebrow: 'Monthly Care',
      image: '/rxflow-pharmacy-delivery.png',
      icon: RefreshCcw,
      steps: [
        ['Select medicines', 'Choose chronic care medicines once.'],
        ['Fixed day', 'Pick the monthly delivery day.'],
        ['Reminder first', 'The system prepares a reminder before the due date.'],
        ['Quick confirm', 'Confirm or adjust quantities before delivery.'],
      ],
    },
    {
      id: 'reply',
      title: 'Pharmacist conversation',
      eyebrow: 'Pharmacist Reply',
      image: '/rxflow-pharmacy-team.png',
      icon: MessageCircle,
      steps: [
        ['Clear question', 'The customer asks about alternatives, doses, or payment.'],
        ['Specialist reply', 'The pharmacist replies in a structured tracking message.'],
        ['Customer choice', 'The customer accepts or requests edits before payment.'],
        ['Move to order', 'After approval, the order moves into preparation and delivery.'],
      ],
    },
    {
      id: 'delivery',
      title: 'Delivery and collection',
      eyebrow: 'Delivery Flow',
      image: '/rxflow-pharmacy-hero.png',
      icon: Truck,
      steps: [
        ['Prepare order', 'Items are locked with the final invoice.'],
        ['Assign courier', 'Admin or system assigns the nearest courier.'],
        ['On the way', 'The customer sees a clear delivery state.'],
        ['Cash and change', 'The courier records paid amount and change due.'],
      ],
    },
  ],
};

const copy = {
  ar: {
    eyebrow: 'رحلة الخدمة',
    title: 'كل فيتشر مفهومة من أول ضغطة لحد التسليم',
    description: 'بدل ما العميل يتوه، كل خدمة بتظهر كرحلة قصيرة: تعمل إيه، تستنى إيه، وإمتى تؤكد.',
    previous: 'السابق',
    next: 'التالي',
    status: 'الحالة الآن',
    holding: 'Holding',
    ready: 'جاهز للتأكيد',
  },
  en: {
    eyebrow: 'Service Journey',
    title: 'Every feature is clear from first tap to delivery',
    description: 'Each service is shown as a short journey: what to do, what to wait for, and when to confirm.',
    previous: 'Previous',
    next: 'Next',
    status: 'Current state',
    holding: 'Holding',
    ready: 'Ready to confirm',
  },
};

export function ServiceProcessCarousel({ locale }: { locale: Locale }) {
  const [workflowIndex, setWorkflowIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const text = copy[locale];
  const items = workflows[locale];
  const active = items[workflowIndex];
  const Icon = active.icon;
  const activeStep = active.steps[stepIndex];

  const goStep = (direction: number) => {
    setStepIndex((current) => (current + direction + active.steps.length) % active.steps.length);
  };

  const chooseWorkflow = (index: number) => {
    setWorkflowIndex(index);
    setStepIndex(0);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <SectionHeading
        eyebrow={text.eyebrow}
        title={text.title}
        description={text.description}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="grid gap-2">
          {items.map((item, index) => {
            const ItemIcon = item.icon;
            const selected = index === workflowIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseWorkflow(index)}
                className={[
                  'flex min-h-20 items-center gap-3 rounded-lg border p-3 text-start transition',
                  selected
                    ? 'border-[#0f7f6d] bg-[#0f7f6d] text-white shadow-lg shadow-emerald-900/10'
                    : 'border-[#d7e8e2] bg-white text-[#173d36] hover:border-[#0f7f6d] hover:bg-[#edf7f3]',
                ].join(' ')}
              >
                <span className={selected ? 'grid size-11 place-items-center rounded-lg bg-white/16' : 'grid size-11 place-items-center rounded-lg bg-[#edf7f3] text-[#0f7f6d]'}>
                  <ItemIcon size={21} />
                </span>
                <span>
                  <span className="block text-sm font-black">{item.title}</span>
                  <span className={selected ? 'mt-1 block text-xs font-bold text-emerald-50' : 'mt-1 block text-xs font-bold text-[#71847e]'}>
                    {item.eyebrow}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <article className="float-card overflow-hidden rounded-lg border border-[#d7e8e2] bg-white shadow-xl shadow-emerald-950/8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[360px] overflow-hidden bg-[#123d35]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${active.id}-${active.image}`}
                  src={active.image}
                  alt=""
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.42 }}
                  className="absolute inset-0 size-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#082a26]/94 via-[#0d3b34]/28 to-transparent" />
              <div className="absolute bottom-4 start-4 end-4">
                <div className="inline-flex min-h-9 items-center gap-2 rounded-md bg-white px-3 text-xs font-black text-[#0f7f6d]">
                  <Icon size={16} />
                  {active.title}
                </div>
                <h3 className="mt-3 max-w-md text-3xl font-black leading-tight text-white">
                  {activeStep[0]}
                </h3>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[#0f7f6d]">{text.status}</p>
                  <h3 className="mt-1 text-3xl font-black text-[#123d35]">{active.title}</h3>
                </div>
                <StatusBadge tone={stepIndex === 1 ? 'amber' : stepIndex >= 2 ? 'green' : 'blue'}>
                  {stepIndex === 1 ? text.holding : text.ready}
                </StatusBadge>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active.id}-${stepIndex}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 rounded-lg border border-[#d7e8e2] bg-[#f7fbf8] p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-white text-[#0f7f6d] shadow-sm">
                      {stepIndex === 1 ? <Clock3 size={21} /> : stepIndex >= 2 ? <CheckCircle2 size={21} /> : <ShieldCheck size={21} />}
                    </div>
                    <div>
                      <p className="text-xl font-black text-[#173d36]">{activeStep[0]}</p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-[#60756f]">{activeStep[1]}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 grid gap-3">
                {active.steps.map((step, index) => (
                  <button
                    key={step[0]}
                    type="button"
                    onClick={() => setStepIndex(index)}
                    className={[
                      'flex items-center gap-3 rounded-lg border p-3 text-start transition',
                      index === stepIndex
                        ? 'border-[#0f7f6d] bg-[#edf7f3]'
                        : 'border-[#e4f0ec] bg-white hover:border-[#0f7f6d]',
                    ].join(' ')}
                  >
                    <span className={index === stepIndex ? 'grid size-8 place-items-center rounded-md bg-[#0f7f6d] text-xs font-black text-white' : 'grid size-8 place-items-center rounded-md bg-[#edf7f3] text-xs font-black text-[#0f7f6d]'}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-black text-[#173d36]">{step[0]}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => goStep(-1)}
                  className="grid size-10 place-items-center rounded-md border border-[#d7e8e2] text-[#0f7f6d] transition hover:bg-[#edf7f3]"
                  aria-label={text.previous}
                  title={text.previous}
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => goStep(1)}
                  className="grid size-10 place-items-center rounded-md bg-[#0f7f6d] text-white transition hover:bg-[#0a5f52]"
                  aria-label={text.next}
                  title={text.next}
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
