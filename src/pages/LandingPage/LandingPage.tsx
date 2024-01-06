/* eslint-disable no-param-reassign */
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { LanguagesList } from "@components/LanguageChoice/LanguagesList";
import { i18n } from "@src/translations/i18n";

import "./LandingPage.scss";
import { darkModeState } from "@src/store";
import OnboardingLayout from "@src/layouts/OnboardingLayout";
import { getLanguages } from "@src/constants/languages";

export const LandingPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [, setPosition] = useState(1);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const langSelected = (lang: string, newPos: number) => {
    if (i18n.language.includes(lang)) {
      setPosition(newPos);
      return true;
    }
    return false;
  };

  let languages = getLanguages();

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

  const handleNavigateToFaq = (path: string) => {
    navigate(path);
  };

  return (
    <OnboardingLayout>
      <p className={`landing-about${darkModeStatus ? "-dark" : ""}`}>
        <span style={{ color: darkModeStatus ? "#AB9ED8" : "#C6441D" }}>Better together </span>
      </p>
      <p className="subheading">{t("langChoice")}</p>
      <LanguagesList
        languages={Languages}
        navigationCallback={(path) => handleNavigateToFaq(path)}
        type="fragment"
        hideSelected={true}
      />
    </OnboardingLayout>
  );
};
