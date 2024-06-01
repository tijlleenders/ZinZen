import useBudgetSummaryStore from "@src/hooks/useBudgetSummaryStore";
import { GoalItem } from "@src/models/GoalItem";
import React from "react";

const BudgetSummary = ({ goal }: { goal: GoalItem }) => {
  const { perDaySummary, onDaysSummary, timeConstraintsSummary, perWeekSummary } = useBudgetSummaryStore(goal);

  const summaryParts = [perDaySummary, onDaysSummary, timeConstraintsSummary, perWeekSummary].filter(Boolean);

  return <span>{summaryParts.join(", ")}</span>;
};

export default BudgetSummary;
