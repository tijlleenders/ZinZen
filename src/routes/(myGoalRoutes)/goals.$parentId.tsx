import React from "react";
import { useRecoilValue } from "recoil";
import { createFileRoute } from "@tanstack/react-router";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { getActiveGoals } from "@src/api/GoalsAPI";
import { MyGoals } from "@pages/GoalsPage/MyGoals";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { TGoalConfigMode } from "@src/types";
import { TGoalCategory } from "@src/models/GoalItem";
import AppLayout from "@src/layouts/AppLayout/AppLayout";
import { PageTitle } from "@src/constants/pageTitle";
import { themeSelectionMode } from "@src/store/ThemeState";
import { moveGoalState } from "@src/store/moveGoalState";
import GoalsFab from "@components/fab/GoalsFab";
import GoalMoveFab from "@components/fab/GoalMoveFab";
import ThemeConfirmFab from "@components/fab/ThemeConfirmFab";

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
    const { mode, type } = search;
    const themeSelection = useRecoilValue(themeSelectionMode);
    const goalToMove = useRecoilValue(moveGoalState);

    return (
      <AppLayout title={PageTitle.MyGoals} enableSearch>
        <MyGoals parentId={parentId || "root"} />
        {mode === "add" && type && (
          <ConfigGoal key={`add-${parentId}`} type={type} goal={createGoalObjectFromTags()} mode="add" />
        )}
        {themeSelection ? <ThemeConfirmFab /> : goalToMove ? <GoalMoveFab /> : <GoalsFab />}
      </AppLayout>
    );
  },
});
