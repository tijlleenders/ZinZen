import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { displayChangesModal, displayGoalId, displaySuggestionsModal } from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { lastAction } from "@src/store";
import { getGoalHintItem } from "@src/api/HintsAPI";
import { AvailableGoalHintProvider } from "@src/contexts/availableGoalHint-context";
import { DeletedGoalProvider } from "@src/contexts/deletedGoal-context";
import DeletedGoals from "@pages/GoalsPage/components/DeletedGoals";
import ArchivedGoals from "@pages/GoalsPage/components/ArchivedGoals";
import GoalItemSummary from "@src/common/GoalItemSummary/GoalItemSummary";
import AvailableGoalHints from "@pages/GoalsPage/components/AvailableGoalHints";
import { useGetGoalById } from "@src/hooks/api/Goals/useGetGoalById";
import { useGetArchivedGoals } from "@src/hooks/api/Goals/useGetArchivedGoals";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/useGetDeletedGoals";
import { useParams } from "react-router-dom";
import GoalsList from "../GoalsList";
import GoalHistory from "./components/GoalHistory";
import "./GoalSublist.scss";

export const GoalSublist = ({ goals }: { goals: GoalItem[] }) => {
  const { parentId } = useParams();
  const { data: parentGoal } = useGetGoalById(parentId || "");
  const [goalHints, setGoalHints] = useState<GoalItem[]>([]);
  const { t } = useTranslation();
  const action = useRecoilValue(lastAction);
  const goalID = useRecoilValue(displayGoalId);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const { archivedGoals } = useGetArchivedGoals(parentId || "");
  const { deletedGoals } = useGetDeletedGoals(parentId || "");

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
  }, [action, parentId, showSuggestionModal, showChangesModal, goalID]);

  // TODO: re-implement sorting of goals

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
            <GoalsList goals={goals} />
            <AvailableGoalHintProvider goalHints={goalHints}>
              <AvailableGoalHints goals={goalHints} />
            </AvailableGoalHintProvider>
            <DeletedGoalProvider>
              <DeletedGoals deletedGoals={deletedGoals || []} />
            </DeletedGoalProvider>
            <ArchivedGoals goals={archivedGoals || []} />
          </div>
        </div>
      </div>
    </div>
  );
};
