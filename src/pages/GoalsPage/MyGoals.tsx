/* eslint-disable complexity */
import React from "react";
import { Outlet } from "@tanstack/react-router";

import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";
import DeletedGoals from "./components/DeletedGoals";
import ArchivedGoals from "./components/ArchivedGoals";

import "./GoalsPage.scss";
import AvailableGoalHints from "./components/AvailableGoalHints";
import "./MyGoals.scss";
import ZinZenBgImage from "./ZinzenBgImage";
import SubgoalLayout from "./SubgoalLayout";
import { ActiveGoals } from "./components/ActiveGoals";

// TODO: re-implement sorting priority goals

interface MyGoalsProps {
  parentId: string;
}

export const MyGoals = ({ parentId }: MyGoalsProps) => {
  const { data: activeGoals, isLoading: isLoadingActiveGoals } = useGetActiveGoals(parentId || "root");

  const { data: parentGoal } = useGetGoalById(parentId);

  const isSublist = parentId !== "root";

  return (
    <div className="goals-container">
      {isSublist && <SubgoalLayout subgoalsPresent={activeGoals && activeGoals.length > 0} parentGoal={parentGoal} />}
      <div className="my-goals-content">
        {activeGoals && <ActiveGoals goals={activeGoals} />}
        {isSublist && parentGoal && <AvailableGoalHints parentGoal={parentGoal} />}
        <DeletedGoals parentId={parentId} />
        <ArchivedGoals parentId={parentId} />
      </div>

      <ZinZenBgImage activeGoalsPresent={activeGoals && activeGoals.length > 0} />
      <Outlet />
    </div>
  );
};
