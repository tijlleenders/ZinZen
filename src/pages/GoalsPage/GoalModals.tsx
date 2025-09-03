import React from "react";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import RegularGoalActions from "@components/GoalsComponents/MyGoalActions/RegularGoalActions";
import ShareGoalModal from "@pages/GoalsPage/components/modals/ShareGoalModal";
import Participants from "@components/GoalsComponents/Participants";
import { GoalItem } from "@src/models/GoalItem";
import { useSearchParams } from "react-router-dom";

const GoalModals = ({ activeGoal }: { activeGoal: GoalItem }) => {
  const [searchParams] = useSearchParams();
  const showShareModal = searchParams.get("share") === "true";
  const showOptions = searchParams.get("showOptions") === "true" && activeGoal && activeGoal.archived === "false";

  const showParticipants = searchParams.get("showParticipants") === "true";
  const showNewChanges = searchParams.get("showNewChanges") === "true";

  return (
    <>
      {showOptions && <RegularGoalActions goal={activeGoal} />}
      {showShareModal && activeGoal && <ShareGoalModal goal={activeGoal} />}
      {showParticipants && <Participants />}
      {showNewChanges && activeGoal && <DisplayChangesModal currentMainGoal={activeGoal} />}
    </>
  );
};

export default GoalModals;
