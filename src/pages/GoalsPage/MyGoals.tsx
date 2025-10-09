/* eslint-disable complexity */
import React, { useState } from "react";
import { useRecoilValue } from "recoil";

import { Outlet, useLocation, useParams, useSearch } from "@tanstack/react-router";

import { TGoalCategory } from "@src/models/GoalItem";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { searchQueryState } from "@src/store/GoalsState";

import GoalsList from "@components/GoalsComponents/GoalsList";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";

import { TGoalConfigMode } from "@src/types";
import { DeletedGoalProvider } from "@src/contexts/deletedGoal-context";
import { goalCategories } from "@src/constants/goals";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";
import { useGetArchivedGoals } from "@src/hooks/api/Goals/queries/useGetArchivedGoals";
import { ActionModal } from "@components/GoalsComponents/MyGoal/MyGoal";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/queries/useGetDeletedGoals";
import GoalHistory from "@components/GoalsComponents/GoalSublist/components/GoalHistory";
import GoalItemSummary from "@components/GoalItemSummary/GoalItemSummary";
import { useTranslation } from "react-i18next";
import DeletedGoals from "./components/DeletedGoals";
import ArchivedGoals from "./components/ArchivedGoals";

import "./GoalsPage.scss";
import GoalModals from "./GoalModals";
import { Route } from "@src/routes/goals.$parentId";
import ZinZenBgImage from "./ZinZenBgImage";

// TODO: re-implement sorting priority goals

export const MyGoals = () => {
  const { parentId = "root" } = Route.useParams();
  const location = useLocation();
  const { activeGoals } = useGetActiveGoals(parentId);
  const searchQuery = useRecoilValue(searchQueryState);

  // const isActiveGoalIdEmpty = activeGoalId === "";
  // const { data: activeGoal } = useGetGoalById(activeGoalId || "", isActiveGoalIdEmpty);
  const { archivedGoals, isLoading: isArchivedGoalsLoading } = useGetArchivedGoals(parentId);
  const { deletedGoals, isLoading: isDeletedGoalsLoading } = useGetDeletedGoals(parentId);

  const filteredActiveGoals = activeGoals?.filter((goal) =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // const goalsHistory = location.state?.goalsHistory ?? [];
  // const { data: parentGoal } = useGetGoalById(parentId);
  // const [showConfig, setShowConfig] = useState(filteredActiveGoals?.length === 0);
  // const handleToggleConfig = () => {
  //   setShowConfig(!showConfig);
  // };
  // const { t } = useTranslation();
  return (
    <>
      <div className="myGoals-container">
        {/* {parentId !== "root" && (
          <>
            <GoalHistory showConfig={showConfig} setShowConfig={setShowConfig} goalsHistory={goalsHistory} />
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
            </div>
          </>
        )} */}
        <div className="my-goals-content">
          <GoalsList goals={filteredActiveGoals || []} />
          {!isDeletedGoalsLoading && (
            <DeletedGoalProvider>
              <DeletedGoals deletedGoals={deletedGoals || []} />
            </DeletedGoalProvider>
          )}
          {!isArchivedGoalsLoading && <ArchivedGoals goals={archivedGoals || []} />}
        </div>

        <ZinZenBgImage />
      </div>
      {/* {activeGoal && location.state?.actionModalType === ActionModal.ACTIVE && <GoalModals activeGoal={activeGoal} />} */}
      <Outlet />
    </>
  );
};
