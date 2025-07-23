import i18n from 'i18next';
    import { initReactI18next } from 'react-i18next';
    import LanguageDetector from 'i18next-browser-languagedetector';
    import en from '@/locales/en.json';
    import id from '@/locales/id.json';
    import es from '@/locales/es.json';
    import fr from '@/locales/fr.json';
    import de from '@/locales/de.json';
    import ja from '@/locales/ja.json';
    import zh from '@/locales/zh.json';
    import ar from '@/locales/ar.json';
    import ru from '@/locales/ru.json';
    import pt from '@/locales/pt.json';
    
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        debug: false,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        resources: {
          en: { translation: en },
          id: { translation: id },
          es: { translation: es },
          fr: { translation: fr },
          de: { translation: de },
          ja: { translation: ja },
          zh: { translation: zh },
          ar: { translation: ar },
          ru: { translation: ru },
          pt: { translation: pt },
        }
      });
    
    export default i18n;