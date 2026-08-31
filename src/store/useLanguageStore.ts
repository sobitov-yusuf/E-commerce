import { create } from 'zustand';
import { LanguageCode } from '@/types';
import { translations, TranslationKey } from '@/locales/translations';

export type { LanguageCode };

interface LanguageStore {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey) => string;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  lang: 'uz',

  setLang: (lang: LanguageCode) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_lang', lang);
        window.dispatchEvent(new Event('languageChange'));
      }
    } catch (e) {}
    set({ lang });
  },

  setLanguage: (lang: LanguageCode) => {
    get().setLang(lang);
  },

  t: (key: TranslationKey) => {
    const currentLang = get().lang;
    const entry = translations[key];
    if (!entry) return key;
    return entry[currentLang] || entry['uz'] || key;
  },
}));
