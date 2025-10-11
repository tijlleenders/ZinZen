import React from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useRecoilValue } from "recoil";

import useGoalStore from "@src/hooks/useGoalStore";
import { GoalItem } from "@src/models/GoalItem";
import { ILocationState } from "@src/Interfaces";
import { useDeleteGoal } from "@src/hooks/api/Goals/mutations/useDeleteGoal";
import { useArchiveGoal } from "@src/hooks/api/Goals/mutations/useArchiveGoal";
import { GoalActionsModal } from "@components/GoalActionsModal";
import { createGoalActions } from "@src/factories/goalActionsFactory";
import { darkModeState } from "@src/store";

const MyGoalActions = ({ goal }: { goal: GoalItem }) => {
  const navigate = useNavigate();
  const darkMode = useRecoilValue(darkModeState);
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

  const actions = createGoalActions({
    goal,
    entityType: "active",
    handlers: {
      onDelete: handleDeleteGoal,
      onArchive: handleArchiveGoal,
      onEdit: () => openEditMode(goal),
      onMove: handleMoveGoal,
      onShare: handleShareGoal,
    },
    context: {
      darkMode,
      confirmActionCategory,
    },
  });

  return <GoalActionsModal goal={goal} actions={actions} showSummary onHeaderClick={() => openEditMode(goal)} />;
};

export default MyGoalActions;
