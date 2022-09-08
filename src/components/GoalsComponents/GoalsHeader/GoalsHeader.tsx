/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-alert */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Navbar, Nav, Modal, Tabs, Tab } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import ArrowIcon from "@assets/images/ArrowIcon.svg";
import LogoGradient from "@assets/images/LogoGradient.png";
import plus from "@assets/images/plus.svg";
import { getGoalsFromArchive, getGoal, addGoal, getPublicGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { ISharedGoal } from "@src/Interfaces/ISharedGoal";

import "@translations/i18n";
import "@components/HeaderDashboard/HeaderDashboard.scss";

interface GoalsHeaderProps {
  goalID: number,
  popFromHistory: () => void,
  setShowAddGoals:React.Dispatch<React.SetStateAction<{
        open: boolean;
        goalId: number;
  }>>,
  displayTRIcon: string
}
export const GoalsHeader:React.FC<GoalsHeaderProps> = ({ goalID, displayTRIcon, popFromHistory, setShowAddGoals }) => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);

  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [archiveGoals, setArchiveGoals] = useState<GoalItem[]>([]);
  const [publicGoals, setPublicGoals] = useState<ISharedGoal[]>([]);

  const addSuggestedGoal = async (goal: ISharedGoal) => {
    const { id: prevId, ...newGoal } = { ...goal, parentGoalId: goalID, sublist: null, status: 0 };
    const newGoalId = await addGoal(newGoal);
    alert(newGoalId ? "Added!" : "Sorry!");
    return newGoalId;
  };
  const getSuggestions = (isArchiveTab: boolean) => {
    const lst: ISharedGoal[] = isArchiveTab ? archiveGoals : publicGoals;
    return lst.length > 0 ?
      lst.map((goal) => (
        <div key={`my-archive-${goal.id}`} className="suggestions-goal-name">
          <p style={{ marginBottom: 0 }}>{goal.title}</p>
          <button type="button" onClick={() => { addSuggestedGoal(goal); }}>
            <img alt="goal suggestion" src={plus} />
          </button>
        </div>
      ))
      : (
        <div style={{ textAlign: "center" }} className="suggestions-goal-name">
          <p style={{ marginBottom: 0, padding: "2%" }}>
            {
            isArchiveTab ? "Sorry, No Archived Goals" : "Sorry, No Public Goals"
          }
          </p>
        </div>
      );
  };
  const getMySuggestions = async () => {
    const goals: GoalItem[] = await getGoalsFromArchive(goalID);
    setArchiveGoals(goals);
    let goal: goalItem;
    if (goalID !== -1) goal = await getGoal(goalID);
    if (publicGoals.length === 0) {
      const res = await getPublicGoals(goalID === -1 ? "root" : goal.title);
      if (res.status) {
        const tmpPG = [...res.data];
        setPublicGoals([...tmpPG]);
      }
    }
  };

  useEffect(() => {
    if (window.location.href.includes("AddGoals") || (displayTRIcon && displayTRIcon === "?")) {
      getMySuggestions();
    }
  }, [displayTRIcon]);

  return (
    <div className={darkModeStatus ? "positioning-dark" : "positioning-light"}>
      <Navbar collapseOnSelect expand="lg">
        <img
          role="presentation"
          src={ArrowIcon}
          alt="Back arrow"
          className="back-arrow-nav-dashboard"
          onClick={() => {
            popFromHistory();
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
          onClick={() => {
            if (displayTRIcon === "+") {
              setShowAddGoals({ open: true, goalId: goalID });
            } else {
              setShowSuggestionsModal(true);
              getMySuggestions();
            }
          }}
        >
          <img alt="create-goals-suggestion" src={LogoGradient} />
          <div>{window.location.href.includes("AddGoals") || displayTRIcon === "?" ? "?" : "+"}</div>
        </button>

      </Navbar>
      <Modal
        id="suggestions-modal"
        show={showSuggestionsModal}
        onHide={() => setShowSuggestionsModal(false)}
        centered
        autoFocus={false}
      >

        <Modal.Body id="suggestions-modal-body">
          <button type="button" id="suggestions-modal-icon" onClick={() => { setShowSuggestionsModal(true); }}>
            <img alt="create-goals-suggestion" src={LogoGradient} />
            <div>?</div>
          </button>
          <Tabs
            defaultActiveKey="My Archive"
            id="suggestions"
            className="mb-3"
            justify
          >
            <Tab eventKey="My Archive" title="My Archive">
              {getSuggestions(true)}
            </Tab>
            <Tab eventKey="Public Goals" title="Public Goals">
              {getSuggestions(false)}
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </div>
  );
};
