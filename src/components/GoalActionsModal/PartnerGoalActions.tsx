import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import useGoalStore from "@src/hooks/useGoalStore";
import { createGoalActions } from "@src/factories/goalActionsFactory";

import { useDeleteGoal } from "@src/hooks/api/Goals/mutations/useDeleteGoal";
import { useConvertToNormalGoal } from "@src/hooks/api/SharedWMGoals/useConvertToNormalGoal";
import GoalActionsModal from "./GoalActionsModal";

interface PartnerGoalActionsProps {
  goal: GoalItem;
}

const PartnerGoalActions: React.FC<PartnerGoalActionsProps> = ({ goal }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { deleteGoalMutation } = useDeleteGoal();
  const { convertToNormalGoal } = useConvertToNormalGoal();
  const { openEditMode, handleMove } = useGoalStore();

  const handleMoveGoal = async () => {
    await handleMove(goal);
    window.history.back();
  };

  const actions = createGoalActions({
    goal,
    entityType: "partner-active",
    handlers: {
      onEdit: () => openEditMode(goal),
      onDelete: () => deleteGoalMutation(goal),
      onCollaborate: () => convertToNormalGoal(goal),
      onMove: handleMoveGoal,
    },
    context: {
      darkMode,
    },
  });

  return <GoalActionsModal goal={goal} actions={actions} showSummary onHeaderClick={() => openEditMode(goal)} />;
};

export default PartnerGoalActions;
