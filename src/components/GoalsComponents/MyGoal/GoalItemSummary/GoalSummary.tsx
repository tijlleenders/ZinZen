import useGoalSummaryStore from "@src/hooks/useGoalSummary";
import { GoalItem } from "@src/models/GoalItem";
import React from "react";

const GoalSummary = ({ goal }: { goal: GoalItem }) => {
  const { sublistSummary, durationSummary, dueDateSummary, habitSummary } = useGoalSummaryStore(goal);

  const summaryParts = [sublistSummary, durationSummary, dueDateSummary, habitSummary].filter(Boolean);

  return <span>{summaryParts.join(", ")}</span>;
};

export default GoalSummary;
