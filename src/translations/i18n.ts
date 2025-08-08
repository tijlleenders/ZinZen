// File: i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import moment from "moment";

import TRANSLATIONS_EN from "./en/translation.json";
import TRANSLATIONS_ES from "./es/translation.json";
import TRANSLATIONS_FR from "./fr/translation.json";
import TRANSLATIONS_HI from "./hi/translation.json";
import TRANSLATIONS_NL from "./nl/translation.json";
import TRANSLATIONS_DE from "./de/translation.json";
import TRANSLATIONS_PT from "./pt/translation.json";
import TRANSLATIONS_MR from "./mr/translation.json";
import TRANSLATIONS_GT from "./gt/translation.json";
import TRANSLATIONS_HE from "./he/translation.json";
import TRANSLATIONS_TA from "./ta/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",

    returnEmptyString: false,
    resources: {
      en: {
        translation: TRANSLATIONS_EN,
      },
      es: {
        translation: TRANSLATIONS_ES,
      },
      fr: {
        translation: TRANSLATIONS_FR,
      },
      hi: {
        translation: TRANSLATIONS_HI,
      },
      nl: {
        translation: TRANSLATIONS_NL,
      },
      de: {
        translation: TRANSLATIONS_DE,
      },
      pt: {
        translation: TRANSLATIONS_PT,
      },
      mr: {
        translation: TRANSLATIONS_MR,
      },
      gt: {
        translation: TRANSLATIONS_GT,
      },
      he: {
        translation: TRANSLATIONS_HE,
      },
      ta: { translation: TRANSLATIONS_TA },
    },
  });

i18n.init({
  interpolation: {
    format(value, format) {
      if (value instanceof Date) return moment(value).format(format);
      if (typeof value === "number") return new Intl.NumberFormat().format(value);
      return value;
    },
  },
});

const languagesAvailable = ["de", "en", "es", "fr", "hi", "nl", "mr", "gt", "he", "ta"];
const languagesFullForms: { [key: string]: string } = {
  de: "Deutsch",
  en: "English",
  es: "español",
  fr: "français",
  hi: "हिन्दी",
  nl: "Nederlands",
  mr: "मराठी",
  gt: "ગુજરાતી",
  he: "עברית",
  ta: "தமிழ்", // 🆕 Add this line
};

export { i18n, languagesAvailable, languagesFullForms };
