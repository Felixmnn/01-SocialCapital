import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "../locales/de/translation.json";
import en from "../locales/en/translation.json";
import es from "../locales/es/translation.json";
import fra from "../locales/fra/translation.json";

const LANGUAGE_KEY = "app_language";

const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    callback(saved ?? "de");
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "de",
    resources: {
      de: { translation: de },
      en: { translation: en },
      es: { translation: es },
      fra: { translation: fra },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
