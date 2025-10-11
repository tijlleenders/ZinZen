import React from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { getActiveGoals } from "@src/api/GoalsAPI";
import { MyGoals } from "@pages/GoalsPage/MyGoals";
import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/queries/useGetDeletedGoals";
import { useGetArchivedGoals } from "@src/hooks/api/Goals/queries/useGetArchivedGoals";

const GoalsParentComponent = () => {
  const { parentId } = useParams({ strict: false });
  const { activeGoals } = useGetActiveGoals(parentId || "root");
  const { deletedGoals } = useGetDeletedGoals(parentId || "root");
  const { archivedGoals } = useGetArchivedGoals(parentId || "root");

  return (
    <MyGoals activeGoals={activeGoals || []} deletedGoals={deletedGoals || []} archivedGoals={archivedGoals || []} />
  );
};

export const Route = createFileRoute("/(mygoalRoutes)/goals/$parentId")({
  loader: async ({ context: { queryClient }, params: { parentId } }) => {
    await queryClient.fetchQuery({
      queryKey: GOAL_QUERY_KEYS.list("active", parentId),
      queryFn: () => getActiveGoals(parentId),
    });
    return null;
  },
  component: GoalsParentComponent,
});
