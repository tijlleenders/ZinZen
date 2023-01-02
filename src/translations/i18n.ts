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

const languagesAvailable: string[] = ["de", "en", "es", "fr", "hi", "nl"];
const languagesFullForms: { [key: string]: string } = {
  de: "Deutsch",
  en: "English",
  es: "español",
  fr: "français",
  hi: "हिन्दी",
  nl: "Nederlands"
};
export { i18n, languagesAvailable, languagesFullForms };
