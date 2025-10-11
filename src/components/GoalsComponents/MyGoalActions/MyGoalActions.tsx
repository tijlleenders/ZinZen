import React from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

import useGoalStore from "@src/hooks/useGoalStore";
import { GoalItem } from "@src/models/GoalItem";
import { ILocationState } from "@src/Interfaces";
import { useDeleteGoal } from "@src/hooks/api/Goals/mutations/useDeleteGoal";
import { useArchiveGoal } from "@src/hooks/api/Goals/mutations/useArchiveGoal";
import { GoalActionsModal, Action } from "@components/GoalActionsModal";

const MyGoalActions = ({ goal }: { goal: GoalItem }) => {
  const navigate = useNavigate();
  const { openEditMode, handleMove } = useGoalStore();
  const { state, pathname }: { state: ILocationState; pathname: string } = useLocation();
  const { deleteGoalMutation } = useDeleteGoal();
  const { archiveGoalMutation } = useArchiveGoal();

  const confirmActionCategory = goal.typeOfGoal === "shared" && goal.parentGoalId === "root" ? "collaboration" : "goal";

  const handleArchiveGoal = async () => {
    await archiveGoalMutation({ goal });
    const goalTitleElement = document.querySelector(`#goal-${goal.id} .goal-title`) as HTMLElement;
    if (goalTitleElement) {
      goalTitleElement.style.textDecoration = "line-through";
      goalTitleElement.style.textDecorationColor = goal.goalColor;
      goalTitleElement.style.textDecorationThickness = "4px";
    }
    window.history.back();
  };

  const handleDeleteGoal = async () => {
    await deleteGoalMutation(goal);
  };

  const handleMoveGoal = async () => {
    await handleMove(goal);
    window.history.back();
  };

  const handleShareGoal = () => {
    navigate({ to: `${pathname}?share=true`, state, replace: true });
  };

  const actions: Action[] = [
    {
      label: "Delete",
      icon: "Delete",
      onClick: handleDeleteGoal,
    },
    {
      label: "Done",
      icon: "Correct",
      onClick: handleArchiveGoal,
      requiresConfirmation: true,
      confirmationCategory: confirmActionCategory,
      confirmationAction: "archive",
    },
    {
      label: "Share",
      icon: "SingleAvatar",
      onClick: handleShareGoal,
      dataTestId: "share-action",
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

export default MyGoalActions;
