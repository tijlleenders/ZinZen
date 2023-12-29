import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import { calculateDaysLeft } from "@src/utils";

const GoalDueDateSummary = ({ goal }: { goal: GoalItem }) => {
  if (!goal.due) {
    return null;
  }

  const dueDateText = calculateDaysLeft(goal.due);

  return (
    <div>
      <span>{dueDateText}</span>
    </div>
  );
};

export default GoalDueDateSummary;
