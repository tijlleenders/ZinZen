import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import BudgetSummary from "./BudgetSummary";
import GoalSummary from "./GoalSummary";

const GoalItemSummary = ({ goal }: { goal: GoalItem }) => {
  const isBudget = goal.timeBudget !== undefined;

  return (
    <span className="goal-item-summary-wrapper">
      {isBudget ? <BudgetSummary goal={goal} /> : <GoalSummary goal={goal} />}
    </span>
  );
};

export default GoalItemSummary;
