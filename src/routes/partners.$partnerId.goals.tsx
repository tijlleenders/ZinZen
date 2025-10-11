import React from "react";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import AppLayout from "@src/layouts/AppLayout";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";
import { goalCategories } from "@src/constants/goals";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import { useGetSharedWMGoalById } from "@src/hooks/api/SharedWMGoals/useGetSharedWMGoalById";

const PartnerGoalsComponent = () => {
  const { partnerId } = Route.useParams();
  const { partner } = useGetContactByPartnerId(partnerId);
  const { name = "" } = partner || {};
  const partnerName = name.charAt(0).toUpperCase() + name.slice(1, 4);
  const search = Route.useSearch();
  const goalType = search.type || "";
  const mode = search.mode || "";
  const { activeGoalId } = useParams({ strict: false }) as { activeGoalId?: string };
  const { sharedWMGoal: activeGoal } = useGetSharedWMGoalById(activeGoalId || "");

  return (
    <AppLayout title={`${partnerName}'s Goals`}>
      <Outlet />
      {goalCategories.includes(goalType) && (
        <ConfigGoal type={goalType} goal={activeGoal || createGoalObjectFromTags()} mode={mode} />
      )}
    </AppLayout>
  );
};

export const Route = createFileRoute("/partners/$partnerId/goals")({
  validateSearch: (search: { type: TGoalCategory; mode: TGoalConfigMode }) => search,
  component: PartnerGoalsComponent,
});
