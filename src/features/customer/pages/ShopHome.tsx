import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Bandage, Clock3, HeartPulse, MapPin,
  MessageCircle, Search, ShieldCheck, ShoppingBag, Sparkles, Stethoscope, UploadCloud,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CartItem, Locale, Medicine, Prescription } from '../../../types/pharmacy';
import { formatCurrency, medicineName } from '../../../utils/pharmacy';

const copy = {
  ar: {
    badge: 'صيدليتك أقرب مما تتخيل', title: 'كل اللي تحتاجه لصحتك،', accent: 'يوصلك لحد البيت.',
    description: 'دواء، روشتة أو خدمة منزلية — صيدلي حقيقي معاك من أول السؤال لحد ما الطلب يوصل بابك.',
    search: 'دور على دواء أو اكتب العرض اللي حاسس بيه...', shop: 'تسوّق الأدوية', rx: 'ارفع روشتتك',
    delivery: 'توصيل سريع', deliveryD: 'في القاهرة والجيزة', pharmacist: 'صيدلي متاح', pharmacistD: 'للمراجعة والاستشارة', secure: 'طلب آمن', secureD: 'خصوصيتك أولويتنا',
    popularEyebrow: 'الأكثر طلبًا', popular: 'الناس بتطلب إيه اليومين دول؟', popularD: 'منتجات أساسية ومتوفرة للتوصيل السريع.', viewAll: 'شوف كل المنتجات',
    quickEyebrow: 'محتاج حاجة بسرعة؟', quick: 'اختار اللي مضايقك وسيب الباقي علينا', quickD: 'حلول سريعة للحاجات اليومية من غير لف كتير.', orderNow: 'اطلب دلوقتي',
    wound: 'جرح بسيط؟', woundD: 'مطهر، شاش ولاصق طبي في باكدج واحدة.', cold: 'برد وصداع؟', coldD: 'اختيارات مناسبة للأعراض الشائعة.', baby: 'احتياجات البيبي', babyD: 'حفاضات وعناية يومية لحد البيت.',
    homeEyebrow: 'خدمات منزلية', home: 'الرعاية جايالك لحد البيت', homeD: 'احجز زيارة سريعة لمتابعة مؤشراتك الحيوية بأمان.', pressure: 'قياس ضغط', sugar: 'قياس سكر', injection: 'حقن وتغيير جروح', book: 'احجز الخدمة', from: 'تبدأ من',
    howEyebrow: 'ببساطة ومن غير تعقيد', how: 'طلبك في 3 خطوات', steps: [['اختار أو ارفع', 'دور على الدواء أو صوّر الروشتة.'], ['الصيدلي يراجع', 'نتأكد من المتاح والبدائل معاك.'], ['يوصلك بسرعة', 'تابع الطلب لحد باب البيت.']],
    about: 'صيدلية تهتم بالإنسان قبل الطلب', aboutD: 'هدفنا نخلي الوصول للدواء والرعاية اليومية أسهل، أوضح وأقرب. كل روشتة بيراجعها صيدلي، وكل طلب تقدر تتابعه خطوة بخطوة.', visit: 'زور أقرب فرع', chat: 'كلم الصيدلي', location: 'القاهرة، مصر', hours: 'يوميًا من 8 ص إلى 12 م',
  },
  en: {
    badge: 'Your pharmacy is closer than ever', title: 'Everything your health needs,', accent: 'delivered to your door.',
    description: 'Medicine, prescriptions, and home care — a real pharmacist supports you from question to doorstep.',
    search: 'Search medicine or describe a symptom...', shop: 'Shop medicines', rx: 'Upload prescription',
    delivery: 'Fast delivery', deliveryD: 'Across Cairo & Giza', pharmacist: 'Pharmacist available', pharmacistD: 'For review and advice', secure: 'Secure orders', secureD: 'Privacy comes first',
    popularEyebrow: 'Most ordered', popular: 'What people are ordering now', popularD: 'Everyday essentials ready for quick delivery.', viewAll: 'View all products',
    quickEyebrow: 'Need something quickly?', quick: 'Tell us what is bothering you', quickD: 'Simple bundles for everyday needs.', orderNow: 'Order now',
    wound: 'Small wound?', woundD: 'Antiseptic, gauze and medical tape together.', cold: 'Cold or headache?', coldD: 'Options for common daily symptoms.', baby: 'Baby essentials', babyD: 'Diapers and everyday care delivered.',
    homeEyebrow: 'Home services', home: 'Care that comes to you', homeD: 'Book a quick home visit to check your vital signs safely.', pressure: 'Blood pressure', sugar: 'Blood sugar', injection: 'Injections & dressings', book: 'Book service', from: 'From',
    howEyebrow: 'No complications', how: 'Your order in 3 steps', steps: [['Choose or upload', 'Find medicine or photograph the prescription.'], ['Pharmacist review', 'We confirm availability and alternatives.'], ['Fast delivery', 'Track it all the way to your door.']],
    about: 'A pharmacy that cares about people first', aboutD: 'We make access to medicine and everyday care easier and clearer. Every prescription is pharmacist-reviewed and every order is trackable.', visit: 'Visit nearest branch', chat: 'Chat with pharmacist', location: 'Cairo, Egypt', hours: 'Daily, 8 AM–12 AM',
  },
};

