import React from "react";
import { useRecoilValue } from "recoil";
import { createFileRoute } from "@tanstack/react-router";
import PartnerGoals from "@pages/GoalsPage/PartnerGoals";
import { useGetSharedWMActiveGoals } from "@src/hooks/api/SharedWMGoals/useGetSharedWMActiveGoals";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";
import { moveGoalState } from "@src/store/moveGoalState";
import PartnerGoalMoveFab from "@components/fab/PartnerGoalMoveFab";
import GoalsFab from "@components/fab/GoalsFab";

export const Route = createFileRoute("/(partnerGoalRoutes)/partners/$partnerId/goals/$parentId")({
  component: () => {
    const { parentId = "root", partnerId = "" } = Route.useParams();
    const { data: contact } = useGetContactByPartnerId(partnerId);
    const { data: activeSharedWMGoals = [] } = useGetSharedWMActiveGoals(parentId, contact?.relId);
    const goalToMove = useRecoilValue(moveGoalState);

    return (
      <>
        <PartnerGoals activeSharedWMGoals={activeSharedWMGoals} parentId={parentId} partnerId={partnerId} />
        {contact?.accepted && (goalToMove ? <PartnerGoalMoveFab /> : <GoalsFab />)}
      </>
    );
  },
});
