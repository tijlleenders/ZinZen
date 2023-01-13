import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import { displaySidebar } from "@src/store/SidebarState";
import Sidebar from "@components/Sidebar";
import DarkModeToggle from "react-dark-mode-toggle";

import "@translations/i18n";
import "./HeaderDashboard.scss";

export const MainHeaderDashboard = () => {
  const navigate = useNavigate();
  const setShowSidebar = useSetRecoilState(displaySidebar);
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
    <div className={`positioning${!darkModeStatus ? "-light" : "-dark"}`}>
      <img
        role="presentation"
        src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
        alt="avatar"
        style={{ width: "50px" }}
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
      <DarkModeToggle
        onChange={toggleTheme}
        checked={darkModeStatus}
        size={60}
        className="dark-mode-toggle"
      />
      <Sidebar />
    </div>

  );
};
