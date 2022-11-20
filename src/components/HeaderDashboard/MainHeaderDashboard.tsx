import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import { displaySidebar } from "@src/store/SidebarState";
import Sidebar from "@components/Sidebar";

import "@translations/i18n";
import "./HeaderDashboard.scss";

export const MainHeaderDashboard = () => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowSidebar = useSetRecoilState(displaySidebar);
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
    <>
      <img
        role="presentation"
        src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
        alt="avatar"
        style={{ width: "50px", left: 0 }}
        id="main-header-homeLogo"
        onClick={() => setShowSidebar(true)}
      />
      <img
        role="presentation"
        src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
        alt="ZinZen Text Logo"
        className="main-header-TextLogo"
        onClick={() => {
          navigate("/MyGoals");
        }}
      />
      <Sidebar />
    </>

  );
};
