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
import AppLayout from "@src/layouts/AppLayout/AppLayout";
import { PageTitle } from "@src/constants/pageTitle";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useHeaderLogoHandlers } from "@src/hooks/useHeaderLogoHandlers";
import { useBottomNavbarNavigation } from "@src/hooks/useBottomNavbarNavigation";

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
    const { data: parentGoal } = useGetGoalById(parentId);
    const { data: activeGoals, isLoading: isLoadingActiveGoals } = useGetActiveGoals(parentId || "root");
    const { data: deletedGoals } = useGetDeletedGoals(parentId || "root");
    const { data: archivedGoals } = useGetArchivedGoals(parentId || "root");
    const { mode, type } = search;
    const { handleEnterPartnerMode } = useHeaderLogoHandlers();
    const { onScheduleClick, onJournalClick, onGoalsGoBack } = useBottomNavbarNavigation();

    return (
      <AppLayout
        title={PageTitle.MyGoals}
        enableSearch
        onTitleClick={() => {
          if (!parentGoal) return;
          window.history.go(-parentGoal.depth || 0);
        }}
        onLogoClick={handleEnterPartnerMode}
        onScheduleClick={onScheduleClick}
        onGoalsClick={onGoalsGoBack}
        onJournalClick={onJournalClick}
      >
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
      </AppLayout>
    );
  },
});
