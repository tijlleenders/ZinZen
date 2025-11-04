import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { useDeleteGoal } from "@src/hooks/api/Goals/mutations/useDeleteGoal";
import { useRestoreArchivedGoal } from "@src/hooks/api/Goals/mutations/useRestoreArchivedGoal";
import { createArchivedGoalActions } from "@src/factories/goalActionsFactory";

import GoalActionsModal from "./GoalActionsModal";

interface ArchivedGoalActionsProps {
  goal: GoalItem;
}

const ArchivedGoalActions: React.FC<ArchivedGoalActionsProps> = ({ goal }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { deleteGoalMutation } = useDeleteGoal();
  const { mutate: restoreArchivedGoal } = useRestoreArchivedGoal();

  const handleRestoreClick = async () => {
    const goalTitleElement = document.querySelector(`#goal-${goal.id} .goal-title`) as HTMLElement;
    if (goalTitleElement) {
      goalTitleElement.style.textDecoration = "none";
    }
    await restoreArchivedGoal({ goal });
    window.history.back();
  };

  const actions = createArchivedGoalActions({
    goal,
    handlers: {
      onRestore: handleRestoreClick,
      onDelete: () => deleteGoalMutation(goal),
    },
    context: {
      darkMode,
    },
  });

  return <GoalActionsModal goal={goal} actions={actions} onCancel={() => window.history.back()} />;
};

export default ArchivedGoalActions;
