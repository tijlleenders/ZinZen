import React, { useMemo } from "react";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { getGoalById } from "@src/api/GoalsAPI";
import { getDeletedGoalById } from "@src/api/TrashAPI";
import GoalModals from "@pages/GoalsPage/GoalModals";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useGetDeletedGoalById } from "@src/hooks/api/Goals/queries/useGetDeletedGoalById";
import { DeletedGoalActions, ArchivedGoalActions, HintGoalActions } from "@components/GoalActionsModal";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import { TGoalCategory, GoalItem } from "@src/models/GoalItem";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";

type ShowOptionsType = "active" | "archived" | "deleted" | "hints";

const GoalsParentActiveComponent = () => {
  const { activeGoalId, parentId } = useParams({ strict: false }) as { activeGoalId?: string; parentId?: string };
  const { showOptions, type, mode } = useSearch({ strict: false }) as {
    showOptions?: ShowOptionsType;
    type?: TGoalCategory;
    mode?: string;
  };
  const { data: activeGoal } = useGetGoalById(activeGoalId || "", showOptions === "deleted" || showOptions === "hints");
  const { data: deletedGoal } = useGetDeletedGoalById(activeGoalId || "", showOptions !== "deleted");
  const { data: parentGoal } = useGetGoalById(parentId || "", showOptions !== "hints");

  const hintGoal = useMemo<GoalItem | null>(() => {
    if (showOptions === "hints" && parentGoal && activeGoalId) {
      const hint = parentGoal.hints?.availableGoalHints?.find((h) => h.id === activeGoalId);
      if (hint) {
        return createGoalObjectFromTags({ ...hint, parentGoalId: parentGoal.id, id: hint.id });
      }
    }
    return null;
  }, [showOptions, parentGoal, activeGoalId]);

  const goal = showOptions === "deleted" ? deletedGoal : activeGoal;

  if (!goal && showOptions !== "hints") {
    return null;
  }

  if (showOptions === "hints") {
    if (!hintGoal) {
      return null;
    }
    return <HintGoalActions goal={hintGoal} />;
  }

  if (mode === "edit" && type && goal) {
    return <ConfigGoal key={`edit-${activeGoalId}`} type={type} goal={goal} mode="edit" />;
  }

  if (showOptions === "deleted" && deletedGoal) {
    return <DeletedGoalActions goal={deletedGoal} />;
  }

  if (showOptions === "archived" && activeGoal && activeGoal.archived === "true") {
    return <ArchivedGoalActions goal={activeGoal} />;
  }
  if (activeGoal) {
    return <GoalModals activeGoal={activeGoal} />;
  }
  return null;
};

export const Route = createFileRoute("/(myGoalRoutes)/goals/$parentId/$activeGoalId")({
  loader: async ({ context: { queryClient }, params: { activeGoalId, parentId } }) => {
    const urlParams = new URLSearchParams(window.location.search);
    const showOptions = urlParams.get("showOptions") as ShowOptionsType;

    if (showOptions === "deleted") {
      await queryClient.fetchQuery({
        queryKey: GOAL_QUERY_KEYS.detail(activeGoalId),
        queryFn: () => getDeletedGoalById(activeGoalId),
      });
    } else if (showOptions === "hints") {
      // For hints, fetch the parent goal instead of the hint (since hints don't exist in DB)
      await queryClient.fetchQuery({
        queryKey: GOAL_QUERY_KEYS.detail(parentId),
        queryFn: () => getGoalById(parentId),
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
