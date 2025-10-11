import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { useRestoreArchivedGoal } from "@src/hooks/api/Goals/mutations/useRestoreArchivedGoal";
import { createGoalActions } from "@src/factories/goalActionsFactory";

import GoalActionsModal from "./GoalActionsModal";

interface PartnerArchivedGoalActionsProps {
  goal: GoalItem;
}

const PartnerArchivedGoalActions: React.FC<PartnerArchivedGoalActionsProps> = ({ goal }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { mutate: restoreArchivedGoal } = useRestoreArchivedGoal();

  const handleRestoreClick = async () => {
    const goalTitleElement = document.querySelector(`#goal-${goal.id} .goal-title`) as HTMLElement;
    if (goalTitleElement) {
      goalTitleElement.style.textDecoration = "none";
    }
    await restoreArchivedGoal({ goal });
    window.history.back();
  };

  const actions = createGoalActions({
    goal,
    entityType: "partner-archived",
    handlers: {
      onRestore: handleRestoreClick,
    },
    context: {
      darkMode,
    },
  });

  return <GoalActionsModal goal={goal} actions={actions} onCancel={() => window.history.back()} />;
};

export default PartnerArchivedGoalActions;
