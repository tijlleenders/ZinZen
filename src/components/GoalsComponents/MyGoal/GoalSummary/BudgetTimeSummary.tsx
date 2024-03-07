import { GoalItem } from "@src/models/GoalItem";
import { formatBudgetHrsToText } from "@src/utils";
import React from "react";
import { useTranslation } from "react-i18next";

import { useRecoilValue } from "recoil";
import { is24HourFormat } from "@src/store/HourFormatState";

const BudgetTimeSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();

  const is24Hour = useRecoilValue(is24HourFormat);

  const formatTime = (time: string, is24Hour: boolean) => {
    if (is24Hour) {
      return time;
    }
    const hour = parseInt(time, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const convertedHour = hour % 12 || 12;
    return `${convertedHour} ${ampm}`;
  };

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

  const formattedAfterTime = goal.afterTime ? formatTime(goal.afterTime, is24Hour) : "";
  const formattedBeforeTime = goal.beforeTime ? formatTime(goal.beforeTime, is24Hour) : "";

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
        {formattedAfterTime && formattedBeforeTime
          ? `${t("between")} ${formattedAfterTime}-${formattedBeforeTime}`
          : formattedBeforeTime
          ? `${t("before")} ${formattedBeforeTime}`
          : formattedAfterTime
          ? `${t("after")} ${formattedAfterTime}`
          : ""}
      </div>

      <div>
        {formatBudgetHrsToText(perWeek)} {t("perWeek")}
      </div>
    </div>
  );
};

export default BudgetTimeSummary;
