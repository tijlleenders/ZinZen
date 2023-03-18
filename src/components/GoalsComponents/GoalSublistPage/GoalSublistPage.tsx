/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import ArrowIcon from "@assets/images/ArrowIcon.svg";

import { GoalItem } from "@src/models/GoalItem";
import { getChildrenGoals, getGoal } from "@src/api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { displayGroup, displayAddPublicGroup } from "@src/store/GroupsState";
import { getSharedWMChildrenGoals, getSharedWMGoal } from "@src/api/SharedWMAPI";
import { darkModeState, displayInbox, lastAction, searchActive } from "@src/store";
import { displayAddGoal, displayChangesModal, displayGoalId, displaySuggestionsModal, displayUpdateGoal, goalsHistory, ISubGoalHistory, popFromGoalsHistory, resetGoalsHistory } from "@src/store/GoalsState";

import GoalConfigModal from "../GoalConfigModal/GoalConfigModal";
import MyGoal from "../MyGoal";
import ArchivedAccordion from "../ArchivedAccordion/ArchivedAccordion";

import "./GoalSublistPage.scss";

export const GoalSublist = () => {
  const navigate = useNavigate();
  const action = useRecoilValue(lastAction);
  const goalID = useRecoilValue(displayGoalId);
  const openInbox = useRecoilValue(displayInbox);
  const showAddGoal = useRecoilValue(displayAddGoal);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const [selectedGroup, setSelectedGroup] = useRecoilState(displayGroup);
  const [openAddGroup, setOpenAddGroup] = useRecoilState(displayAddPublicGroup);

  const popFromHistory = useSetRecoilState(popFromGoalsHistory);
  const callResetHistory = useSetRecoilState(resetGoalsHistory);

  const [parentGoal, setParentGoal] = useState<GoalItem>();
  const [childrenGoals, setChildrenGoals] = useState<GoalItem[]>([]);
  const [archivedChildren, setArchivedChildren] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const getBreadcrumbs = (sHistory: ISubGoalHistory[], longJump = true) => sHistory.map((item, index) => (
    <Breadcrumb.Item
      key={`history-${item.goalID}-${item.goalTitle}.`}
      onClick={() => { // @ts-ignore
        popFromHistory(longJump ? index : -1);
      }}
    >
      <span style={{ color: darkModeStatus ? "white" : "black", backgroundColor: item.goalColor }}>
        {item.goalTitle.slice(0, 10) }
      </span>
    </Breadcrumb.Item>
  ));

  const handleChildrenGoals = (goals:GoalItem[]) => {
    setChildrenGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedChildren([...goals.filter((goal) => goal.archived === "true")]);
  };

  const handleBackClick = () => {
    if (displaySearch) {
      setDisplaySearch(false);
    } else if (selectedGroup) {
      setSelectedGroup(null);
    } else if (openAddGroup) {
      setOpenAddGroup(false);
    } else if (!showAddGoal && !showUpdateGoal && subGoalHistory.length === 0) {
      navigate(-1);
    } else popFromHistory(-1);
  };

  useEffect(() => {
    (openInbox ? getSharedWMGoal(goalID) : getGoal(goalID))
      .then((parent) => setParentGoal(parent));
  }, [goalID]);

  useEffect(() => {
    (openInbox ? getSharedWMChildrenGoals(goalID) : getChildrenGoals(goalID))
      .then((fetchedGoals) => { handleChildrenGoals(fetchedGoals); });
  }, [action, parentGoal, showAddGoal, showSuggestionModal, showChangesModal, showUpdateGoal]);

  return (
    <div className="sublist-container">
      <Breadcrumb style={{ marginTop: "56px", padding: "0 18px" }}>
        {/* @ts-ignore */ }
        <Breadcrumb.Item onClick={() => callResetHistory()}>
          <span style={{ color: darkModeStatus ? "white" : "black", backgroundColor: darkModeStatus ? "#393939" : "#EDC7B7" }}>My Goals</span>
        </Breadcrumb.Item>
        {
          subGoalHistory.length <= 3 ? getBreadcrumbs(subGoalHistory.slice(0, 3)) : (
            <>
              { getBreadcrumbs(subGoalHistory.slice(0, 1)) }
              {/* @ts-ignore */ }
              <Breadcrumb.Item onClick={() => popFromHistory(-1)}>
                <span style={{ color: darkModeStatus ? "white" : "black", backgroundColor: darkModeStatus ? "#393939" : "#EDC7B7" }}>...</span>
              </Breadcrumb.Item>
              { getBreadcrumbs(subGoalHistory.slice(-1), false) }
            </>
          )
        }
      </Breadcrumb>
      <div className="sublist-content-container">
        <div className="sublist-content">

          <div className="sublist-title">
            <button
              type="button"
              className="nav-icon"
              onClick={() => { handleBackClick(); }}
            >
              <img alt="zinzen my goals" src={ArrowIcon} />
            </button>
            <p>  {parentGoal?.title}</p>
          </div>
          <Container fluid className="sublist-list-container">
            { showAddGoal && <GoalConfigModal goal={createGoalObjectFromTags({})} /> }

            {childrenGoals?.map((goal: GoalItem) => (
              showUpdateGoal?.goalId === goal.id ? <GoalConfigModal goal={goal} />
                :
              <MyGoal goal={goal} showActions={showActions} setShowActions={setShowActions} />
            ))}
            <ArchivedAccordion totalArchived={archivedChildren.length}>
              {archivedChildren.map((goal: GoalItem) => (
                <MyGoal
                  key={`goal-${goal.id}`}
                  goal={goal}
                  showActions={showActions}
                  setShowActions={setShowActions}
                />
              ))}
            </ArchivedAccordion>
          </Container>
        </div>
      </div>
    </div>
  );
};
