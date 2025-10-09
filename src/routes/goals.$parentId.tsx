import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { getActiveGoals } from "@src/api/GoalsAPI";
import { MyGoals } from "@pages/GoalsPage/MyGoals";

const GoalsParentComponent = () => <MyGoals />;

export const Route = createFileRoute("/goals/$parentId")({
  loader: async ({ context: { queryClient }, params: { parentId } }) => {
    await queryClient.fetchQuery({
      queryKey: GOAL_QUERY_KEYS.list("active", parentId),
      queryFn: () => getActiveGoals(parentId),
    });
    return null;
  },
  component: GoalsParentComponent,
});
