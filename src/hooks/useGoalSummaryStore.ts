import { GoalItem } from "@src/models/GoalItem";
import { formatSingularPlural, calculateDaysLeft } from "@src/utils";
import { useTranslation } from "react-i18next";
import { useSublistSummary } from "./useSublistSummary";

const useGoalSummaryStore = (goal: GoalItem) => {
  const { t } = useTranslation();
  const { subGoalsCount, subBudgetsCount } = useSublistSummary({ goal });

  const getSublistSummaryText = () =>
    goal.due
      ? ""
      : subGoalsCount > 0 && subBudgetsCount === 0
      ? formatSingularPlural(subGoalsCount, "goal")
      : subBudgetsCount > 0 && subGoalsCount === 0
      ? formatSingularPlural(subBudgetsCount, "budget")
      : subGoalsCount > 0 && subBudgetsCount > 0
      ? `${formatSingularPlural(subGoalsCount, "goal")}, ${formatSingularPlural(subBudgetsCount, "budget")}`
      : "";

  const getDurationSummaryText = () => (goal.duration ? t("hourWithCount", { count: Number(goal.duration) }) : "");

  const getDueDateSummaryText = () => (goal.due ? calculateDaysLeft(goal.due) : "");

  const getHabitSummaryText = () => (goal.habit === "weekly" ? t("everyWeek") : "");

  return {
    sublistSummary: getSublistSummaryText(),
    durationSummary: getDurationSummaryText(),
    dueDateSummary: getDueDateSummaryText(),
    habitSummary: getHabitSummaryText(),
  };
};

export default useGoalSummaryStore;
