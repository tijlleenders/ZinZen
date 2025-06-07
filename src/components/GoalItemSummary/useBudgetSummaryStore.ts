import { GoalItem } from "@src/models/GoalItem";
import { useTranslation } from "react-i18next";
import { formatBudgetHrsToText } from "./GoalSummary.helpers";

const useBudgetSummaryStore = (goal: GoalItem) => {
  const { t } = useTranslation();

  const { perDay = { min: 0, max: 0 }, perWeek = { min: 0, max: 0 } } = goal.timeBudget || {};

  const getPerDaySummary = () => formatBudgetHrsToText(perDay?.min, perDay?.max);

  const getPerWeekSummary = () => `${formatBudgetHrsToText(perWeek?.min ?? 0, perWeek?.max ?? 0)} ${t("perWeek")}`;

  const getOnDaysSummary = () => {
    const onLength = goal.on?.length ?? 0;
    const onWeekdays = onLength === 5 && goal.on?.includes("Sat") && goal.on?.includes("Sun");
    const onWeekends = onLength === 2 && goal.on?.includes("Sat") && goal.on?.includes("Sun");

    if (onWeekdays) return t("onWeekdays");
    if (onWeekends) return t("onWeekends");
    if (onLength > 0 && onLength < 7) {
      return `${t("on")} ${goal.on?.map((day) => t(day)).join(" ")}`;
    }
    if (onLength === 7) return t("daily");
    return "";
  };

  const getTimeConstraintsSummary = () => {
    if (goal.beforeTime && goal.afterTime) {
      return `${t("between")} ${goal.afterTime}-${goal.beforeTime}`;
    }
    if (goal.beforeTime) return `${t("before")} ${goal.beforeTime}`;
    if (goal.afterTime) return `${t("after")} ${goal.afterTime}`;
    return "";
  };

  return {
    perDaySummary: getPerDaySummary(),
    onDaysSummary: goal.on?.length ? getOnDaysSummary() : "",
    timeConstraintsSummary: getTimeConstraintsSummary(),
    perWeekSummary: getPerWeekSummary(),
  };
};

export default useBudgetSummaryStore;
