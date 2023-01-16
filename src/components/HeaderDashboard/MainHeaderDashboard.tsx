import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import { displaySidebar } from "@src/store/SidebarState";
import { displayAddGoalOptions } from "@src/store/GoalsState";
import plus from "@assets/images/plus.svg";

import Sidebar from "@components/Sidebar";
import "@translations/i18n";
import "./HeaderDashboard.scss";

export const MainHeaderDashboard = () => {
  const navigate = useNavigate();
  const setShowSidebar = useSetRecoilState(displaySidebar);
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowAddGoalOptions = useSetRecoilState(displayAddGoalOptions);

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
      <button
        type="button"
        id={`goal-suggestion-btn${darkModeStatus ? "-dark" : ""}`}
        onClick={async () => {
          navigate("/MyGoals");
          setShowAddGoalOptions(true);
        }}
      >
        <img alt="save changes" src={plus} />
      </button>
      <Sidebar />
    </div>

  );
};
