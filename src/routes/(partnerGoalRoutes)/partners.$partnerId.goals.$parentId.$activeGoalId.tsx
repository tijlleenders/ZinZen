import React from "react";
import { PartnerGoalActions } from "@components/GoalActionsModal";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import { useGetSharedWMGoalById } from "@src/hooks/api/SharedWMGoals/useGetSharedWMGoalById";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";

type ShowOptionsType = "active";

export const Route = createFileRoute("/(partnerGoalRoutes)/partners/$partnerId/goals/$parentId/$activeGoalId")({
  component: () => {
    const { activeGoalId } = useParams({ strict: false }) as {
      activeGoalId?: string;
    };
    const { type, mode } = useSearch({ strict: false }) as { type?: TGoalCategory; mode?: TGoalConfigMode };
    const { showOptions } = useSearch({ strict: false }) as { showOptions?: ShowOptionsType };
    const { data: activeGoal } = useGetSharedWMGoalById(activeGoalId || "");

    if (activeGoal && mode === "edit" && type) {
      return <ConfigGoal key={`edit-${activeGoalId}`} type={type} goal={activeGoal} mode={mode} />;
    }
    return showOptions === "active" && activeGoal && activeGoal.archived !== "true" ? (
      <PartnerGoalActions goal={activeGoal} />
    ) : null;
  },
});
