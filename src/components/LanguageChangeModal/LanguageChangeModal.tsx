/* eslint-disable no-param-reassign */
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { Modal } from "antd";

import { vibrateWorks } from "@src/constants/vibrateCheck";
import { ILanguage } from "@src/Interfaces";
import { i18n } from "@src/translations/i18n";

import { themeState } from "@src/store/ThemeState";
import { languageChangeModal, languageSelectionState, darkModeState } from "@src/store";
import "./index.scss";

export const LanguageChangeModal = () => {
  const { t } = useTranslation();
  const [, setPosition] = useState(1);
  const open = useRecoilValue(languageChangeModal);
  const darkModeStatus = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeState);
  const [IsLanguageChosen, setIsLanguageChosen] = useRecoilState(languageSelectionState);
  const langSelected = (lang: string, newPos: number) => {
    if (i18n.language.includes(lang)) {
      setPosition(newPos);
      return true;
    }
    return false;
  };

  let languages: ILanguage[] = [
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
  ];

  const [Languages, setLanguages] = useState(languages);

  useLayoutEffect(() => {
    languages.forEach((element) => {
      if (langSelected(element.langId, element.sno)) {
        languages[0].selected = false;
        element.selected = true;
      }
    });
    languages = languages.sort((a, b) => a.sno - b.sno);
    setLanguages(languages);
  }, [IsLanguageChosen]);

  const handleClick = (langId: string) => {
    vibrateWorks ? navigator.vibrate(100) : null;
    setIsLanguageChosen(langId);
    i18n.changeLanguage(langId);
    localStorage.setItem("language", JSON.stringify(langId));
  };

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      centered
      onCancel={() => window.history.back()}
      width={200}
      className={`languageChangeModal popupModal${darkModeStatus ? "-dark" : ""} ${
        darkModeStatus ? "dark" : "light"
      }-theme${theme[darkModeStatus ? "dark" : "light"]}`}
    >
      <div className="languageListWrapper">
        {Languages.map((lang: ILanguage) => (
          <button
            key={String(lang.sno)}
            type="button"
            className={`languageListButton ${lang.selected} ? "selected" : ""`}
            onClick={() => {
              handleClick(lang.langId);
            }}
          >
            <input style={{ marginRight: "10px" }} type="radio" checked={lang.selected} readOnly />
            {lang.title}
          </button>
        ))}
      </div>
    </Modal>
  );
};
