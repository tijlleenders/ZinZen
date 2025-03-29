import React from "react";
import { useTranslation } from "react-i18next";
import { ISubGoalHistory } from "@src/store/GoalsState";

interface BreadcrumbItemProps {
  goal: ISubGoalHistory;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ goal }) => {
  const { t } = useTranslation();

  return (
    <span
      className="breadcrumb-item fw-500"
      style={{
        border: `1px solid ${goal.goalColor}`,
        background: `${goal.goalColor}33`,
      }}
    >
      {t(goal.goalTitle)}
    </span>
  );
};
