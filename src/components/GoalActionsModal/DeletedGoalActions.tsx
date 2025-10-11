import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { TrashItem } from "@src/models/TrashItem";
import { useDeleteGoal } from "@src/hooks/api/Goals/mutations/useDeleteGoal";
import { useRestoreDeletedGoal } from "@src/hooks/api/Goals/mutations/useRestoreDeletedGoal";
import GoalActionsModal from "./GoalActionsModal";
import { createGoalActions } from "@src/factories/goalActionsFactory";

interface DeletedGoalActionsProps {
  goal: TrashItem;
}

const DeletedGoalActions: React.FC<DeletedGoalActionsProps> = ({ goal }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { restoreDeletedGoalMutation } = useRestoreDeletedGoal();
  const { deleteGoalMutation } = useDeleteGoal();

  const actions = createGoalActions({
    goal,
    entityType: "deleted",
    handlers: {
      onRestore: () => restoreDeletedGoalMutation({ goal }),
      onDelete: () => deleteGoalMutation(goal),
    },
    context: {
      darkMode,
    },
  });

  return <GoalActionsModal goal={goal} actions={actions} onCancel={() => window.history.back()} />;
};

export default DeletedGoalActions;
