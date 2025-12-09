import React from "react";
import { Outlet } from "@tanstack/react-router";

import GoalsList from "@components/GoalsComponents/GoalsList";

import { useGetSharedWMGoalById } from "@src/hooks/api/SharedWMGoals/useGetSharedWMGoalById";
import { GoalItem } from "@src/models/GoalItem";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";
import InvitationStatus from "./InvitationStatus";
import "@src/pages/GoalsPage/GoalsPage.scss";
import SubgoalLayout from "./SubgoalLayout";
import ZinZenBgImage from "./ZinzenBgImage";

interface PartnerGoalsProps {
  activeSharedWMGoals: GoalItem[];
  isLoadingSubgoals?: boolean;
  parentId: string;
  partnerId: string;
}

// TODO: Add shared archived goals
const PartnerGoals = ({ activeSharedWMGoals, isLoadingSubgoals = false, parentId, partnerId }: PartnerGoalsProps) => {
  const { data: contact } = useGetContactByPartnerId(partnerId);
  const { data: parentGoal } = useGetSharedWMGoalById(parentId);

  // TODO: Add debounce search

  const isSublist = parentId !== "root";

  return (
    <div className="goals-container">
      {!activeSharedWMGoals?.length && parentId === "root" && (
        <>
          <InvitationStatus relId={contact?.relId || ""} />
          <ZinZenBgImage activeGoalsPresent={activeSharedWMGoals && activeSharedWMGoals.length > 0} />
        </>
      )}
      {isSublist && (
        <SubgoalLayout
          subgoalsPresent={activeSharedWMGoals && activeSharedWMGoals.length > 0}
          isLoadingSubgoals={isLoadingSubgoals}
          parentGoal={parentGoal}
        />
      )}
      <div className="my-goals-content">
        <GoalsList goals={activeSharedWMGoals || []} />
      </div>
      <ZinZenBgImage activeGoalsPresent={activeSharedWMGoals && activeSharedWMGoals.length > 0} />
      <Outlet />
    </div>
  );
};

export default PartnerGoals;
