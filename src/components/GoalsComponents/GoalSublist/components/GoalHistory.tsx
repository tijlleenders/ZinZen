import React from "react";
import { Breadcrumb } from "antd";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import goalsIcon from "@assets/images/goalsIcon.svg";
import { ISubGoalHistory } from "@src/store/GoalsState";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ILocationState } from "@src/Interfaces";
import "./GoalHistory.scss";
import { BreadcrumbItem } from "./BreadcrumbItem";

interface BreadcrumbItem {
  title: React.ReactNode;
  onClick: () => void;
}

const GoalHistory: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { partnerId } = useParams();
  const { t } = useTranslation();

  const locationState: ILocationState = location.state;
  const goalsHistory = locationState.goalsHistory ?? [];
  const darkModeStatus = useRecoilValue(darkModeState);
  const isPartnerGoalActive = Boolean(partnerId);

  const handleBreadcrumbClick = (goalId: string, index: number) => {
    const newGoalsHistory = goalsHistory.slice(0, index + 1);
    const path = isPartnerGoalActive ? `/partners/${partnerId}/goals/${goalId}` : `/goals/${goalId}`;

    navigate(path, {
      state: {
        ...locationState,
        goalsHistory: newGoalsHistory,
      },
    });
  };

  const handleHomeClick = () => {
    const path = isPartnerGoalActive ? `/partners/${partnerId}/goals` : "/goals";

    navigate(path, {
      state: { ...location.state, goalsHistory: [] },
    });
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      title: (
        <img
          src={goalsIcon}
          className={`goals-icon ${darkModeStatus ? "goals-icon-history" : ""}`}
          alt={t("my goals")}
        />
      ),
      onClick: handleHomeClick,
    },
    ...goalsHistory.map((goal: ISubGoalHistory, index: number) => ({
      title: <BreadcrumbItem goal={goal} />,
      onClick: () => handleBreadcrumbClick(goal.goalID, index),
    })),
  ];

  return (
    <div className="goal-history">
      <Breadcrumb
        className="breadcrumb-container"
        separator={<span className={`separator ${darkModeStatus ? "dark-mode" : ""}`}>/</span>}
        items={breadcrumbItems}
      />
    </div>
  );
};

export default GoalHistory;
