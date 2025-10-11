/* eslint-disable no-use-before-define */
import React from "react";
import AppLayout from "@src/layouts/AppLayout";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import { goalCategories } from "@src/constants/goals";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";

const RouteComponent = () => {
  const search = Route.useSearch();
  const goalType = search.type || "";
  const mode = search.mode || "";
  const { activeGoalId } = useParams({ strict: false }) as { activeGoalId?: string };
  const { data: activeGoal } = useGetGoalById(activeGoalId);
  return (
    <AppLayout title="myGoals">
      <Outlet />
      {goalCategories.includes(goalType) && (
        <ConfigGoal
          key={`${mode}-${activeGoalId}`}
          type={goalType}
          goal={mode === "edit" && activeGoal ? activeGoal : createGoalObjectFromTags()}
          mode={mode}
        />
      )}
    </AppLayout>
  );
};

type Params = {
  type: TGoalCategory;
  mode: TGoalConfigMode;
};

export const Route = createFileRoute("/(mygoalRoutes)/goals")({
  component: RouteComponent,
  validateSearch: (search: { type: TGoalCategory; mode: TGoalConfigMode }): Params => {
    return {
      type: search.type,
      mode: search.mode,
    };
  },
});
