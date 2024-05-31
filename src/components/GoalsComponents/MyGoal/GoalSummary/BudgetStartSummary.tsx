import { GoalItem } from "@src/models/GoalItem";
import React from "react";
import { useTranslation } from "react-i18next";

const BudgetStartSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const hasStarted = goal.start && new Date(goal.start).getTime() < new Date().getTime();
  const showStart = goal.due || !hasStarted;

  if (!showStart || !goal.start) {
    return null;
  }

  return (
    <span>
      {hasStarted ? t("started") : t("starts")} {new Date(goal.start).toDateString().slice(4)}
    </span>
  );
};

export default BudgetStartSummary;
