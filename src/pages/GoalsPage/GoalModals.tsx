import React from "react";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import MyGoalActions from "@components/GoalsComponents/MyGoalActions/MyGoalActions";
import PartnerGoalActions from "@components/GoalsComponents/MyGoalActions/PartnerGoalActions";
import ShareGoalModal from "@pages/GoalsPage/components/modals/ShareGoalModal";
import Participants from "@components/GoalsComponents/Participants";
import { useParams, useSearch } from "@tanstack/react-router";
import { GoalItem } from "@src/models/GoalItem";

const GoalModals = ({ activeGoal }: { activeGoal: GoalItem }) => {
  const { partnerId } = useParams({ strict: false });
  const isPartnerModeActive = !!partnerId;

  const search = useSearch({ strict: false }) as {
    share?: string;
    showOptions?: string;
    showParticipants?: string;
    showNewChanges?: string;
  };
  const showShareModal = search.share;
  const showOptions = search.showOptions && activeGoal && activeGoal.archived === "false";

  const { showParticipants, showNewChanges } = search;

  return (
    <>
      {showOptions &&
        (isPartnerModeActive ? <PartnerGoalActions goal={activeGoal} /> : <MyGoalActions goal={activeGoal} />)}
      {showShareModal && activeGoal && <ShareGoalModal goal={activeGoal} />}
      {showParticipants && <Participants />}
      {showNewChanges && activeGoal && <DisplayChangesModal currentMainGoal={activeGoal} />}
    </>
  );
};

export default GoalModals;
