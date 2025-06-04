import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import BudgetSummary from "./BudgetSummary";
import GoalSummary from "./GoalSummary";
import "./GoalItemSummary.scss";

const GoalItemSummary = ({
  goal,
  showAddGoal,
  setShowAddGoal,
}: {
  goal: GoalItem;
  showAddGoal?: boolean;
  setShowAddGoal?: (show: boolean) => void;
}) => {
  const isBudget = goal.timeBudget !== undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddGoal?.(!showAddGoal);
  };

  return (
    <button type="button" className="goal-item-summary-wrapper" onClickCapture={handleClick}>
      {isBudget ? <BudgetSummary goal={goal} /> : <GoalSummary goal={goal} />}
    </button>
  );
};

export default GoalItemSummary;
