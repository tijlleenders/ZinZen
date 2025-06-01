import React from "react";
import { useRecoilValue } from "recoil";
import { useParams, useSearchParams } from "react-router-dom";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import { TGoalCategory } from "@src/models/GoalItem";
import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import { darkModeState } from "@src/store";

import GoalsList from "@components/GoalsComponents/GoalsList";
import AppLayout from "@src/layouts/AppLayout";

import RegularGoalActions from "@components/GoalsComponents/MyGoalActions/RegularGoalActions";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import { goalCategories } from "@src/constants/goals";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { useGetSharedWMGoalById } from "@src/hooks/api/SharedWMGoals/useGetSharedWMGoalById";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";
import { TGoalConfigMode } from "@src/types";
import { useGetSharedWMActiveGoals } from "@src/hooks/api/SharedWMGoals/useGetSharedWMActiveGoals";
import InvitationStatus from "./InvitationStatus";

const PartnerGoals = () => {
  const [searchParams] = useSearchParams();
  const { parentId = "root", partnerId } = useParams();

  const { partner: contact } = useGetContactByPartnerId(partnerId || "");
  const { activeSharedWMGoals } = useGetSharedWMActiveGoals(parentId || "", contact?.relId || "");

  const showOptions = searchParams.get("showOptions") === "true";
  const goalType = (searchParams.get("type") as TGoalCategory) || "";
  const mode = (searchParams.get("mode") as TGoalConfigMode) || "";

  const { activeGoalId } = useParams();
  const { sharedWMGoal: activeGoal } = useGetSharedWMGoalById(activeGoalId || "");

  const { name = "" } = contact || {};
  const partnerName = name.charAt(0).toUpperCase() + name.slice(1, 4);

  const darkModeStatus = useRecoilValue(darkModeState);

  const { activeSharedWMGoals: activeSharedWmChildrenGoals } = useGetSharedWMActiveGoals(parentId || "");

  // TODO: Add debounce search

  return (
    <AppLayout title={`${partnerName}'s Goals`}>
      {showOptions && activeGoal && <RegularGoalActions goal={activeGoal} />}
      {goalCategories.includes(goalType) && (
        <ConfigGoal type={goalType} goal={activeGoal || createGoalObjectFromTags()} mode={mode} />
      )}

      <div className="myGoals-container">
        {parentId === "root" ? (
          <div className="my-goals-content">
            <div className="d-flex f-col">
              <GoalsList goals={activeSharedWMGoals || []} />
            </div>
            {/* <ArchivedGoals /> */}
          </div>
        ) : (
          <GoalSublist goals={activeSharedWmChildrenGoals || []} />
        )}

        {!activeSharedWMGoals?.length && parentId === "root" && (
          <>
            <InvitationStatus relId={contact?.relId || ""} />
            <img
              style={{ width: 350, height: 350, opacity: 0.3 }}
              src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
              alt="Zinzen"
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PartnerGoals;
