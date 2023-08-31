import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { GoalItem } from "@src/models/GoalItem";
import { getChildrenGoals, getGoal } from "@src/api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { getSharedWMChildrenGoals, getSharedWMGoal } from "@src/api/SharedWMAPI";
import { displayPartner, lastAction, openInbox } from "@src/store";
import {
  displayAddGoal,
  displayChangesModal,
  displayGoalId,
  displaySuggestionsModal,
  displayUpdateGoal,
} from "@src/store/GoalsState";

import GoalsList from "../GoalsList";
import ConfigGoal from "../GoalConfigModal/ConfigGoal";

import "./GoalSublist.scss";
import GoalHistory from "./GoalHistory";
import ArchivedAccordion from "../ArchivedAccordion";

export const GoalSublist = () => {
  const action = useRecoilValue(lastAction);
  const goalID = useRecoilValue(displayGoalId);
  const isInboxOpen = useRecoilValue(openInbox);
  const showAddGoal = useRecoilValue(displayAddGoal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);
  const showPartnerGoals = useRecoilValue(displayPartner);
  const [parentGoal, setParentGoal] = useState<GoalItem | null>(null);
  const [childrenGoals, setChildrenGoals] = useState<GoalItem[]>([]);
  const [archivedChildren, setArchivedChildren] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const handleChildrenGoals = (goals: GoalItem[]) => {
    setChildrenGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedChildren([...goals.filter((goal) => goal.archived === "true")]);
  };

  useEffect(() => {
    (isInboxOpen || showPartnerGoals ? getSharedWMGoal(goalID) : getGoal(goalID)).then((parent) =>
      setParentGoal(parent),
    );
  }, [goalID]);

  useEffect(() => {
    (isInboxOpen || showPartnerGoals ? getSharedWMChildrenGoals(goalID) : getChildrenGoals(goalID)).then(
      (fetchedGoals) => {
        handleChildrenGoals(fetchedGoals);
      },
    );
  }, [action, parentGoal, showAddGoal, showSuggestionModal, showChangesModal, showUpdateGoal]);

  return (
    <div className="sublist-container">
      <GoalHistory />
      <div className="sublist-content-container">
        <div className="sublist-content">
          <p className="sublist-title">{parentGoal?.title}</p>
          <div className="sublist-list-container">
            {showAddGoal && <ConfigGoal action="Create" goal={createGoalObjectFromTags({})} />}
            <GoalsList
              goals={childrenGoals}
              showActions={showActions}
              setGoals={setChildrenGoals}
              setShowActions={setShowActions}
            />
            <ArchivedAccordion
              archivedGoals={archivedChildren}
              showActions={showActions}
              setShowActions={setShowActions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
