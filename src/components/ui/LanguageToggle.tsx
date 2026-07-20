import type { Locale } from '../../types/pharmacy';

const labels: Record<Locale, string> = {
  ar: 'عربي',
  en: 'EN',
};

export function LanguageToggle({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-lg border border-[#d7e8e2] bg-white p-1 shadow-sm">
      {(['ar', 'en'] as Locale[]).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={[
            'min-h-9 rounded-md px-3 text-xs font-black transition',
            locale === item
              ? 'bg-[#0f7f6d] text-white'
              : 'text-[#48645d] hover:bg-[#edf7f3]',
          ].join(' ')}
          aria-pressed={locale === item}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
