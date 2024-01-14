import { GoalItem } from "@src/models/GoalItem";
import { formatBudgetHrsToText } from "@src/utils";
import React from "react";
import { useTranslation } from "react-i18next";

const BudgetTimeSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();

  if (!goal.timeBudget) {
    return null;
  }
  const { perDay, perWeek } = goal.timeBudget;

  if (!perDay && !perWeek) {
    return null;
  }

  const onLength = goal.on?.length || 0;
  const onWeekdays = onLength === 5 && goal.on?.includes("Sat") && goal.on?.includes("Sun");
  const onWeekends = onLength === 2 && goal.on?.includes("Sat") && goal.on?.includes("Sun");

  return (
    <div>
      <span>{formatBudgetHrsToText(perDay)}</span>
      <span>
        {goal.on && goal.on.length > 0 && (
          <>
            {onLength > 0 &&
              !onWeekdays &&
              !onWeekends &&
              (onLength === 7 ? ` ${t("daily")}` : ` ${t("on")} ${goal.on.map((ele) => t(ele)).join(" ")}`)}
            {onWeekdays && ` ${t("onWeekdays")}`}
            {onWeekends && ` ${t("onWeekends")}`}
          </>
        )}
      </span>
      <div>
        {goal.beforeTime && goal.afterTime
          ? `${t("between")} ${goal.afterTime}-${goal.beforeTime}`
          : goal.beforeTime
          ? `${t("before")} ${goal.beforeTime}`
          : goal.afterTime
          ? `${t("after")} ${goal.afterTime}`
          : ""}
      </div>

      <div>
        {formatBudgetHrsToText(perWeek)} {t("perWeek")}
      </div>
    </div>
  );
};

export default BudgetTimeSummary;
