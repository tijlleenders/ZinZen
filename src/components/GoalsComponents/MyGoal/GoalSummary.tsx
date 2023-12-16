import { GoalItem } from "@src/models/GoalItem";
import { calculateDaysLeft, formatBudgetHrsToText } from "@src/utils";
import React from "react";
import { useTranslation } from "react-i18next";

const GoalSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const onLength = goal.on.length;
  const onWeekdays = onLength === 5 && !goal.on.includes("Sat") && !goal.on.includes("Sun");
  const onWeekends = onLength === 2 && goal.on.includes("Sat") && goal.on.includes("Sun");

  const hasStarted = !!goal.start && new Date(goal.start).getTime() < new Date().getTime();
  const showStart = !!goal.due || !hasStarted;

  const hoursPerDayText = formatBudgetHrsToText(goal.timeBudget.perDay);
  const hoursPerWeekText = formatBudgetHrsToText(goal.timeBudget.perWeek);
  const dueDateText = goal.due ? calculateDaysLeft(goal.due) : null;

  return (
    <>
      <div>
        {goal.timeBudget.perDay === null &&
          (goal.duration !== null ? (
            <span>
              {goal.duration} {t(`hour${Number(goal.duration) > 1 ? "s" : ""}`)}
            </span>
          ) : !goal.due ? (
            <span>{t("noDuration")}</span>
          ) : null)}
        {goal.timeBudget.perDay && <span>{hoursPerDayText}</span>}
        {goal.timeBudget.perDay && (
          <span>
            {onLength > 0 &&
              !onWeekdays &&
              !onWeekends &&
              (onLength === 7 ? ` ${t("daily")}` : ` ${t("on")} ${goal.on.map((ele) => t(ele)).join(" ")}`)}
            {onWeekdays && ` ${t("on")} ${t("weekdays")}`}
            {onWeekends && " on weekends"}
          </span>
        )}
      </div>
      <div>
        {goal.beforeTime && goal.afterTime
          ? `${t("between")} ${goal.afterTime}-${goal.beforeTime}`
          : goal.beforeTime
          ? `${t("before")} ${goal.beforeTime}`
          : goal.afterTime
          ? `${t("after")} ${goal.afterTime}`
          : ""}
      </div>
      <div>{goal.timeBudget.perWeek && <span>{`${hoursPerWeekText} per week`}</span>}</div>
      {showStart && !!goal.start && (
        <div>
          {hasStarted ? t("started") : t("starts")} {new Date(goal.start).toDateString().slice(4)}
        </div>
      )}
      <div>{goal.due && <div>{dueDateText}</div>}</div>
      <div>{goal.habit === "weekly" && `${t("every")} week`}</div>
    </>
  );
};

export default GoalSummary;
