import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { displayChangesModal, displayGoalId, displaySuggestionsModal } from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { getDeletedGoals } from "@src/api/TrashAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { lastAction } from "@src/store";
import { getGoalHintItem } from "@src/api/HintsAPI";
import { priotizeImpossibleGoals } from "@src/utils/priotizeImpossibleGoals";
import { useParentGoalContext } from "@src/contexts/parentGoal-context";
import { AvailableGoalHintProvider } from "@src/contexts/availableGoalHint-context";
import { DeletedGoalProvider } from "@src/contexts/deletedGoal-context";
import DeletedGoals from "@pages/GoalsPage/components/DeletedGoals";
import ArchivedGoals from "@pages/GoalsPage/components/ArchivedGoals";
import { TrashItem } from "@src/models/TrashItem";
import GoalItemSummary from "@src/common/GoalItemSummary/GoalItemSummary";
import AvailableGoalHints from "@pages/GoalsPage/components/AvailableGoalHints";
import { moveGoalState } from "@src/store/moveGoalState";
import GoalsList from "../GoalsList";
import GoalHistory from "./components/GoalHistory";
import "./GoalSublist.scss";

export const GoalSublist = () => {
  const {
    parentData: { parentGoal, subgoals },
    dispatch,
  } = useParentGoalContext();
  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [deletedGoals, setDeletedGoals] = useState<TrashItem[]>([]);
  const [archivedChildren, setArchivedChildren] = useState<GoalItem[]>([]);
  const [goalHints, setGoalHints] = useState<GoalItem[]>([]);
  const { t } = useTranslation();
  const action = useRecoilValue(lastAction);
  const goalID = useRecoilValue(displayGoalId);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);
  const goalToMove = useRecoilValue(moveGoalState);

  useEffect(() => {
    if (parentGoal === undefined) return;
    getGoalHintItem(parentGoal?.id).then((hintItem) => {
      const array: GoalItem[] = [];
      hintItem?.availableGoalHints?.forEach((availableGoalHint) => {
        if (availableGoalHint) {
          array.push(createGoalObjectFromTags({ ...availableGoalHint, parentGoalId: parentGoal.id }));
        }
      });
      setGoalHints(array || []);
    });
  }, [action, parentGoal, showSuggestionModal, showChangesModal, subgoals, goalID]);

  useEffect(() => {
    async function init() {
      if (!parentGoal) return;
      const sortedGoals = await priotizeImpossibleGoals(subgoals);
      setArchivedChildren([...sortedGoals.filter((goal) => goal.archived === "true")]);
      getDeletedGoals(parentGoal.id).then((res) => {
        setDeletedGoals([...res]);
      });
      setActiveGoals([...sortedGoals.filter((goal) => goal.archived === "false")]);
    }
    init();
  }, [action, parentGoal, showSuggestionModal, showChangesModal, subgoals, goalID, goalToMove]);

  const setGoals = useCallback(
    (setGoalsStateUpdateWrapper: (prevGoals: GoalItem[]) => GoalItem[]) => {
      const newSubgoals = setGoalsStateUpdateWrapper(activeGoals);
      setActiveGoals(newSubgoals);
      dispatch({ type: "SET_SUBGOALS", payload: [...archivedChildren, ...newSubgoals] });
    },
    [subgoals, activeGoals],
  );

  return (
    <div className="sublist-container">
      <GoalHistory />
      <div className="sublist-content-container">
        <div className="sublist-content">
          <p className="sublist-title">{parentGoal && t(parentGoal?.title)}</p>
          {parentGoal && (
            <span className="goal-item-summary-wrapper">
              <GoalItemSummary goal={parentGoal} />
            </span>
          )}
          <div className="sublist-list-container">
            <GoalsList goals={activeGoals} setGoals={setGoals} />
            <AvailableGoalHintProvider goalHints={goalHints}>
              <AvailableGoalHints goals={goalHints} />
            </AvailableGoalHintProvider>
            <DeletedGoalProvider>
              {deletedGoals.length > 0 && <DeletedGoals goals={deletedGoals} />}
            </DeletedGoalProvider>
            <ArchivedGoals goals={archivedChildren} />
          </div>
        </div>
      </div>
    </div>
  );
};
