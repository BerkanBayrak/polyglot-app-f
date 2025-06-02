import React, { createContext, useState, useContext, ReactNode } from 'react';

type LanguageContextType = {
  sourceLang: string;
  targetLang: string;
  setLanguages: (source: string, target: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [sourceLang, setSourceLang] = useState('tr');
  const [targetLang, setTargetLang] = useState('eng');

  const setLanguages = (source: string, target: string) => {
    setSourceLang(source);
    setTargetLang(target);
  };

  return (
    <LanguageContext.Provider value={{ sourceLang, targetLang, setLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 