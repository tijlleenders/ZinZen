import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { darkModeState } from "@src/store";
import { themeSelectionMode, themeState } from "@src/store/ThemeState";
import BottomNavLayout from "@src/layouts/BottomNavLayout";

import Backdrop from "@src/common/Backdrop";
import GlobalAddBtn from "@components/GlobalAddBtn";

import "./BottomNavbar.scss";
import Icon from "@src/common/Icon";

const BottomNavbar = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { partnerId } = useParams();
  const isPartnerModeActive = !!partnerId;

  const themeSelection = useRecoilValue(themeSelectionMode);

  const [theme, setTheme] = useRecoilState(themeState);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);

  const currentPage = window.location.pathname.split("/")[1];
  const subGoalHistory = location.state?.goalsHistory ?? [];

  const themeChange = (nav: -1 | 1) => {
    let choice = theme[darkModeStatus ? "dark" : "light"] + nav;
    if (choice >= 8) {
      choice = 1;
    } else if (choice === 0) {
      choice = 8;
    }
    const newTheme = { ...theme, [darkModeStatus ? "dark" : "light"]: choice };
    localStorage.setItem("theme", JSON.stringify(newTheme));
    setTheme({ ...newTheme });
  };

  const handleClick = (to: string) => {
    if (themeSelection) {
      setDarkModeStatus(!darkModeStatus);
      return;
    }
    if (location.state?.from === to) {
      window.history.back();
    } else {
      const newLocationState = { ...location.state, from: currentPage, displayFocus: false };
      if (to === "MyTime") {
        if (currentPage !== "") navigate("/", { state: newLocationState });
      } else if (to === "MyGoals") {
        if (currentPage !== "MyGoals") {
          navigate("/goals", { state: newLocationState });
        } else if (subGoalHistory.length > 0) {
          window.history.go(-subGoalHistory.length);
        }
      } else if (currentPage !== "MyJournal") {
        navigate("/MyJournal", { state: newLocationState });
      }
    }
  };
  const { activeGoalId } = location.state || {};
  const isAddBtnVisible = title !== "myTime" && title !== "Focus" && (isPartnerModeActive ? !!activeGoalId : true);
  return (
    <>
      {themeSelection && (
        <Backdrop
          opacity={0}
          onClick={() => {
            window.history.back();
          }}
        />
      )}
      <BottomNavLayout>
        <button
          type="button"
          onClick={() => {
            if (themeSelection) themeChange(-1);
            else handleClick("MyTime");
          }}
          className={`bottom-nav-item ${currentPage === "" && !themeSelection ? "active" : ""}`}
        >
          <div
            style={{
              transform: themeSelection ? "scaleX(-1)" : "none",
            }}
          >
            <Icon
              active={currentPage === "" && !themeSelection}
              title={themeSelection ? "ArrowIcon" : "CalendarIcon"}
            />
          </div>
          {themeSelection ? <p>Prev</p> : <p>{t("Schedule")}</p>}
        </button>
        <button
          type="button"
          onClick={() => {
            handleClick("MyGoals");
          }}
          className={`bottom-nav-item ${currentPage === "MyGoals" || themeSelection ? "active" : ""}`}
        >
          <Icon active={currentPage === "MyGoals" || themeSelection} title="GoalsIcon" />
          {themeSelection ? <p>Switch Mode</p> : <p>{t("Goals")}</p>}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (themeSelection) themeChange(1);
            else handleClick("MyJournal");
          }}
          style={{
            padding: 7.5,
            gap: 10,
          }}
          className={`bottom-nav-item ${currentPage === "MyJournal" && !themeSelection ? "active" : ""}`}
        >
          <Icon
            active={currentPage === "MyJournal" && !themeSelection}
            title={themeSelection ? "ArrowIcon" : "JournalIcon"}
          />
          {themeSelection ? <p>Next</p> : <p>{t("Journal")}</p>}
          {isAddBtnVisible && <GlobalAddBtn add={title} />}
        </button>
      </BottomNavLayout>
    </>
  );
};

export default BottomNavbar;
