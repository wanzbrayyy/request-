
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLanguageByCode } from '@/utils/languages';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem('wanzreq_language');
    return saved || 'en';
  });

  const language = getLanguageByCode(currentLanguage);

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('wanzreq_language', langCode);
  };

  const t = (key) => {
    return language.translations[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      language,
      changeLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