const Arrow = ({ locale }: { locale: Locale }) => locale === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />;

export function ShopHome({ locale, medicines, query, setQuery }: {
  locale: Locale; medicines: Medicine[]; allMedicines: Medicine[]; query: string; setQuery: (query: string) => void;
  cartItems: CartItem[]; cartTotal: number; prescriptions: Prescription[]; refillDay: string; refillMedicineIds: string[]; subscriptionActive: boolean;
}) {
  const t = copy[locale];
  const popular = [...medicines].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const quick = [
    { icon: Bandage, title: t.wound, detail: t.woundD, color: 'coral' },
    { icon: Sparkles, title: t.cold, detail: t.coldD, color: 'blue' },
    { icon: HeartPulse, title: t.baby, detail: t.babyD, color: 'violet' },
  ];
  const services = [{ icon: HeartPulse, name: t.pressure, price: 75 }, { icon: Stethoscope, name: t.sugar, price: 90 }, { icon: Bandage, name: t.injection, price: 110 }];

  return <div className="home-page pb-0">
    <section className="modern-hero relative overflow-hidden">
      <div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
      <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.65}} className="relative z-10">
          <span className="soft-pill"><Sparkles size={16}/>{t.badge}</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.25] text-[#103c34] md:text-6xl">{t.title}<br/><span className="hero-accent">{t.accent}</span></h1>
          <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-[#60756f] md:text-lg">{t.description}</p>
          <div className="hero-search mt-8 flex max-w-2xl flex-col gap-2 p-2 sm:flex-row">
            <label className="flex min-h-14 flex-1 items-center gap-3 px-4"><Search size={21} className="text-[#0d8b72]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#94a8a1]"/></label>
            <Link to="/customer/products" className="primary-btn min-h-14 px-6">{t.shop}<Arrow locale={locale}/></Link>
          </div>
          <Link to="/customer/prescription" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#0d806b]"><UploadCloud size={18}/>{t.rx}<Arrow locale={locale}/></Link>
        </motion.div>
        <div className="relative mx-auto h-[480px] w-full max-w-[520px]">
          <motion.div animate={{y:[0,-12,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}} className="absolute inset-8 overflow-hidden rounded-[42px] bg-[#ccefe5] shadow-[0_35px_80px_rgba(15,90,75,.18)]">
            <img src="/rxflow-pharmacy-hero.png" alt="" className="h-full w-full object-cover"/>
          </motion.div>
          <motion.div animate={{y:[0,10,0],rotate:[-2,0,-2]}} transition={{duration:4,repeat:Infinity}} className="floating-note start-0 top-14"><div className="icon-bubble"><Clock3/></div><div><b>{t.delivery}</b><small>{t.deliveryD}</small></div></motion.div>
          <motion.div animate={{y:[0,-9,0]}} transition={{duration:4.7,repeat:Infinity}} className="floating-note bottom-14 end-0"><div className="icon-bubble blue"><BadgeCheck/></div><div><b>{t.pharmacist}</b><small>{t.pharmacistD}</small></div></motion.div>
          <div className="absolute end-4 top-8 grid size-14 place-items-center rounded-2xl bg-white text-[#0d8b72] shadow-xl"><ShieldCheck/></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="section-title-row"><div><span>{t.popularEyebrow}</span><h2>{t.popular}</h2><p>{t.popularD}</p></div><Link to="/customer/products" className="outline-btn">{t.viewAll}<Arrow locale={locale}/></Link></div>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{popular.map((m,i)=><motion.article whileHover={{y:-9}} transition={{type:'spring',stiffness:280}} key={m.id} className="modern-product-card">
        <div className="product-visual"><div className="medicine-shape"><span>{m.name.split(' ')[0]}</span><small>{m.ingredient}</small></div>{i<2&&<em>{locale==='ar'?'الأكثر طلبًا':'Popular'}</em>}</div>
        <p className="mt-5 text-xs font-black text-[#0d8b72]">{m.category}</p><h3 className="mt-1 text-lg font-black text-[#173d36]">{medicineName(m,locale)}</h3><p className="mt-1 truncate text-xs font-semibold text-[#82958f]">{m.ingredient}</p>
        <div className="mt-4 flex items-center justify-between"><b className="text-xl text-[#0d806b]">{formatCurrency(m.price,locale)}</b><Link to="/customer/products" className="grid size-11 place-items-center rounded-full bg-[#e8f7f2] text-[#0d806b]"><ShoppingBag size={19}/></Link></div>
      </motion.article>)}</div>
    </section>

    <section className="quick-section py-20"><div className="mx-auto max-w-7xl px-4 lg:px-8"><div className="section-title-row"><div><span>{t.quickEyebrow}</span><h2>{t.quick}</h2><p>{t.quickD}</p></div></div>
      <div className="mt-9 grid gap-5 lg:grid-cols-3">{quick.map((q,i)=><motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} key={q.title} className={`need-card ${q.color}`}><q.icon size={38}/><div><h3>{q.title}</h3><p>{q.detail}</p><Link to="/customer/products">{t.orderNow}<Arrow locale={locale}/></Link></div></motion.div>)}</div>
    </div></section>

    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div className="section-title-row block"><div><span>{t.homeEyebrow}</span><h2>{t.home}</h2><p>{t.homeD}</p></div><div className="mt-8 overflow-hidden rounded-[30px]"><img src="/rxflow-pharmacy-team.png" alt="" className="h-64 w-full object-cover"/></div></div>
      <div className="grid content-center gap-4">{services.map((s)=><motion.div whileHover={{x:locale==='ar'?-6:6}} key={s.name} className="service-row"><div className="service-icon"><s.icon/></div><div className="flex-1"><h3>{s.name}</h3><p>{t.from} {formatCurrency(s.price,locale)}</p></div><Link to="/customer/services" className="outline-btn">{t.book}<Arrow locale={locale}/></Link></motion.div>)}</div>
    </section>

    <section className="steps-section py-20"><div className="mx-auto max-w-7xl px-4 text-center lg:px-8"><span className="eyebrow">{t.howEyebrow}</span><h2 className="mt-2 text-3xl font-black text-[#163e36] md:text-4xl">{t.how}</h2><div className="relative mt-12 grid gap-8 md:grid-cols-3">{t.steps.map(([title,detail],i)=><div key={title} className="process-step"><b>{i+1}</b><h3>{title}</h3><p>{detail}</p></div>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8"><div className="about-banner"><div><span className="eyebrow">RxFlow Pharmacy</span><h2>{t.about}</h2><p>{t.aboutD}</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/customer/services" className="primary-btn">{t.visit}<MapPin size={18}/></Link><Link to="/customer/prescription" className="outline-btn white">{t.chat}<MessageCircle size={18}/></Link></div></div><div className="location-card"><MapPin size={28}/><b>{t.location}</b><small>{t.hours}</small></div></div></section>
    <footer className="border-t border-[#dcece6] bg-white py-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm font-bold text-[#71857e] sm:flex-row lg:px-8"><b className="text-lg text-[#0d806b]">RxFlow Pharmacy</b><span>© 2026 · {t.location} · {t.hours}</span></div></footer>
  </div>;
}
