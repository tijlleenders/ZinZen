import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
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
import GoalItemSummary from "@components/GoalItemSummary/GoalItemSummary";
import AvailableGoalHints from "@pages/GoalsPage/components/AvailableGoalHints";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useGetSharedWMGoalsArchived } from "@src/hooks/api/SharedWMGoals/useGetSharedWMGoalsArchived";
import { useGetArchivedGoals } from "@src/hooks/api/Goals/queries/useGetArchivedGoals";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/queries/useGetDeletedGoals";
import { goalConfigDisplayState } from "@src/store/GoalConfigDisplayState";
import { useParams } from "react-router-dom";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";
import GoalsList from "../GoalsList";
import GoalHistory from "./components/GoalHistory";
import "./GoalSublist.scss";
import ConfigGoal from "../../ConfigGoal/ConfigGoal";

export const GoalSublist = ({ goals }: { goals: GoalItem[] }) => {
  const { parentId, partnerId } = useParams();
  const showConfig = useRecoilValue(goalConfigDisplayState);
  const setShowConfig = useSetRecoilState(goalConfigDisplayState);
  const { data: parentGoal } = useGetGoalById(parentId || "");
  const [goalHints, setGoalHints] = useState<GoalItem[]>([]);
  const { t } = useTranslation();
  const action = useRecoilValue(lastAction);
  const goalID = useRecoilValue(displayGoalId);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const { archivedGoals } = useGetArchivedGoals(parentId || "");
  const { deletedGoals } = useGetDeletedGoals(parentId || "");
  const { partner } = useGetContactByPartnerId(partnerId || "");
  const { data: archivedSharedWMGoals } = useGetSharedWMGoalsArchived(parentId || "", partner?.relId || "");

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

  const handleClickableContainerClick = () => {
    setShowConfig(!showConfig);
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => setShowConfig(false);
  }, [setShowConfig]);

  return (
    <div className="sublist-container">
      <GoalHistory />
      <div className="sublist-content-container">
        <div className="sublist-content">
          {!showConfig && (
            <button className="clickable-container" type="button" onClick={handleClickableContainerClick}>
              <p className="sublist-title">{parentGoal && t(parentGoal?.title)}</p>
              {parentGoal && (
                <GoalItemSummary goal={parentGoal} showAddGoal={showConfig} setShowAddGoal={setShowConfig} />
              )}
            </button>
          )}
          <div className="sublist-list-container">
            {showConfig && parentGoal && (
              <div className="config-goal-container">
                <ConfigGoal goal={parentGoal} type={parentGoal?.category} mode="edit" useModal={false} />
              </div>
            )}
            <GoalsList goals={goals} />
            <AvailableGoalHintProvider goalHints={goalHints}>
              <AvailableGoalHints goals={goalHints} />
            </AvailableGoalHintProvider>
            <DeletedGoalProvider>
              <DeletedGoals deletedGoals={deletedGoals || []} />
            </DeletedGoalProvider>
            <ArchivedGoals goals={partnerId ? archivedSharedWMGoals || [] : archivedGoals || []} />
          </div>
        </div>
      </div>
    </div>
  );
};
