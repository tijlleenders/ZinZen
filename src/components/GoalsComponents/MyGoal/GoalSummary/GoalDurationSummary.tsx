import React from "react";
import { formatSingularPlural } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";

const GoalDurationSummary = ({ goal }: { goal: GoalItem }) => {
  if (goal.duration) {
    return <span>{formatSingularPlural(Number(goal.duration), "hour")}</span>;
  }
  return null;
};

export default GoalDurationSummary;
