/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import {
  displayAddGoal,
  displayChangesModal,
  displayGoalId,
  displaySuggestionsModal,
  displayUpdateGoal,
} from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { getDeletedGoals } from "@src/api/TrashAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { getChildrenGoals, getGoal } from "@src/api/GoalsAPI";
import { displayPartnerMode, lastAction } from "@src/store";
import { getSharedWMChildrenGoals, getSharedWMGoal } from "@src/api/SharedWMAPI";
import { getGoalHintItem } from "@src/api/HintsAPI";
import { priotizeImpossibleGoals } from "@src/utils/priotizeImpossibleGoals";

import GoalsList from "../GoalsList";
import ConfigGoal from "../GoalConfigModal/ConfigGoal";
import GoalHistory from "./GoalHistory";
import GoalsAccordion from "../GoalsAccordion";

import "./GoalSublist.scss";
import GoalItemSummary from "../MyGoal/GoalItemSummary/GoalItemSummary";

export const GoalSublist = () => {
  const { t } = useTranslation();
  const action = useRecoilValue(lastAction);
  const goalID = useRecoilValue(displayGoalId);
  const showAddGoal = useRecoilValue(displayAddGoal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);
  const showPartnerMode = useRecoilValue(displayPartnerMode);
  const [parentGoal, setParentGoal] = useState<GoalItem | null>(null);
  const [childrenGoals, setChildrenGoals] = useState<GoalItem[]>([]);
  const [deletedGoals, setDeletedGoals] = useState<GoalItem[]>([]);
  const [archivedChildren, setArchivedChildren] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });
  const [goalhints, setGoalHints] = useState<GoalItem[]>([]);

  useEffect(() => {
    getGoalHintItem(goalID).then((hintItem) => {
      const array: GoalItem[] = [];
      hintItem?.goalHints?.forEach((hint) => {
        if (hint) {
          array.push(createGoalObjectFromTags({ ...hint, parentGoalId: goalID }));
        }
      });
      setGoalHints(array || []);
    });
  }, [goalID, action]);

  const handleChildrenGoals = async (goals: GoalItem[]) => {
    const sortedGoals = await priotizeImpossibleGoals(goals);
    setChildrenGoals([...sortedGoals.filter((goal) => goal.archived === "false")]);
    setArchivedChildren([...sortedGoals.filter((goal) => goal.archived === "true")]);
  };

  useEffect(() => {
    (showPartnerMode ? getSharedWMGoal(goalID) : getGoal(goalID)).then((parent) => {
      setParentGoal(parent);
      getDeletedGoals(goalID).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setDeletedGoals([...res.map(({ deletedAt, ...goal }) => goal)]);
      });
    });
  }, [goalID]);

  useEffect(() => {
    (showPartnerMode ? getSharedWMChildrenGoals(goalID) : getChildrenGoals(goalID)).then((fetchedGoals) => {
      handleChildrenGoals(fetchedGoals);
      getDeletedGoals(goalID).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setDeletedGoals([...res.map(({ deletedAt, ...goal }) => goal)]);
      });
    });
  }, [action, parentGoal, showAddGoal, showSuggestionModal, showChangesModal, showUpdateGoal]);

  return (
    <div className="sublist-container">
      <GoalHistory />
      <div className="sublist-content-container">
        <div className="sublist-content">
          <p className="sublist-title">{parentGoal && t(parentGoal?.title)}</p>
          {parentGoal && <GoalItemSummary goal={parentGoal} />}
          <div className="sublist-list-container">
            {showAddGoal && <ConfigGoal action="Create" goal={createGoalObjectFromTags({})} />}
            <GoalsList
              goals={childrenGoals}
              showActions={showActions}
              setGoals={setChildrenGoals}
              setShowActions={setShowActions}
            />
            <GoalsAccordion
              header="Hints"
              goals={goalhints}
              showActions={showActions}
              setShowActions={setShowActions}
            />
            <GoalsAccordion
              header="Done"
              goals={archivedChildren}
              showActions={showActions}
              setShowActions={setShowActions}
            />
            <GoalsAccordion
              header="Trash"
              goals={deletedGoals}
              showActions={showActions}
              setShowActions={setShowActions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
