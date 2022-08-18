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
import { getAllArchivedGoals } from "@src/api/GoalsAPI";

import "@translations/i18n";
import "@components/HeaderDashboard/HeaderDashboard.scss";
import { GoalItem } from "@src/models/GoalItem";

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

  const getArchiveGoals = (isArchiveTab: boolean) => (archiveGoals.length > 0 ?
    archiveGoals.map((goal) => (
      <div key={`my-archive-${goal.id}`} className="suggestions-goal-name">
        <p style={{ marginBottom: 0, padding: "2%" }}>{goal.title}</p>
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
    ));

  useEffect(() => {
    if (window.location.href.includes("AddGoals") || (displayTRIcon && displayTRIcon === "?")) {
      (async () => {
        const goals: GoalItem[] = await getAllArchivedGoals();
        setArchiveGoals(goals);
        console.log("ar", goals);
      })();
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
            if (displayTRIcon === "+") { setShowAddGoals({ open: true, goalId: goalID }); } else { setShowSuggestionsModal(true); }
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
              {getArchiveGoals(true)}
            </Tab>
            <Tab eventKey="Public Goals" title="Public Goals">
              {getArchiveGoals(false)}
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </div>
  );
};
