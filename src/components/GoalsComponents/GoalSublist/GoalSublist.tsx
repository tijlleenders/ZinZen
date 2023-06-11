/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import ZAccordion from "@src/common/Accordion";
import { GoalItem } from "@src/models/GoalItem";
import { getChildrenGoals, getGoal } from "@src/api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { getSharedWMChildrenGoals, getSharedWMGoal } from "@src/api/SharedWMAPI";
import { darkModeState, displayInbox, lastAction } from "@src/store";
import { displayAddGoal, displayChangesModal, displayGoalId, displaySuggestionsModal, displayUpdateGoal } from "@src/store/GoalsState";

import MyGoal from "../MyGoal";
import GoalsList from "../GoalsList";
import ConfigGoal from "../GoalConfigModal/ConfigGoal";

import "./GoalSublist.scss";
import GoalHistory from "./GoalHistory";

export const GoalSublist = () => {
  const action = useRecoilValue(lastAction);
  const goalID = useRecoilValue(displayGoalId);
  const openInbox = useRecoilValue(displayInbox);
  const showAddGoal = useRecoilValue(displayAddGoal);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const [parentGoal, setParentGoal] = useState<GoalItem>();
  const [childrenGoals, setChildrenGoals] = useState<GoalItem[]>([]);
  const [archivedChildren, setArchivedChildren] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const handleChildrenGoals = (goals:GoalItem[]) => {
    setChildrenGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedChildren([...goals.filter((goal) => goal.archived === "true")]);
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
      <GoalHistory />
      <div className="sublist-content-container">
        <div className="sublist-content">
          <p className="sublist-title">{parentGoal?.title}</p>
          <div className="sublist-list-container">
            { showAddGoal && <ConfigGoal action="Create" goal={createGoalObjectFromTags({})} /> }
            <GoalsList
              goals={childrenGoals}
              showActions={showActions}
              setGoals={setChildrenGoals}
              setShowActions={setShowActions}
            />
            <div className="archived-drawer">
              { archivedChildren.length > 0 && (
                <ZAccordion
                  showCount
                  style={{
                    border: "none",
                    background: darkModeStatus ? "var(--secondary-background)" : "transparent"
                  }}
                  panels={[{
                    header: "Archived",
                    body: archivedChildren.map((goal: GoalItem) => (
                      <MyGoal
                        key={`goal-${goal.id}`}
                        goal={goal}
                        showActions={showActions}
                        setShowActions={setShowActions}
                      />
                    ))
                  }]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
