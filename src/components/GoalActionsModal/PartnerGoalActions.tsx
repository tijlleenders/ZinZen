import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import useGoalStore from "@src/hooks/useGoalStore";
import { createPartnerActiveGoalActions } from "@src/factories/goalActionsFactory";

import { useDeleteGoal } from "@src/hooks/api/Goals/mutations/useDeleteGoal";
import { useConvertToNormalGoal } from "@src/hooks/api/SharedWMGoals/useConvertToNormalGoal";
import GoalActionsModal from "./GoalActionsModal";

interface PartnerGoalActionsProps {
  goal: GoalItem;
}

const PartnerGoalActions: React.FC<PartnerGoalActionsProps> = ({ goal }) => {
  const { deleteGoalMutation } = useDeleteGoal();
  const { convertToNormalGoal } = useConvertToNormalGoal();
  const { openEditMode, handleMove } = useGoalStore();

  const handleMoveGoal = async () => {
    await handleMove(goal);
    window.history.back();
  };

  const actions = createPartnerActiveGoalActions({
    goal,
    handlers: {
      onEdit: () => openEditMode(goal),
      onDelete: () => deleteGoalMutation(goal),
      onCollaborate: () => convertToNormalGoal(goal),
      onMove: handleMoveGoal,
    },
  });

  return <GoalActionsModal goal={goal} actions={actions} showSummary onHeaderClick={() => openEditMode(goal)} />;
};

export default PartnerGoalActions;
