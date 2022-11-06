import React from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import ThemeDark from "@assets/images/DashboardThemeDark.svg";
import ThemeLight from "@assets/images/DashboardThemeLight.svg";
import ZinZen from "@assets/images/LogoTextLight.svg";
import { themeSelectionState, darkModeState } from "@src/store";

import "@translations/i18n";
import "./ThemeChoice.scss";

export const ThemeChoice = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, setIsThemeChosen] = useRecoilState(themeSelectionState);
  const [, setDarkModeStatus] = useRecoilState(darkModeState);
  return (
    <div id="themeChoice-container" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ alignSelf: "center" }}> <img src={ZinZen} alt="ZinZen Text Logo" id="landing-textLogo" /> </div>

      <p id="themeChoice-label">{t("themechoice")}</p>
      <button
        type="button"
        className="themeChoice-btn"
        onClick={() => {
          setIsThemeChosen(true);
          localStorage.setItem("theme", "light");
          navigate("/QueryZinZen");
        }}
      >
        <img src={ThemeLight} alt="Light Theme" className="themechoice" />
      </button>
      <button
        type="button"
        className="themeChoice-btn"
        onClick={() => {
          setIsThemeChosen(true);
          localStorage.setItem("theme", "dark");
          navigate("/QueryZinZen");
          setDarkModeStatus(true);
        }}
      >
        <img src={ThemeDark} alt="Dark Theme" className="themechoice" />
      </button>
    </div>
  );
};
