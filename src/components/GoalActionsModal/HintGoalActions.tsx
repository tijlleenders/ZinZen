import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { useDeleteGoalHint } from "@src/hooks/api/Hints/mutations/useDeleteGoalHint";
import { useReportGoalHints } from "@src/hooks/api/Hints/mutations/useReportGoalHints";
import { useAddGoalHintsToMyGoal } from "@src/hooks/api/Hints/mutations/useAddGoalHintsToMyGoal";
import { createHintGoalActions } from "@src/factories/goalActionsFactory";

import GoalActionsModal from "./GoalActionsModal";

interface HintGoalActionsProps {
  goal: GoalItem;
}

const HintGoalActions: React.FC<HintGoalActionsProps> = ({ goal }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { deleteGoalHint } = useDeleteGoalHint();
  const { reportGoalHint, isReportingGoalHint } = useReportGoalHints();
  const { addGoalHintToMyGoal } = useAddGoalHintsToMyGoal();

  const actions = createHintGoalActions({
    goal,
    handlers: {
      onDeleteHint: deleteGoalHint,
      onAdd: () => addGoalHintToMyGoal(goal),
      onReport: () => reportGoalHint(goal),
    },
    context: {
      darkMode,
      isLoadingReport: isReportingGoalHint,
    },
  });

  return <GoalActionsModal goal={goal} actions={actions} onCancel={() => window.history.back()} />;
};

export default HintGoalActions;
