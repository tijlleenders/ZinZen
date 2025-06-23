import useGoalSummaryStore from "@components/GoalItemSummary/useGoalSummaryStore";
import { GoalItem } from "@src/models/GoalItem";
import React from "react";

const GoalSummary = ({ goal }: { goal: GoalItem }) => {
  const { sublistSummary, durationSummary, dueDateSummary } = useGoalSummaryStore(goal);

  const summaryParts = [sublistSummary, durationSummary, dueDateSummary].filter(Boolean);

  return <span>{summaryParts.join(", ")}</span>;
};

export default GoalSummary;
