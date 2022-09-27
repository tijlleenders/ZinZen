/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-alert */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import ArrowIcon from "@assets/images/ArrowIcon.svg";
import LogoGradient from "@assets/images/LogoGradient.png";
import plus from "@assets/images/plus.svg";
import { GoalItem } from "@src/models/GoalItem";
import { ISharedGoal } from "@src/Interfaces/ISharedGoal";
import { getGoalsFromArchive, getGoal, addGoal, getPublicGoals } from "@src/api/GoalsAPI";
import { displayAddGoal, displayAddGoalOptions, displayGoalId, displaySuggestionsModal, displayUpdateGoal, goalsHistory, popFromGoalsHistory } from "@src/store/GoalsHistoryState";
import SuggestionModal from "../SuggestionModal";

import "@translations/i18n";
import "@components/HeaderDashboard/HeaderDashboard.scss";
import AddGoalOptions from "../AddGoalOptions";

interface GoalsHeaderProps {
  displayTRIcon: string,
  addThisGoal: (e: React.SyntheticEvent, parentGoalId: number) => Promise<void>
}

export const GoalsHeader:React.FC<GoalsHeaderProps> = ({ displayTRIcon, addThisGoal }) => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  let goalID = useRecoilValue(displayGoalId);

  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [showAddGoalOptions, setShowAddGoalOptions] = useRecoilState(displayAddGoalOptions);  

  const [showSuggestionsModal, setShowSuggestionsModal] = useRecoilState(displaySuggestionsModal);
  const [archiveGoals, setArchiveGoals] = useState<GoalItem[]>([]);
  const [publicGoals, setPublicGoals] = useState<ISharedGoal[]>([]);

  const popFromHistory = useSetRecoilState(popFromGoalsHistory);


  const getMySuggestions = async () => { 
    const goals: GoalItem[] = await getGoalsFromArchive(goalID);
    setArchiveGoals(goals);
    let goal: goalItem;

    if (goalID !== -1) goal = await getGoal(goalID);
    const res = await getPublicGoals(goalID === -1 ? "root" : goal.title);
    if (res.status) {
      const tmpPG = [...res.data];
      setPublicGoals([...tmpPG]);
    }
  };
  useEffect(() => {
    // if (window.location.href.includes("AddGoals") || (displayTRIcon && displayTRIcon === "?")) {
      getMySuggestions();
    // }
  }, [showSuggestionsModal]);

  return (
    <div className={darkModeStatus ? "positioning-dark" : "positioning-light"}>
      <Navbar collapseOnSelect expand="lg">
        <img
          role="presentation"
          src={ArrowIcon}
          alt="Back arrow"
          className="back-arrow-nav-dashboard"
          onClick={() => {
            if (!showAddGoal && !showUpdateGoal && subGoalsHistory.length === 0) {
              navigate(-1);
            } else popFromHistory(-1);
          }}
        />
        {darkModeStatus ? (
          <img
            role="presentation"
            src={ZinZenTextDark}
            alt="ZinZen Text Logo"
            className="zinzen-text-logo-nav-dashboard"
            onClick={() => {
              navigate("/Home");
            }}
          />
        ) : (
          <img
            role="presentation"
            src={ZinZenTextLight}
            alt="ZinZen Text Logo"
            className="zinzen-text-logo-nav-dashboard"
            onClick={() => {
              navigate("/Home");
            }}
          />
        )}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navbar-custom" />
        </Navbar.Collapse>

        <button
          type="button"
          id="goal-suggestion-btn"
          onClick={(e) => {
            if (displayTRIcon === "+") {
              setShowAddGoalOptions(true);
              // setShowAddGoal({ open: true, goalId: goalID });
            } else {
              // setShowSuggestionsModal(true);
              // getMySuggestions();
              addThisGoal(e)
            }
          }}
        >
          <img alt="create-goals-suggestion" src={LogoGradient} />
          <div>{window.location.href.includes("AddGoals") || displayTRIcon === "✓" ? "✓" : "+"}</div>
        </button>

      </Navbar>
      <SuggestionModal 
        goalID={goalID}
        showSuggestionsModal={showSuggestionsModal} 
        setShowSuggestionsModal={setShowSuggestionsModal}
        archiveGoals={archiveGoals}
        publicGoals={publicGoals}
      />
    </div>
  );
};
