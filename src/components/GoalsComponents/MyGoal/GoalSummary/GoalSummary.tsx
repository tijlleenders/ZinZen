import React from "react";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import GoalSublistSummary from "./GoalSublistSummary";
import GoalDurationSummary from "./GoalDurationSummary";
import BudgetTimeSummary from "./BudgetTimeSummary";
import GoalDueDateSummary from "./GoalDueDateSummary";
import BudgetStartSummary from "./BudgetStartSummary";
import GoalHabitSummary from "./GoalHabitSummary";

const GoalSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const isBudget = goal.timeBudget.perDay !== null;
  const hasSubGoalItems = goal.sublist.length > 0;
  const shouldRenderGoalSummary = hasSubGoalItems || goal.due || goal.habit || goal.duration;

  if (isBudget) {
    return (
      <>
        <BudgetTimeSummary goal={goal} />
        <BudgetStartSummary goal={goal} />
      </>
    );
  }
  return shouldRenderGoalSummary ? (
    <>
      {hasSubGoalItems && !goal.duration ? <GoalSublistSummary goal={goal} /> : <GoalDurationSummary goal={goal} />}
      <GoalDueDateSummary goal={goal} />
      <GoalHabitSummary goal={goal} />
    </>
  ) : (
    <span>{t("noDurationText")}</span>
  );
};

export default GoalSummary;
