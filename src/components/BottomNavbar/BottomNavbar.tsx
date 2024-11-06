import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { darkModeState, lastAction } from "@src/store";
import { themeSelectionMode, themeState } from "@src/store/ThemeState";
import BottomNavLayout from "@src/layouts/BottomNavLayout";

import Backdrop from "@src/common/Backdrop";
import GlobalAddBtn from "@components/GlobalAddBtn";

import "./BottomNavbar.scss";
import Icon from "@src/common/Icon";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { moveGoalState } from "@src/store/moveGoalState";
import { moveGoalHierarchy } from "@src/helpers/GoalController";

const BottomNavbar = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [goalToMove, setGoalToMove] = useRecoilState(moveGoalState);
  const setLastAction = useSetRecoilState(lastAction);

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
    localStorage.setItem(LocalStorageKeys.THEME, JSON.stringify(newTheme));
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
      } else if (to === "goals") {
        if (currentPage !== "goals") {
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
  const isAddBtnVisible = title !== "Focus" && (isPartnerModeActive ? !!activeGoalId : true);

  const handleMoveHere = () => {
    if (goalToMove) {
      moveGoalHierarchy(goalToMove.id, activeGoalId ?? "root")
        .then(() => {
          setGoalToMove(null);
          setLastAction("goalMoved");
        })
        .catch((error) => {
          console.error("Error moving goal:", error);
        });
    }
  };

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
            if (goalToMove) setGoalToMove(null);
            else if (themeSelection) themeChange(-1);
            else handleClick("MyTime");
          }}
          className={`bottom-nav-item ${currentPage === "" && !themeSelection ? "active" : ""}`}
        >
          <div style={goalToMove || themeSelection ? { transform: "scaleX(-1)" } : {}}>
            <Icon
              title={goalToMove ? "ArrowIcon" : themeSelection ? "ArrowIcon" : "CalendarIcon"}
              active={currentPage === "" && !themeSelection}
            />
          </div>
          <p>{goalToMove ? t("Cancel") : themeSelection ? t("Prev") : t("Schedule")}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            handleClick("goals");
          }}
          className={`bottom-nav-item ${currentPage === "goals" || themeSelection ? "active" : ""}`}
        >
          {goalToMove ? (
            <div className="move-info">
              <p className="move-label">{t("Moving")}:</p>
              <p className="move-title" title={goalToMove.title}>
                {goalToMove.title}
              </p>
            </div>
          ) : (
            <>
              <Icon active={currentPage === "goals" || themeSelection} title="GoalsIcon" />
              <p>{themeSelection ? t("Switch Mode") : t("Goals")}</p>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (goalToMove) handleMoveHere();
            else if (themeSelection) themeChange(1);
            else handleClick("MyJournal");
          }}
          className={`bottom-nav-item ${currentPage === "MyJournal" && !themeSelection ? "active" : ""}`}
        >
          <Icon
            title={goalToMove ? "Correct" : themeSelection ? "ArrowIcon" : "JournalIcon"}
            active={currentPage === "MyJournal" && !themeSelection}
          />
          <p>{goalToMove ? t("Move Here") : themeSelection ? t("Next") : t("Journal")}</p>
          {isAddBtnVisible && <GlobalAddBtn add={title} />}
        </button>
      </BottomNavLayout>
    </>
  );
};

export default BottomNavbar;
