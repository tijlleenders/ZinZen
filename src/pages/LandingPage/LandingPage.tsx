/* eslint-disable no-param-reassign */
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ZinZen from "@assets/images/LogoTextLight.svg";

import { LanguagesList } from "@components/LanguageChoice/LanguagesList";
import { ILanguage } from "@src/Interfaces";
import { i18n } from "@src/translations/i18n";

import "./LandingPage.scss";

export const LandingPage = () => {
  const { t } = useTranslation();
  const [, setPosition] = useState(1);
  const langSelected = (lang:string, newPos:number) => {
    if ((i18n.language.includes(lang))) {
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
        languages[0].sno = element.sno;
        languages[0].selected = false;
        element.sno = 1;
        element.selected = true;
      }
    });
    languages = languages.sort((a, b) => a.sno - b.sno);
    setLanguages(languages);
  }, []);

  return (
    <div id="landing-container">
      <div id="landing-left-panel">
        <div> <img src={ZinZen} alt="ZinZen Text Logo" id="landing-textLogo" /> </div>
        <div>
          <p className="landing-about">
            <span> Realize</span>
            <span> dreams</span>
            <span> together</span>
            <br style={{ marginTop: "5px" }} />
          </p>
        </div>
      </div>
      <div id="landing-right-panel">
        <p id="landing-langChoice">{t("langchoice")}</p>
        <LanguagesList languages={Languages} />
      </div>
    </div>
  );
};
