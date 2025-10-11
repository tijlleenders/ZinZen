import React from "react";

import useGoalStore from "@src/hooks/useGoalStore";
import { GoalItem } from "@src/models/GoalItem";
import { useConvertToNormalGoal } from "@src/hooks/api/SharedWMGoals/useConvertToNormalGoal";
import { useDeleteGoal } from "@src/hooks/api/Goals/mutations/useDeleteGoal";
import { GoalActionsModal, Action } from "@components/GoalActionsModal";

const PartnerGoalActions = ({ goal }: { goal: GoalItem }) => {
  const { openEditMode, handleMove } = useGoalStore();
  const { deleteGoalMutation } = useDeleteGoal();
  const { convertToNormalGoal } = useConvertToNormalGoal();

  const handleDeleteGoal = async () => {
    await deleteGoalMutation(goal);
  };

  const handleCollaborate = async () => {
    await convertToNormalGoal(goal);
    window.history.back();
  };

  const handleMoveGoal = async () => {
    await handleMove(goal);
    window.history.back();
  };

  const actions: Action[] = [
    {
      label: "Delete",
      icon: "Delete",
      onClick: handleDeleteGoal,
    },
    {
      label: "Collaborate",
      icon: "Collaborate",
      onClick: handleCollaborate,
      show: goal.parentGoalId === "root",
      requiresConfirmation: true,
      confirmationCategory: "collaboration",
      confirmationAction: "colabRequest",
      dataTestId: "collaborate-action",
    },
    {
      label: "Edit",
      icon: "Edit",
      onClick: () => openEditMode(goal),
    },
    {
      label: "Move",
      icon: "Move",
      onClick: handleMoveGoal,
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "move",
      dataTestId: "move-action",
    },
  ];

  return <GoalActionsModal goal={goal} actions={actions} showSummary onHeaderClick={() => openEditMode(goal)} />;
};

export default PartnerGoalActions;
