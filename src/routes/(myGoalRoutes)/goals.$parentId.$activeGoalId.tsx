import React from "react";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { getGoalById } from "@src/api/GoalsAPI";
import { getDeletedGoalById } from "@src/api/TrashAPI";
import GoalModals from "@pages/GoalsPage/GoalModals";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useGetDeletedGoalById } from "@src/hooks/api/Goals/queries/useGetDeletedGoalById";
import { DeletedGoalActions, ArchivedGoalActions, HintGoalActions } from "@components/GoalActionsModal";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import { TGoalCategory } from "@src/models/GoalItem";

type ShowOptionsType = "active" | "archived" | "deleted" | "hints";

const GoalsParentActiveComponent = () => {
  const { activeGoalId } = useParams({ strict: false }) as { activeGoalId?: string };
  const { showOptions, type, mode } = useSearch({ strict: false }) as {
    showOptions?: ShowOptionsType;
    type?: TGoalCategory;
    mode?: string;
  };
  const { data: activeGoal } = useGetGoalById(activeGoalId || "", showOptions === "deleted");
  const { data: deletedGoal } = useGetDeletedGoalById(activeGoalId || "", showOptions !== "deleted");

  const goal = showOptions === "deleted" ? deletedGoal : activeGoal;

  if (!goal) {
    return null;
  }

  if (mode === "edit" && type) {
    return <ConfigGoal key={`edit-${activeGoalId}`} type={type} goal={goal} mode="edit" />;
  }

  if (showOptions === "deleted" && deletedGoal) {
    return <DeletedGoalActions goal={deletedGoal} />;
  }

  if (showOptions === "archived" && activeGoal && activeGoal.archived === "true") {
    return <ArchivedGoalActions goal={activeGoal} />;
  }

  if (showOptions === "hints" && activeGoal) {
    return <HintGoalActions goal={activeGoal} />;
  }
  if (activeGoal) {
    return <GoalModals activeGoal={activeGoal} />;
  }
  return null;
};

export const Route = createFileRoute("/(myGoalRoutes)/goals/$parentId/$activeGoalId")({
  loader: async ({ context: { queryClient }, params: { activeGoalId } }) => {
    const urlParams = new URLSearchParams(window.location.search);
    const showOptions = urlParams.get("showOptions") as ShowOptionsType;

    if (showOptions === "deleted") {
      await queryClient.fetchQuery({
        queryKey: GOAL_QUERY_KEYS.detail(activeGoalId),
        queryFn: () => getDeletedGoalById(activeGoalId),
      });
    } else {
      await queryClient.fetchQuery({
        queryKey: GOAL_QUERY_KEYS.detail(activeGoalId),
        queryFn: () => getGoalById(activeGoalId),
      });
    }
    return null;
  },
  component: GoalsParentActiveComponent,
});
