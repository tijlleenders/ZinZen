import { GoalItem } from "@src/models/GoalItem";
import { formatSingularPlural } from "@src/utils";
import React from "react";
import { useTranslation } from "react-i18next";

const GoalDurationSummary = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();

  if (goal.duration) {
    return <span>{formatSingularPlural(Number(goal.duration), t("hour"))}</span>;
  }
  return null;
};

export default GoalDurationSummary;
