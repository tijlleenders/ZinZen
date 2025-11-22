import React from "react";
import { useRecoilValue } from "recoil";
import { createFileRoute } from "@tanstack/react-router";
import PartnerGoals from "@pages/GoalsPage/PartnerGoals";
import { useGetSharedWMActiveGoals } from "@src/hooks/api/SharedWMGoals/useGetSharedWMActiveGoals";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";
import { themeSelectionMode } from "@src/store/ThemeState";
import { moveGoalState } from "@src/store/moveGoalState";
import PartnerGoalsFab from "@components/fab/PartnerGoalsFab";
import PartnerGoalMoveFab from "@components/fab/PartnerGoalMoveFab";
import ThemeConfirmFab from "@components/fab/ThemeConfirmFab";

export const Route = createFileRoute("/(partnerGoalRoutes)/partners/$partnerId/goals/$parentId")({
  component: () => {
    const { parentId = "root", partnerId = "" } = Route.useParams();
    const { data: contact } = useGetContactByPartnerId(partnerId);
    const { data: activeSharedWMGoals = [] } = useGetSharedWMActiveGoals(parentId, contact?.relId);
    const themeSelection = useRecoilValue(themeSelectionMode);
    const goalToMove = useRecoilValue(moveGoalState);

    return (
      <>
        <PartnerGoals activeSharedWMGoals={activeSharedWMGoals} parentId={parentId} partnerId={partnerId} />
        {themeSelection ? <ThemeConfirmFab /> : goalToMove ? <PartnerGoalMoveFab /> : <PartnerGoalsFab />}
      </>
    );
  },
});
