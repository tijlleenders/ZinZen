import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import useGoalStore from "@src/hooks/useGoalStore";
import { createGoalActions } from "@src/factories/goalActionsFactory";

import GoalActionsModal from "./GoalActionsModal";

interface PartnerGoalActionsProps {
  goal: GoalItem;
}

const PartnerGoalActions: React.FC<PartnerGoalActionsProps> = ({ goal }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { openEditMode } = useGoalStore();

  const actions = createGoalActions({
    goal,
    entityType: "partner-active",
    handlers: {
      onEdit: () => openEditMode(goal),
    },
    context: {
      darkMode,
    },
  });

  return <GoalActionsModal goal={goal} actions={actions} showSummary onHeaderClick={() => openEditMode(goal)} />;
};

export default PartnerGoalActions;
