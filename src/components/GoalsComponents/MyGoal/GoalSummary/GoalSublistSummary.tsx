import { GoalItem } from "@src/models/GoalItem";
import React from "react";
import { formatSingularPlural } from "@src/utils";
import { useSublistSummary } from "./useSublistSummary";

const GoalSublistSummary = ({ goal }: { goal: GoalItem }) => {
  const { subGoalsCount, subBudgetsCount } = useSublistSummary({ goal });

  let summary = "";
  if (subGoalsCount > 0 && subBudgetsCount === 0) {
    summary = formatSingularPlural(subGoalsCount, "goal");
  } else if (subBudgetsCount > 0 && subGoalsCount === 0) {
    summary = formatSingularPlural(subBudgetsCount, "budget");
  } else if (subGoalsCount > 0 && subBudgetsCount > 0) {
    summary = `${formatSingularPlural(subGoalsCount, "goal")}, ${formatSingularPlural(subBudgetsCount, "budget")}`;
  }

  return summary ? <div>{summary}</div> : null;
};

export default GoalSublistSummary;
