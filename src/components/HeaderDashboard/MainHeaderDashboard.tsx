import React from "react";
import { useRecoilState } from "recoil";
import DarkModeToggle from "react-dark-mode-toggle";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import logo from "@assets/images/logo.svg";
import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import "@translations/i18n";
import "./HeaderDashboard.scss";

export const MainHeaderDashboard = () => {
  const navigate = useNavigate();
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const toggleTheme = () => {
    setDarkModeStatus(!darkModeStatus);
    if (darkModeStatus) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  };
  return (
    <>
      <img
        role="presentation"
        src={logo}
        alt="Zinzen Logo"
        id="main-header-homeLogo"
        onClick={() => {
          navigate("/Home");
        }}
      />
      {darkModeStatus ? (
        <img
          role="presentation"
          src={ZinZenTextDark}
          alt="ZinZen Text Logo"
          className="main-header-TextLogo"
          onClick={() => {
            navigate("/Home");
          }}
        />
      ) : (
        <img
          role="presentation"
          src={ZinZenTextLight}
          alt="ZinZen Text Logo"
          className="main-header-TextLogo"
          onClick={() => {
            navigate("/Home");
          }}
        />
      )}
      <DarkModeToggle
        onChange={toggleTheme}
        checked={darkModeStatus}
        size={60}
        className="main-header-themeToggler"
      />
    </>
  );
};
