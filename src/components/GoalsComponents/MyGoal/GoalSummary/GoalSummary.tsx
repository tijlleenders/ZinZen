import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import GoalSublistSummary from "./GoalSublistSummary";
import GoalDurationSummary from "./GoalDurationSummary";
import BudgetTimeSummary from "./BudgetTimeSummary";
import GoalDueDateSummary from "./GoalDueDateSummary";
import BudgetStartSummary from "./BudgetStartSummary";
import GoalHabitSummary from "./GoalHabitSummary";

const GoalSummary = ({ goal }: { goal: GoalItem }) => {
  const isBudget = goal.timeBudget.perDay !== null;
  const hasSubGoalItems = goal.sublist.length > 0;
  if (isBudget) {
    return (
      <>
        <BudgetTimeSummary goal={goal} />
        <BudgetStartSummary goal={goal} />
      </>
    );
  }
  return (
    <>
      {hasSubGoalItems ? <GoalSublistSummary goal={goal} /> : <GoalDurationSummary goal={goal} />}
      <GoalDueDateSummary goal={goal} />
      <GoalHabitSummary goal={goal} />
    </>
  );
};

export default GoalSummary;
