import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import hi from "./locales/hi";
import ja from "./locales/ja";
import zh from "./locales/zh";
import ko from "./locales/ko";
import si from "./locales/si";

const savedLang = localStorage.getItem("yatrasathi_lang") ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    ja: { translation: ja },
    zh: { translation: zh },
    ko: { translation: ko },
    si: { translation: si },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

export const LANGUAGES = [
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "hi", label: "हिंदी",    flag: "🇮🇳" },
  { code: "ja", label: "日本語",    flag: "🇯🇵" },
  { code: "zh", label: "中文",      flag: "🇨🇳" },
  { code: "ko", label: "한국어",    flag: "🇰🇷" },
  { code: "si", label: "සිංහල",   flag: "🇱🇰" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];
