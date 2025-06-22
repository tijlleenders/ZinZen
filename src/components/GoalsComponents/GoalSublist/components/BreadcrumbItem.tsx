import React from "react";
import { useTranslation } from "react-i18next";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import "./BreadcrumbItem.scss";

interface BreadcrumbItemProps {
  goalId: string;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ goalId }) => {
  const { t } = useTranslation();
  const { data: goal } = useGetGoalById(goalId);

  if (!goal) return null;

  return (
    <span
      className="breadcrumb-item fw-500"
      style={{
        border: `1px solid ${goal.goalColor}`,
        background: `${goal.goalColor}33`,
      }}
    >
      {t(goal.title)}
    </span>
  );
};
