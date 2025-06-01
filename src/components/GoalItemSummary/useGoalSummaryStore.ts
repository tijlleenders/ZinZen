import { GoalItem } from "@src/models/GoalItem";
import { useTranslation } from "react-i18next";
import { useSublistSummary } from "./useSublistSummary";
import { calculateDaysLeft, formatSingularPlural } from "./GoalSummary.helpers";

const useGoalSummaryStore = (goal: GoalItem) => {
  const { t } = useTranslation();
  const { subGoalsCount, subBudgetsCount } = useSublistSummary({ goal });

  const getSublistSummaryText = () => {
    if (goal.due) return "";

    if (subGoalsCount > 0 && subBudgetsCount === 0) {
      return formatSingularPlural(subGoalsCount, "goal");
    }

    if (subBudgetsCount > 0 && subGoalsCount === 0) {
      return formatSingularPlural(subBudgetsCount, "budget");
    }

    if (subGoalsCount > 0 && subBudgetsCount > 0) {
      return `${formatSingularPlural(subGoalsCount, "goal")}, ${formatSingularPlural(subBudgetsCount, "budget")}`;
    }

    return "";
  };

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
