import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { promotions } from '../../../data/pharmacyData';
import type { Locale } from '../../../types/pharmacy';

const copy = {
  ar: {
    previous: 'السابق',
    next: 'التالي',
    count: 'ميزة',
    ai: 'اقتراحات ذكية',
    live: 'متابعة لحظية',
  },
  en: {
    previous: 'Previous',
    next: 'Next',
    count: 'Feature',
    ai: 'Smart guidance',
    live: 'Live follow-up',
  },
};

export function PromoCarousel({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const current = promotions[index];
  const Icon = current.icon;
  const text = copy[locale];

  const goTo = (nextIndex: number) => {
    setIndex((nextIndex + promotions.length) % promotions.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      goTo(index + 1);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [index]);

  return (
    <article className="float-card relative min-h-[460px] overflow-hidden rounded-lg border border-white/70 bg-[#0d3b34] p-3 text-white shadow-2xl shadow-emerald-950/25">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(110,231,183,0.26),transparent_32%),radial-gradient(circle_at_80%_12%,rgba(125,211,252,0.18),transparent_28%)]" />
      <div className="relative h-56 overflow-hidden rounded-lg">
        <motion.img
          key={current.image}
          src={current.image}
          alt=""
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071f1c]/92 via-[#0b302b]/28 to-transparent" />
        <div className="absolute start-3 top-3 inline-flex items-center gap-2 rounded-md bg-white/14 px-3 py-2 text-xs font-black backdrop-blur-md">
          <Sparkles size={15} />
          {text.ai}
        </div>
        <div className="absolute bottom-3 start-3 flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-black text-[#0f7f6d]">
          <Icon size={16} />
          {current.badge[locale]}
        </div>
      </div>

      <div className="relative p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-black text-emerald-100">
              {text.count} {index + 1}/{promotions.length}
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-white">
              {current.title[locale]}
            </h2>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="grid size-9 place-items-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/18"
              aria-label={text.previous}
              title={text.previous}
            >
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="grid size-9 place-items-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/18"
              aria-label={text.next}
              title={text.next}
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm font-semibold leading-7 text-emerald-50">
          {current.body[locale]}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/14 bg-white/10 p-3 backdrop-blur-md">
            <Bot size={18} />
            <p className="mt-2 text-xs font-black">{text.ai}</p>
          </div>
          <div className="rounded-lg border border-white/14 bg-white/10 p-3 backdrop-blur-md">
            <Sparkles size={18} />
            <p className="mt-2 text-xs font-black">{text.live}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {promotions.map((item, itemIndex) => (
            <button
              key={item.title.en}
              type="button"
              onClick={() => goTo(itemIndex)}
              className={[
                'h-2 rounded-md transition',
                itemIndex === index ? 'bg-white' : 'bg-white/22 hover:bg-white/42',
              ].join(' ')}
              aria-label={item.title[locale]}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
