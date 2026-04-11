"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

type Language = "uz" | "ru" | "en";

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  home: {
    uz: "Bosh sahifa",
    ru: "Главная",
    en: "Home"
  },
  cars: {
    uz: "Avtomobillar",
    ru: "Автомобили",
    en: "Cars"
  },
  dashboard: {
    uz: "Shaxsiy kabinet",
    ru: "Личный кабинет",
    en: "Dashboard"
  },
  admin: {
    uz: "Admin Panel",
    ru: "Админ Панель",
    en: "Admin Panel"
  },
  login: {
    uz: "Kirish",
    ru: "Войти",
    en: "Login"
  },
  logout: {
    uz: "Chiqish",
    ru: "Выйти",
    en: "Logout"
  },
  // Qo'shimcha so'zlar bu yerga qo'shilishi mumkin
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = Cookies.get("app_language") as Language;
    if (savedLang && ["uz", "ru", "en"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    Cookies.set("app_language", lang, { expires: 365 });
  };

  const t = (key: string): string => {
    if (!mounted) return translations[key]?.["uz"] || key; // Default server side
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
