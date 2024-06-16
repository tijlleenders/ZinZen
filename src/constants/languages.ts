import { useTranslation } from "react-i18next";
import { ILanguage } from "@src/Interfaces";

export const getLanguages = () => {
  const { t } = useTranslation();
  const languages: ILanguage[] = [
    {
      sno: 1,
      title: t("english"),
      langId: "en",
      selected: true,
    },
    {
      sno: 2,
      title: t("french"),
      langId: "fr",
      selected: false,
    },
    {
      sno: 3,
      title: t("dutch"),
      langId: "nl",
      selected: false,
    },
    {
      sno: 4,
      title: t("hindi"),
      langId: "hi",
      selected: false,
    },
    {
      sno: 5,
      title: t("spanish"),
      langId: "es",
      selected: false,
    },
    {
      sno: 6,
      title: t("german"),
      langId: "de",
      selected: false,
    },
    {
      sno: 7,
      title: t("portuguese"),
      langId: "pt",
      selected: false,
    },
    {
      sno: 8,
      title: t("marathi"),
      langId: "mr",
      selected: false,
    },
    {
      sno: 9,
      title: t("gujarati"),
      langId: "gt",
      selected: false,
    },
    {
      sno: 10,
      title: t("hebrew"),
      langId: "he",
      selected: false,
    },
  ];

  return languages;
};
