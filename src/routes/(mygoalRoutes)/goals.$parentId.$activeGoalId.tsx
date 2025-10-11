import React from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { getGoalById } from "@src/api/GoalsAPI";
import GoalModals from "@pages/GoalsPage/GoalModals";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";

const GoalsParentActiveComponent = () => {
  const { activeGoalId } = useParams({ strict: false }) as { activeGoalId?: string };
  const { data: activeGoal } = useGetGoalById(activeGoalId || "");

  if (!activeGoal) {
    return null;
  }

  return <GoalModals activeGoal={activeGoal} />;
};

export const Route = createFileRoute("/(mygoalRoutes)/goals/$parentId/$activeGoalId")({
  loader: async ({ context: { queryClient }, params: { activeGoalId } }) => {
    await queryClient.fetchQuery({
      queryKey: GOAL_QUERY_KEYS.detail(activeGoalId),
      queryFn: () => getGoalById(activeGoalId),
    });
    return null;
  },
  component: GoalsParentActiveComponent,
});
