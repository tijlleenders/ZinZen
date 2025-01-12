import React from "react";
import { Breadcrumb } from "antd";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import goalsIcon from "@assets/images/goalsIcon.svg";
import { ISubGoalHistory } from "@src/store/GoalsState";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ILocationState } from "@src/Interfaces";
import "./GoalHistory.scss";

const BreadcrumbItem = ({ goal }: { goal: ISubGoalHistory }) => {
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

const GoalHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState: ILocationState = location.state;
  const goalsHistory = locationState.goalsHistory ?? [];
  const darkModeStatus = useRecoilValue(darkModeState);

  const handleBreadcrumbClick = (goalId: string, index: number) => {
    const newGoalsHistory = goalsHistory.slice(0, index + 1);
    navigate(`/goals/${goalId}`, {
      state: {
        ...locationState,
        goalsHistory: newGoalsHistory,
      },
    });
  };

  return (
    <div className="goal-history">
      <Breadcrumb
        className="breadcrumb-container"
        separator={<span className={`separator ${darkModeStatus ? "dark-mode" : ""}`}>/</span>}
        items={[
          {
            title: (
              <img
                src={goalsIcon}
                className={`goals-icon ${darkModeStatus ? "goals-icon-history" : ""}`}
                alt="my goals"
              />
            ),
            onClick: () => {
              navigate("/goals", {
                state: { ...location.state, goalsHistory: [] },
              });
            },
          },
          ...goalsHistory.map((goal: ISubGoalHistory, index: number) => ({
            title: <BreadcrumbItem goal={goal} />,
            onClick: () => handleBreadcrumbClick(goal.goalID, index),
          })),
        ]}
      />
    </div>
  );
};

export default GoalHistory;
