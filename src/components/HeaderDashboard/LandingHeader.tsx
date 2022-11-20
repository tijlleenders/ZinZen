import React from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import "@translations/i18n";
import "./HeaderDashboard.scss";

export const LandingHeader = () => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <>
      <img
        role="presentation"
        src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
        alt="Back arrow"
        style={{ width: "50px" }}
        id="main-header-homeLogo"
      />
      <img
        role="presentation"
        src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
        alt="ZinZen Text Logo"
        className="main-header-TextLogo"
        onClick={() => {
          navigate("/");
        }}
      />

    </>
  );
};
