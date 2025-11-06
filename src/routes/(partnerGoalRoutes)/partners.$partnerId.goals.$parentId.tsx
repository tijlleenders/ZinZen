import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import PartnerGoals from "@pages/GoalsPage/PartnerGoals";
import { useGetSharedWMActiveGoals } from "@src/hooks/api/SharedWMGoals/useGetSharedWMActiveGoals";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";

export const Route = createFileRoute("/(partnerGoalRoutes)/partners/$partnerId/goals/$parentId")({
  component: () => {
    const { parentId = "root", partnerId = "" } = Route.useParams();
    const { data: contact } = useGetContactByPartnerId(partnerId);
    const { data: activeSharedWMGoals = [] } = useGetSharedWMActiveGoals(parentId, contact?.relId);
    return <PartnerGoals activeSharedWMGoals={activeSharedWMGoals} parentId={parentId} partnerId={partnerId} />;
  },
});
