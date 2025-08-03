import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import { getVariantClassName } from "@src/utils";
import BudgetSummary from "./BudgetSummary";
import GoalSummary from "./GoalSummary";
import "./GoalItemSummary.scss";

type GoalItemSummaryVariant = "default" | "modal";

export interface GoalItemSummaryProps {
  goal: GoalItem;
  variant?: GoalItemSummaryVariant;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const GoalItemSummary = ({ goal, variant = "default", className = "", onClick }: GoalItemSummaryProps) => {
  const isBudget = goal.timeBudget !== undefined;

  return (
    <button
      className={getVariantClassName("goal-item-summary-wrapper", variant, className)}
      onClick={onClick}
      type="button"
    >
      {isBudget ? <BudgetSummary goal={goal} /> : <GoalSummary goal={goal} />}
    </button>
  );
};

export default GoalItemSummary;
