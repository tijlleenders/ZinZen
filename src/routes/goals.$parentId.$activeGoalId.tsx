import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { getGoalById } from "@src/api/GoalsAPI";
import GoalModals from "@pages/GoalsPage/GoalModals";

const GoalsParentActiveComponent = () => <GoalModals />;

export const Route = createFileRoute("/goals/$parentId/$activeGoalId")({
  loader: async ({ context: { queryClient }, params: { activeGoalId } }) => {
    await queryClient.fetchQuery({
      queryKey: GOAL_QUERY_KEYS.detail(activeGoalId),
      queryFn: () => getGoalById(activeGoalId),
    });
    return null;
  },
  component: GoalsParentActiveComponent,
});
