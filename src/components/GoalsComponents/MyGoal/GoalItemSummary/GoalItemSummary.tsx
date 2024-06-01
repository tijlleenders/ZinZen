import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import BudgetSummary from "./BudgetSummary";
import GoalSummary from "./GoalSummary";

const GoalItemSummary = ({ goal }: { goal: GoalItem }) => {
  const isBudget = goal.timeBudget !== undefined;

  return (
    <>
      {isBudget && <BudgetSummary goal={goal} />}
      <GoalSummary goal={goal} />
    </>
  );
};

export default GoalItemSummary;
