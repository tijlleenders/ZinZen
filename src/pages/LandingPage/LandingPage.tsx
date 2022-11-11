import React from "react";
import { useTranslation } from "react-i18next";

import { LanguagesList } from "@components/LanguageChoice/LanguagesList";
import { ILanguage } from "@src/Interfaces";
import ZinZen from "@assets/images/LogoTextLight.svg";

import "./LandingPage.scss";

export const LandingPage = () => {
  const { t } = useTranslation();

  const languages: ILanguage[] = [
    {
      sno: 1,
      title: t("english"),
      langId: "en",
    },
    {
      sno: 2,
      title: t("french"),
      langId: "fr",
    },
    {
      sno: 3,
      title: t("dutch"),
      langId: "nl",
    },
    {
      sno: 4,
      title: t("hindi"),
      langId: "hi",
    },
    {
      sno: 5,
      title: t("spanish"),
      langId: "es",
    },
    {
      sno: 6,
      title: t("german"),
      langId: "de",
    },
    {
      sno: 7,
      title: t("portuguese"),
      langId: "pt",
    },
  ];
  return (
    <div id="landing-container">
      <div id="landing-left-panel">
        { /* <img src={Logo} alt="ZinZen Logo" id="landing-logo" /> */ }
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
        <LanguagesList languages={languages} />
      </div>
    </div>
  );
};
