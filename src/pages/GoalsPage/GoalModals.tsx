import React from "react";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import RegularGoalActions from "@components/GoalsComponents/MyGoalActions/RegularGoalActions";
import ShareGoalModal from "@pages/GoalsPage/components/modals/ShareGoalModal";
import Participants from "@components/GoalsComponents/Participants";
import { useSearch } from "@tanstack/react-router";
import { Route } from "@src/routes/goals.$parentId.$activeGoalId";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";

const GoalModals = () => {
  const { activeGoalId } = Route.useParams();
  const { data: activeGoal } = useGetGoalById(activeGoalId);
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
      {showOptions && <RegularGoalActions goal={activeGoal} />}
      {showShareModal && activeGoal && <ShareGoalModal goal={activeGoal} />}
      {showParticipants && <Participants />}
      {showNewChanges && activeGoal && <DisplayChangesModal currentMainGoal={activeGoal} />}
    </>
  );
};

export default GoalModals;
