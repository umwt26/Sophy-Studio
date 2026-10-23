import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import tr from './locales/tr.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ru from './locales/ru.json';
import pt from './locales/pt.json';
import ja from './locales/ja.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  ru: { translation: ru },
  pt: { translation: pt },
  ja: { translation: ja },
};

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('sophy_lang') : null;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sophy_lang', lng);
    }
  } catch {}
});

export default i18n;

