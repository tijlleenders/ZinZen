import React from "react";
import { Outlet, useParams } from "@tanstack/react-router";

import GoalsList from "@components/GoalsComponents/GoalsList";

import { useGetSharedWMGoalById } from "@src/hooks/api/SharedWMGoals/useGetSharedWMGoalById";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";
import { useGetSharedWMActiveGoals } from "@src/hooks/api/SharedWMGoals/useGetSharedWMActiveGoals";
import InvitationStatus from "./InvitationStatus";
import ZinZenBgImage from "./ZinZenBgImage";
import "@src/pages/GoalsPage/GoalsPage.scss";
import SubgoalLayout from "./SubgoalLayout";

const PartnerGoals = () => {
  const params = useParams({ strict: false }) as { parentId?: string; partnerId?: string; activeGoalId?: string };
  const parentId = params.parentId || "root";
  const partnerId = params.partnerId || "";

  const { partner: contact } = useGetContactByPartnerId(partnerId);
  const { activeSharedWMGoals } = useGetSharedWMActiveGoals(parentId, contact?.relId || "");
  const { sharedWMGoal: parentGoal } = useGetSharedWMGoalById(parentId);

  // TODO: Add debounce search

  const isSublist = parentId !== "root";

  return (
    <div className="myGoals-container">
      {!activeSharedWMGoals?.length && parentId === "root" && (
        <>
          <InvitationStatus relId={contact?.relId || ""} />
          <ZinZenBgImage activeGoalsPresent={activeSharedWMGoals && activeSharedWMGoals.length > 0} />
        </>
      )}
      {parentGoal && isSublist && (
        <SubgoalLayout
          subgoalsPresent={activeSharedWMGoals && activeSharedWMGoals.length > 0}
          parentGoal={parentGoal}
        />
      )}
      <div className="my-goals-content">
        <GoalsList goals={activeSharedWMGoals || []} />
        {/* <ArchivedGoals /> */}
      </div>
      <Outlet />
    </div>
  );
};

export default PartnerGoals;
