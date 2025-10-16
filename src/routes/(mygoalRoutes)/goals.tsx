import React from "react";
import AppLayout from "@src/layouts/AppLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";

const RouteComponent = () => {
  return (
    <AppLayout title="myGoals">
      <Outlet />
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
