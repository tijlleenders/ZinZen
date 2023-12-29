import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import { useTranslation } from "react-i18next";

const GoalHabitSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();

  if (!goal.habit) {
    return null;
  }

  return <div>{goal.habit === "weekly" && <span>{t("everyWeek")}</span>}</div>;
};

export default GoalHabitSummary;
