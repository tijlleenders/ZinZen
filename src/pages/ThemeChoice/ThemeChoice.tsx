import React from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

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
        className="themeChoice-btn-light"
        onClick={() => {
          navigator.vibrate(100);
          setIsThemeChosen(true);
          localStorage.setItem("theme", "light");
          navigate("/QueryZinZen");
        }}
      >
        Light colors
      </button>
      <button
        type="button"
        className="themeChoice-btn-dark"
        onClick={() => {
          navigator.vibrate(100);
          setIsThemeChosen(true);
          localStorage.setItem("theme", "dark");
          navigate("/QueryZinZen");
          setDarkModeStatus(true);
        }}
      >
        Dark colors
      </button>
    </div>
  );
};
