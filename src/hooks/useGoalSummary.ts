import { GoalItem } from "@src/models/GoalItem";
import { formatSingularPlural, calculateDaysLeft } from "@src/utils";
import { useTranslation } from "react-i18next";
import { useSublistSummary } from "./useSublistSummary";

const useGoalSummaryStore = (goal: GoalItem) => {
  const { t } = useTranslation();
  const { subGoalsCount, subBudgetsCount } = useSublistSummary({ goal });

  const getSublistSummaryText = () => {
    if (goal.due) {
      return "";
    }
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

  const getDurationSummaryText = () => {
    if (goal.duration) {
      return t("hourWithCount", { count: Number(goal.duration) });
    }
    return "";
  };

  const getDueDateSummaryText = () => {
    if (goal.due) {
      return calculateDaysLeft(goal.due);
    }
    return "";
  };

  const getHabitSummaryText = () => {
    if (goal.habit === "weekly") {
      return t("everyWeek");
    }
    return "";
  };

  return {
    sublistSummary: getSublistSummaryText(),
    durationSummary: getDurationSummaryText(),
    dueDateSummary: getDueDateSummaryText(),
    habitSummary: getHabitSummaryText(),
  };
};

export default useGoalSummaryStore;
