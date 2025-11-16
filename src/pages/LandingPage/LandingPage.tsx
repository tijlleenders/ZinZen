/* eslint-disable no-param-reassign */
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "@tanstack/react-router";
import { useRecoilValue } from "recoil";
import { LanguagesList } from "@components/LanguageChoice/LanguagesList";
import { i18n } from "@src/translations/i18n";

import "./LandingPage.scss";
import { darkModeState } from "@src/store";
import OnboardingLayout from "@src/layouts/OnboardingLayout";
import { getLanguages } from "@src/constants/languages";

export const LandingPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const availableLanguages = getLanguages();

  const priotizedlanguageList = useMemo(() => {
    const active = i18n.language;

    const selected = availableLanguages.filter((l) => active.includes(l.langId));
    const others = availableLanguages.filter((l) => !active.includes(l.langId));

    return [...selected.map((l) => ({ ...l, selected: true })), ...others.map((l) => ({ ...l, selected: false }))];
  }, [i18n.language, availableLanguages]);

  const handleNavigateToFaq = (path: string) => {
    navigate({ to: path, replace: true });
  };

  return (
    <OnboardingLayout>
      <p className={`landing-about${darkModeStatus ? "-dark" : ""}`}>
        <span style={{ color: darkModeStatus ? "#AB9ED8" : "#C6441D", fontSize: "18px" }}>Better together </span>
      </p>
      <p className="subheading">{t("langChoice")}</p>
      <LanguagesList
        languages={priotizedlanguageList}
        navigationCallback={(path) => handleNavigateToFaq(path)}
        type="fragment"
        hideSelected
      />
    </OnboardingLayout>
  );
};
