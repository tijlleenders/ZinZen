import React from "react";
import { Breadcrumb } from "antd";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import goalsIcon from "@assets/images/goalsIcon.svg";
import { ISubGoalHistory } from "@src/store/GoalsState";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ILocationState } from "@src/Interfaces";

const breadcrumbStyle: React.CSSProperties = {
  fontWeight: 500,
  borderRadius: 30,
  padding: "0 3px 3px 3px",
  display: "block",
  width: 100,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  textAlign: "center",
  cursor: "pointer",
  height: 18,
};

const BreadcrumbItem = ({ goal }: { goal: ISubGoalHistory }) => {
  const { t } = useTranslation();
  return (
    <span
      style={{
        ...breadcrumbStyle,
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
    console.log(goalsHistory);

    const newGoalsHistory = goalsHistory.slice(0, index + 1);
    console.log(newGoalsHistory);

    navigate(`/goals/${goalId}`, {
      state: {
        ...locationState,
        goalsHistory: newGoalsHistory,
      },
    });
  };

  return (
    <div style={{ padding: "0 23px" }}>
      <Breadcrumb
        style={{ margin: "24px 0px" }}
        separator={<span style={{ color: darkModeStatus ? "rgba(255, 255, 255, 0.45)" : "inherit" }}>/</span>}
        items={[
          {
            title: (
              <img
                src={goalsIcon}
                style={{ marginTop: "5px" }}
                className={`${darkModeStatus ? "goals-icon-history" : ""}`}
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
