/* eslint-disable complexity */
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { searchQueryState } from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { DeletedGoalProvider } from "@src/contexts/deletedGoal-context";
import DeletedGoals from "@pages/GoalsPage/components/DeletedGoals";
import ArchivedGoals from "@pages/GoalsPage/components/ArchivedGoals";
import GoalItemSummary from "@components/GoalItemSummary/GoalItemSummary";
import AvailableGoalHints from "@pages/GoalsPage/components/AvailableGoalHints";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useGetSharedWMGoalsArchived } from "@src/hooks/api/SharedWMGoals/useGetSharedWMGoalsArchived";
import { useGetArchivedGoals } from "@src/hooks/api/Goals/queries/useGetArchivedGoals";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/queries/useGetDeletedGoals";
import { Spin } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";
import GoalsList from "../GoalsList";
import GoalHistory from "./components/GoalHistory";
import "./GoalSublist.scss";
import ConfigGoal from "../../ConfigGoal/ConfigGoal";

export const GoalSublist = ({ goals, isLoading }: { goals: GoalItem[]; isLoading: boolean }) => {
  const { parentId, partnerId } = useParams();
  const { data: parentGoal } = useGetGoalById(parentId || "");
  const [showConfig, setShowConfig] = useState(goals.length === 0);
  const { t } = useTranslation();

  const searchQuery = useRecoilValue(searchQueryState);
  const location = useLocation();
  const goalsHistory = location.state?.goalsHistory ?? [];

  const { archivedGoals } = useGetArchivedGoals(parentId || "");
  const { deletedGoals } = useGetDeletedGoals(parentId || "");
  const { partner } = useGetContactByPartnerId(partnerId || "");
  const { data: archivedSharedWMGoals } = useGetSharedWMGoalsArchived(parentId || "", partner?.relId || "");

  const handleToggleConfig = () => {
    setShowConfig(!showConfig);
  };

  return (
    <div className="sublist-container">
      <GoalHistory showConfig={showConfig} setShowConfig={setShowConfig} goalsHistory={goalsHistory} />
      <div className="sublist-content-container">
        <div className="sublist-content">
          <button className="clickable-container" type="button" onClick={handleToggleConfig}>
            {!showConfig ? (
              <>
                <p className="sublist-title">{parentGoal && t(parentGoal?.title)}</p>
                {parentGoal && <GoalItemSummary goal={parentGoal} variant="default" />}
              </>
            ) : null}
          </button>
          <div className="sublist-list-container" style={{ marginTop: !showConfig ? "10px" : "0px" }}>
            {showConfig && parentGoal && searchQuery === "" && (
              <div className="config-goal-container">
                <ConfigGoal
                  key={`edit-${parentGoal.id}`}
                  goal={parentGoal}
                  type={parentGoal?.category}
                  mode="edit"
                  useModal={false}
                  onToggleConfig={handleToggleConfig}
                />
              </div>
            )}
            {isLoading ? (
              <div className="place-middle">
                <Spin />
              </div>
            ) : (
              <GoalsList goals={goals} />
            )}
            <AvailableGoalHints />
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
