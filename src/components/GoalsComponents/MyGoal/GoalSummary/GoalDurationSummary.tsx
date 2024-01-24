import { useTranslation } from "react-i18next";
import React from "react";
import { GoalItem } from "@src/models/GoalItem";

const GoalDurationSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const count = Number(goal.duration);
  const localizedHourText = t("hourWithCount", { count });

  if (goal.duration) {
    return <span>{`${localizedHourText}`}</span>;
  }

  return null;
};

export default GoalDurationSummary;
