import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations } from '../utils/translations';

export type Language = 'en' | 'ar';

interface LanguageState {
  language: Language;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      dir: 'ltr',
      setLanguage: (language) => {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
        set({ language, dir });
      },
      t: (key, replacements) => {
        const lang = get().language;
        const keys = translations[lang] || translations.en;
        let text = (keys as any)[key] || key;
        if (replacements) {
          Object.entries(replacements).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
          });
        }
        return text;
      },
    }),
    {
      name: 'rxflow-language-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.dir = state.dir;
          document.documentElement.lang = state.language;
        }
      },
    }
  )
);
