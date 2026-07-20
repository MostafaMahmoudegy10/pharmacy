import { motion } from 'framer-motion';
import { BadgeCheck, FileImage, Headphones, Pill, RefreshCcw, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import type { Locale } from '../../../types/pharmacy';

const copy = {
  ar: {
    eyebrow: 'الخدمات',
    title: 'كل خدمة ليها مكان واضح',
    description: 'اطلب أدوية، ارفع روشتة، تابع الاشتراك، أو كلم الصيدلي من نفس الصفحة.',
    services: [
      {
        title: 'طلب أدوية',
        detail: 'بحث سريع وسلة واضحة قبل تأكيد التوصيل.',
        to: '/customer/products',
        accent: 'bg-emerald-50 text-[#0f7f6d]',
        icon: Pill,
      },
      {
        title: 'رفع روشتة',
        detail: 'الصيدلي يراجع المتاح والبدائل قبل الدفع.',
        to: '/customer/prescription',
        accent: 'bg-sky-50 text-[#166a9f]',
        icon: FileImage,
      },
      {
        title: 'اشتراك شهري',
        detail: 'أدوية المتابعة تتجهز في يوم ثابت كل شهر.',
        to: '/customer/refills',
        accent: 'bg-violet-50 text-[#6d4cc9]',
        icon: RefreshCcw,
      },
      {
        title: 'توصيل وتحصيل',
        detail: 'الفاتورة والباقي ظاهرين بوضوح عند التسليم.',
        to: '/customer/tracking',
        accent: 'bg-amber-50 text-[#a16207]',
        icon: Truck,
      },
    ],
    badges: ['صيدلية مرخصة', 'مراجعة صيدلي', 'دفع عند الاستلام', 'توصيل داخل القاهرة'],
  },
  en: {
    eyebrow: 'Services',
    title: 'Every service has a clear place',
    description: 'Order medicines, upload a prescription, manage refills, or follow up with the pharmacist.',
    services: [
      {
        title: 'Medicine orders',
        detail: 'Fast search and a clean cart before delivery confirmation.',
        to: '/customer/products',
        accent: 'bg-emerald-50 text-[#0f7f6d]',
        icon: Pill,
      },
      {
        title: 'Prescription upload',
        detail: 'The pharmacist reviews availability and alternatives first.',
        to: '/customer/prescription',
        accent: 'bg-sky-50 text-[#166a9f]',
        icon: FileImage,
      },
      {
        title: 'Monthly refills',
        detail: 'Recurring medicines prepared on a fixed monthly day.',
        to: '/customer/refills',
        accent: 'bg-violet-50 text-[#6d4cc9]',
        icon: RefreshCcw,
      },
      {
        title: 'Delivery and cash',
        detail: 'Invoice and change are clear at handoff.',
        to: '/customer/tracking',
        accent: 'bg-amber-50 text-[#a16207]',
        icon: Truck,
      },
    ],
    badges: ['Licensed pharmacy', 'Pharmacist review', 'Cash on delivery', 'Cairo delivery'],
  },
};

const MotionLink = motion.create(Link);

export function CustomerServices({ locale }: { locale: Locale }) {
  const text = copy[locale];

  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          className="relative min-h-[360px] overflow-hidden rounded-lg border border-[#d7e8e2] bg-[#123d35] p-5 text-white shadow-xl shadow-emerald-950/10"
        >
          <img
            src="/rxflow-pharmacy-team.png"
            alt=""
            className="absolute inset-0 size-full object-cover opacity-52"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#092d28] via-[#0f5f52]/78 to-[#0f7f6d]/34" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="grid size-12 place-items-center rounded-lg bg-white text-[#0f7f6d]">
                <Headphones size={24} />
              </div>
              <h2 className="mt-5 max-w-md text-3xl font-black leading-tight">
                {locale === 'ar' ? 'الصيدلي قريب منك قبل الطلب وبعده' : 'The pharmacist stays close before and after ordering'}
              </h2>
              <p className="mt-3 max-w-md text-sm font-semibold leading-7 text-emerald-50">
                {locale === 'ar'
                  ? 'العميل يشوف المسار كامل: طلب، مراجعة، تجهيز، وتوصيل.'
                  : 'Customers see the full path: order, review, preparation, and delivery.'}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {text.badges.map((badge) => (
                <span key={badge} className="inline-flex min-h-8 items-center gap-2 rounded-md bg-white/14 px-3 text-xs font-black backdrop-blur-md">
                  <BadgeCheck size={14} />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </motion.article>

        <div>
          <SectionHeading
            eyebrow={text.eyebrow}
            title={text.title}
            description={text.description}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {text.services.map((service, index) => {
              const Icon = service.icon;
              return (
                <MotionLink
                  key={service.title}
                  to={service.to}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.24 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="group min-h-[170px] rounded-lg border border-[#d7e8e2] bg-white p-4 shadow-sm transition hover:border-[#0f7f6d] hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`grid size-12 place-items-center rounded-lg ${service.accent}`}>
                      <Icon size={23} />
                    </div>
                    <span className="h-2 w-12 rounded-md bg-[#d7e8e2] transition group-hover:bg-[#0f7f6d]" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[#173d36]">{service.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-7 text-[#637b73]">{service.detail}</p>
                </MotionLink>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
