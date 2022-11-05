import React from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import logo from "@assets/images/logo.svg";
import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import "@translations/i18n";
import "./HeaderDashboard.scss";

export const HeaderDashboard = () => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);

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
    </>
  );
};
