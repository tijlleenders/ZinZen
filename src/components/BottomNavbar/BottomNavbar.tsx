import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";

import backIcon from "@assets/images/backIcon.svg";
import goalsIcon from "@assets/images/goalsIcon.svg";
import calendarIcon from "@assets/images/calendarIcon.svg";
import journalIcon from "@assets/images/journalIcon.svg";

import GlobalAddBtn from "@components/GlobalAddBtn";
import { darkModeState, displayInbox } from "@src/store";

import "./BottomNavbar.scss";
import { themeSelectionMode, themeState } from "@src/store/ThemeState";
import { moonIcon, sunIcon } from "@src/assets";

const BottomNavbar = ({ title }: { title: string}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const openInbox = useRecoilValue(displayInbox);
  const themeSelection = useRecoilValue(themeSelectionMode);

  const [theme, setTheme] = useRecoilState(themeState);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);

  const currentPage = window.location.pathname.split("/")[1];
  const isUpdgradeAvailable = localStorage.getItem("updateAvailable") === "true";

  const themeChange = (nav: -1 | 1) => {
    let choice = theme[darkModeStatus ? "dark" : "light"] + nav;
    if (choice === 10) { choice = 1; } else if (choice === 0) { choice = 9; }
    const newTheme = { ...theme, [darkModeStatus ? "dark" : "light"]: choice };
    localStorage.setItem("theme", JSON.stringify(newTheme));
    setTheme({ ...newTheme });
  };

  const handleClick = (to: string) => {
    if (themeSelection) {
      setDarkModeStatus(!darkModeStatus);
    } if (to === "MyTime") {
      if (currentPage !== "") navigate("/", { state: location.state });
    } else if (to === "MyGoals") {
      if (currentPage !== "MyGoals") navigate("/MyGoals", { state: location.state });
    } else if (currentPage !== "MyJournal") {
      navigate("/MyJournal", { state: location.state });
    }
  };

  return (
    <div className={`bottom-navbar${darkModeStatus ? "-dark" : ""}`}>
      <button
        type="button"
        onClick={() => { if (themeSelection) themeChange(-1); else handleClick("MyTime"); }}
        className={`bottom-nav-item ${currentPage === "" && !themeSelection ? "active" : ""}`}
      >
        <img
          className={`secondary-icon ${themeSelection && !darkModeStatus ? "theme-selector-option" : ""}`}
          style={{ width: 24 }}
          src={themeSelection ? backIcon : calendarIcon}
          alt="My Time"
        />
        {themeSelection ? <p>Prev</p> : <p>Schedule</p>}
      </button>
      <button
        type="button"
        onClick={() => { handleClick("MyGoals"); }}
        className={`bottom-nav-item ${currentPage === "MyGoals" || openInbox || themeSelection ? "active" : ""}`}
      >
        <img className="secondary-icon" src={themeSelection ? darkModeStatus ? moonIcon : sunIcon : goalsIcon} alt="My Goals" />
        {themeSelection ? <p>Switch Mode</p> : <p>Goals</p> }
      </button>
      <button
        type="button"
        onClick={() => { if (themeSelection) themeChange(1); else handleClick("MyJournal"); }}
        style={{ gap: 10 }}
        className={`bottom-nav-item ${currentPage === "MyJournal" && !themeSelection ? "active" : ""}`}
      >
        <img
          style={{ transform: themeSelection ? "scaleX(-1)" : "none", paddingTop: 3 }}
          className={`secondary-icon ${themeSelection && !darkModeStatus ? "theme-selector-option" : ""}`}
          src={themeSelection ? backIcon : journalIcon}
          alt="My Journal"
        />
        {themeSelection ? <p>Next</p> : <p>Journal</p> }
        { title !== "My Time" && !isUpdgradeAvailable && <GlobalAddBtn add={title} /> }
      </button>
    </div>
  );
};

export default BottomNavbar;
