/* eslint-disable complexity */
import React from "react";
import { useRecoilValue } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import { TGoalCategory } from "@src/models/GoalItem";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { darkModeState } from "@src/store";
import { searchQueryState } from "@src/store/GoalsState";

import GoalsList from "@components/GoalsComponents/GoalsList";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";

import { useParams, useSearchParams } from "react-router-dom";

import { TGoalConfigMode } from "@src/types";
import { DeletedGoalProvider } from "@src/contexts/deletedGoal-context";
import { goalCategories } from "@src/constants/goals";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";
import { useGetArchivedGoals } from "@src/hooks/api/Goals/queries/useGetArchivedGoals";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/queries/useGetDeletedGoals";
import DeletedGoals from "./components/DeletedGoals";
import ArchivedGoals from "./components/ArchivedGoals";

import "./GoalsPage.scss";
import GoalModals from "./GoalModals";

// TODO: re-implement sorting priority goals

export const MyGoals = () => {
  const { parentId = "root", activeGoalId } = useParams();
  const { activeGoals } = useGetActiveGoals("root");
  const [searchParams] = useSearchParams();
  const searchQuery = useRecoilValue(searchQueryState);

  const { data: activeGoal } = useGetGoalById(activeGoalId || "");

  const { activeGoals: activeChildrenGoals } = useGetActiveGoals(parentId);
  const { archivedGoals } = useGetArchivedGoals(parentId);
  const { deletedGoals } = useGetDeletedGoals(parentId);

  const goalType = (searchParams.get("type") as TGoalCategory) || "";

  const mode = (searchParams.get("mode") as TGoalConfigMode) || "";

  const darkModeStatus = useRecoilValue(darkModeState);

  const zinZenLogoHeight = activeGoals && activeGoals.length > 0 ? 125 : 350;

  const filteredActiveGoals = activeGoals?.filter((goal) =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredActiveChildrenGoals = activeChildrenGoals?.filter((goal) =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!filteredActiveChildrenGoals) return null;

  return (
    <>
      <div className="myGoals-container">
        {parentId === "root" ? (
          <div className="my-goals-content">
            <div className="d-flex f-col">
              <GoalsList goals={filteredActiveGoals || []} />
            </div>
            <DeletedGoalProvider>
              <DeletedGoals deletedGoals={deletedGoals || []} />
            </DeletedGoalProvider>
            <ArchivedGoals goals={archivedGoals || []} />
          </div>
        ) : (
          <div>Loading...</div>
        )}

        <img
          style={{ width: 180, height: zinZenLogoHeight, opacity: 0.3 }}
          src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
          alt="Zinzen"
        />
      </div>

      {/* Modals */}
      {goalCategories.includes(goalType) && (
        <ConfigGoal
          type={goalType}
          goal={mode === "edit" && activeGoal ? activeGoal : createGoalObjectFromTags()}
          mode={mode}
        />
      )}

      {activeGoal && <GoalModals activeGoal={activeGoal} />}
    </>
  );
};
