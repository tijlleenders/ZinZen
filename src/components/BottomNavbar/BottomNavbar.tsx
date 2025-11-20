import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useNavigate } from "@tanstack/react-router";

import { themeSelectionMode } from "@src/store/ThemeState";
import { getGoalById } from "@src/api/GoalsAPI";
import BottomNavLayout from "@src/layouts/BottomNavLayout";

import "./BottomNavbar.scss";
import { ILocationState } from "@src/Interfaces";
import Icon from "@src/common/Icon";
import { BottomNavButton } from "./BottomNavButton";
import ThemeSelectionControls from "./ThemeSelectionControls";

const BottomNavbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const themeSelection = useRecoilValue(themeSelectionMode);

  const currentPage = window.location.pathname.split("/")[1];

  const goToHome = (state: ILocationState) => {
    if (currentPage !== "") {
      navigate({
        to: "/",
        state: (prevState) => ({
          ...prevState,
          ...state,
        }),
      });
    }
  };

  const goToGoals = (state: ILocationState) => {
    if (currentPage !== "goals") {
      navigate({
        to: "/goals/$parentId",
        params: { parentId: "root" },
        state: (prevState) => ({ ...prevState, ...state }),
      });
      return;
    }

    const parentId = window.location.pathname.split("/")[2];
    getGoalById(parentId).then((goal) => {
      if (goal) {
        window.history.go(-goal.depth);
      }
    });
  };

  const goToJournal = (state: ILocationState) => {
    if (currentPage !== "MyJournal") {
      navigate({
        to: "/MyJournal",
        state: (prevState) => ({
          ...prevState,
          ...state,
        }),
      });
    }
  };

  const handleClick = (to: string) => {
    const newState = {
      from: currentPage,
      displayFocus: false,
    };
    if (to === "MyTime") return goToHome(newState);
    if (to === "goals") return goToGoals(newState);
    return goToJournal(newState);
  };

  if (themeSelection) {
    return <ThemeSelectionControls onClose={window.history.back} />;
  }

  return (
    <BottomNavLayout>
      <BottomNavButton active={currentPage === ""} onClick={() => handleClick("MyTime")}>
        <Icon active={currentPage === ""} title="CalendarIcon" />
        <p>{t("Schedule")}</p>
      </BottomNavButton>
      <BottomNavButton
        active={currentPage === "goals"}
        onClick={() => handleClick("goals")}
        testId="navigation-button-Goals"
      >
        <Icon active={currentPage === "goals"} title="GoalsIcon" />
        <p>{t("Goals")}</p>
      </BottomNavButton>

      <BottomNavButton
        active={currentPage === "MyJournal"}
        onClick={(e) => {
          e.stopPropagation();
          handleClick("MyJournal");
        }}
      >
        <Icon active={currentPage === "MyJournal"} title="JournalIcon" />
        <p>{t("Journal")}</p>
      </BottomNavButton>
    </BottomNavLayout>
  );
};

export default BottomNavbar;
