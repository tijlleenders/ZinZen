import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppLayout from "@src/layouts/AppLayout";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";

export const Route = createFileRoute("/(partnerGoalRoutes)/partners/$partnerId/goals")({
  validateSearch: (search: { type?: TGoalCategory; mode?: TGoalConfigMode }) => search,
  component: () => {
    const { partnerId } = Route.useParams();
    const { data: partner } = useGetContactByPartnerId(partnerId || "");
    const { name = "" } = partner || {};
    const partnerName = name.charAt(0).toUpperCase() + name.slice(1, 4);

    return (
      <AppLayout title={`${partnerName}'s Goals`}>
        <Outlet />
      </AppLayout>
    );
  },
});
