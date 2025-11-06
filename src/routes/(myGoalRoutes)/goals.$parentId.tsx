import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { getActiveGoals } from "@src/api/GoalsAPI";
import { MyGoals } from "@pages/GoalsPage/MyGoals";
import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/queries/useGetDeletedGoals";
import { useGetArchivedGoals } from "@src/hooks/api/Goals/queries/useGetArchivedGoals";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { TGoalConfigMode } from "@src/types";
import { TGoalCategory } from "@src/models/GoalItem";

export const Route = createFileRoute("/(myGoalRoutes)/goals/$parentId")({
  validateSearch: (search: { type?: TGoalCategory; mode?: TGoalConfigMode }) => search,
  loader: async ({ context: { queryClient }, params: { parentId } }) => {
    await queryClient.fetchQuery({
      queryKey: GOAL_QUERY_KEYS.list("active", parentId),
      queryFn: () => getActiveGoals(parentId),
    });
    return null;
  },
  component: () => {
    const search = Route.useSearch();
    const { parentId } = Route.useParams();
    const { activeGoals, isLoading: isLoadingActiveGoals } = useGetActiveGoals(parentId || "root");
    const { deletedGoals } = useGetDeletedGoals(parentId || "root");
    const { archivedGoals } = useGetArchivedGoals(parentId || "root");
    const { mode, type } = search;
    return (
      <>
        <MyGoals
          activeGoals={activeGoals || []}
          isLoadingActiveGoals={isLoadingActiveGoals}
          deletedGoals={deletedGoals || []}
          archivedGoals={archivedGoals || []}
          parentId={parentId || "root"}
        />
        {mode === "add" && type && (
          <ConfigGoal key={`add-${parentId}`} type={type} goal={createGoalObjectFromTags()} mode="add" />
        )}
      </>
    );
  },
});
