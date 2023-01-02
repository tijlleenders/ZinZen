// @ts-nocheck
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState, displayLoader } from "@store";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import ArrowIcon from "@assets/images/ArrowIcon.svg";
import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
import plus from "@assets/images/plus.svg";
import correct from "@assets/images/correct.svg";

import { displaySidebar } from "@src/store/SidebarState";
import Loader from "@src/common/Loader";
import { displayAddGoal, displayAddGoalOptions, displayGoalId, displayUpdateGoal, goalsHistory, popFromGoalsHistory } from "@src/store/GoalsState";
import Sidebar from "@components/Sidebar";
import SuggestionModal from "../SuggestionModal";

import "@translations/i18n";
import "@components/HeaderDashboard/HeaderDashboard.scss";

interface GoalsHeaderProps {
  displayTRIcon: string,
  addThisGoal: (e: React.SyntheticEvent, parentGoalId: number) => Promise<void>,
  updateThisGoal: (e: React.SyntheticEvent) => Promise<void>
}

export const GoalsHeader:React.FC<GoalsHeaderProps> = ({ displayTRIcon, addThisGoal, updateThisGoal }) => {
  const navigate = useNavigate();
  const showLoader = useRecoilValue(displayLoader);
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showAddGoal = useRecoilValue(displayAddGoal);
  const goalID = useRecoilValue(displayGoalId);
  const setShowSidebar = useSetRecoilState(displaySidebar);

  const setShowAddGoalOptions = useSetRecoilState(displayAddGoalOptions);

  const popFromHistory = useSetRecoilState(popFromGoalsHistory);

  return (
    <div className={darkModeStatus ? "positioning-dark" : "positioning-light"}>
      <Sidebar />
      { showLoader && <Loader /> }

      <Navbar collapseOnSelect expand="lg">
        {
        !showAddGoal && !showUpdateGoal && subGoalsHistory.length === 0 ? (
          <img
            role="presentation"
            src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
            alt="Back arrow"
            style={{ width: "50px" }}
            id="main-header-homeLogo"
            onClickCapture={() => setShowSidebar(true)}
          />
        )
          : (
            <img
              role="presentation"
              src={ArrowIcon}
              alt="Back arrow"
              id={`main-header-homeLogo${darkModeStatus ? "-dark" : ""}`}
              onClick={() => {
                if (!showAddGoal && !showUpdateGoal && subGoalsHistory.length === 0) {
                  navigate(-1);
                } else popFromHistory(-1);
              }}
            />
          )
}
        {darkModeStatus ? (
          <img
            role="presentation"
            src={ZinZenTextDark}
            alt="ZinZen Text Logo"
            className="main-header-TextLogo"
            onClick={() => {
              navigate("/");
            }}
          />
        ) : (
          <img
            role="presentation"
            src={ZinZenTextLight}
            alt="ZinZen Text Logo"
            className="main-header-TextLogo"
            onClick={() => {
              navigate("/");
            }}
          />
        )}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navbar-custom" />
        </Navbar.Collapse>

        <button
          type="button"
          id={`goal-suggestion-btn${darkModeStatus ? "-dark" : ""}`}
          onClick={async (e) => {
            if (displayTRIcon === "+") {
              setShowAddGoalOptions(true);
              // setShowAddGoal({ open: true, goalId: goalID });
            } else if (showAddGoal) {
              await addThisGoal(e);
            } else if (showUpdateGoal) {
              await updateThisGoal(e);
            }
          }}
        >
          <img alt="save changes" src={displayTRIcon === "✓" ? correct : plus} />
        </button>

      </Navbar>
      <SuggestionModal
        goalID={goalID}
      />
    </div>
  );
};
