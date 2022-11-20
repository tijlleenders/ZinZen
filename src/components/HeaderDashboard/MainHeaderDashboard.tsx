import React from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import "@translations/i18n";
import "./HeaderDashboard.scss";

export const MainHeaderDashboard = () => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  // const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  // const toggleTheme = () => {
  //   setDarkModeStatus(!darkModeStatus);
  //   if (darkModeStatus) {
  //     localStorage.setItem("theme", "light");
  //   } else {
  //     localStorage.setItem("theme", "dark");
  //   }
  // };
  return (
    darkModeStatus ? (
      <img
        role="presentation"
        src={ZinZenTextDark}
        alt="ZinZen Text Logo"
        className="main-header-TextLogo"
        onClick={() => {
          navigate("/MyGoals");
        }}
      />
    ) : (
      <img
        role="presentation"
        src={ZinZenTextLight}
        alt="ZinZen Text Logo"
        className="main-header-TextLogo"
        onClick={() => {
          navigate("/MyGoals");
        }}
      />
    )
  );
};
