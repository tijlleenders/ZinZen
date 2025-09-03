import React from "react";
import { Breadcrumb } from "antd";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { darkModeState } from "@src/store";
import goalsIcon from "@assets/images/goalsIcon.svg";

import { ISubGoalHistory } from "@src/store/GoalsState";

import "./GoalHistory.scss";
import BreadcrumbItem from "./BreadcrumbItem";

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

const GoalHistory = ({
  goalsHistory,
  showConfig,
  setShowConfig,
}: {
  goalsHistory: ISubGoalHistory[];
  showConfig?: boolean;
  setShowConfig?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <button
      type="button"
      className="goal-history"
      aria-label="Goals history"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest(".ant-breadcrumb-link")) {
          return;
        }
        setShowConfig?.(!showConfig);
      }}
    >
      <Breadcrumb
        className="breadcrumb-container"
        separator={<span className={`separator ${darkModeStatus ? "dark-mode" : ""}`}>/</span>}
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
              window.history.go(-goalsHistory.length);
            },
          },
          ...(goalsHistory.length <= 3
            ? goalsHistory.map((goal: ISubGoalHistory, index: number) => ({
                title: <BreadcrumbItem color={goal.goalColor} title={t(goal.goalTitle)} />,
                onClick: () => {
                  if (index === goalsHistory.length - 1) {
                    setShowConfig?.(!showConfig);
                    return;
                  }
                  window.history.go(index + 1 - goalsHistory.length);
                },
              }))
            : [
                ...goalsHistory.slice(0, 2).map((goal: ISubGoalHistory, index: number) => ({
                  title: <BreadcrumbItem color={goal.goalColor} title={t(goal.goalTitle)} />,
                  key: goal.goalID,
                  onClick: () => {
                    window.history.go(index + 1 - goalsHistory.length);
                  },
                })),
                {
                  title: (
                    <span style={{ ...breadcrumbStyle, border: "1px solid #d9d9d9", background: "#d9d9d933" }}>
                      ...
                    </span>
                  ),
                  onClick: () => {
                    window.history.back();
                  },
                },
                ...goalsHistory.slice(goalsHistory.length - 1).map((goal: ISubGoalHistory, index: number) => ({
                  title: <BreadcrumbItem color={goal.goalColor} title={t(goal.goalTitle)} />,
                  onClick: () => {
                    const count = index + 1 - goalsHistory.length;
                    if (-count === goalsHistory.length - 1) {
                      setShowConfig?.(!showConfig);
                      return;
                    }
                    window.history.go(count);
                  },
                })),
              ]),
        ]}
      />
    </button>
  );
};

export default GoalHistory;
