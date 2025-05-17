import React, { useEffect, useState, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { displayChangesModal, displayGoalId, displaySuggestionsModal } from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { lastAction } from "@src/store";
import { getGoalHintItem } from "@src/api/HintsAPI";
import { priotizeImpossibleGoals } from "@src/utils/priotizeImpossibleGoals";
import { AvailableGoalHintProvider } from "@src/contexts/availableGoalHint-context";
import { DeletedGoalProvider } from "@src/contexts/deletedGoal-context";
import DeletedGoals from "@pages/GoalsPage/components/DeletedGoals";
import ArchivedGoals from "@pages/GoalsPage/components/ArchivedGoals";
import GoalItemSummary from "@src/common/GoalItemSummary/GoalItemSummary";
import AvailableGoalHints from "@pages/GoalsPage/components/AvailableGoalHints";
import { moveGoalState } from "@src/store/moveGoalState";
import { useParams } from "react-router-dom";
import { useGetActiveGoals } from "@src/hooks/api/Goals/useGetActiveGoals";
import { useGetGoalById } from "@src/hooks/api/Goals/useGetGoalById";
import GoalsList from "../GoalsList";
import GoalHistory from "./components/GoalHistory";
import "./GoalSublist.scss";

export const GoalSublist = () => {
  const { parentId } = useParams();
  const { data: parentGoal } = useGetGoalById(parentId || "");
  const { activeGoals } = useGetActiveGoals(parentId || "root");
  const [sortedGoals, setSortedGoals] = useState<GoalItem[]>([]);
  const [goalHints, setGoalHints] = useState<GoalItem[]>([]);
  const { t } = useTranslation();
  const action = useRecoilValue(lastAction);
  const goalID = useRecoilValue(displayGoalId);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);
  const goalToMove = useRecoilValue(moveGoalState);

  useEffect(() => {
    if (!activeGoals) return;
    priotizeImpossibleGoals(activeGoals).then(setSortedGoals);
  }, [activeGoals]);

  useEffect(() => {
    if (!parentId) return;
    getGoalHintItem(parentId).then((hintItem) => {
      const array: GoalItem[] = [];
      hintItem?.availableGoalHints?.forEach((availableGoalHint) => {
        if (availableGoalHint) {
          array.push(createGoalObjectFromTags({ ...availableGoalHint, parentGoalId: parentId }));
        }
      });
      setGoalHints(array || []);
    });
  }, [action, parentId, showSuggestionModal, showChangesModal, activeGoals, goalID]);

  useEffect(() => {
    async function init() {
      if (!parentId) return;
      const sortedGoals = await priotizeImpossibleGoals(activeGoals || []);
    }
    init();
  }, [action, parentId, showSuggestionModal, showChangesModal, activeGoals, goalID, goalToMove]);

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
            <GoalsList goals={activeGoals || []} />
            <AvailableGoalHintProvider goalHints={goalHints}>
              <AvailableGoalHints goals={goalHints} />
            </AvailableGoalHintProvider>
            <DeletedGoalProvider>
              <DeletedGoals />
            </DeletedGoalProvider>
            <ArchivedGoals />
          </div>
        </div>
      </div>
    </div>
  );
};
