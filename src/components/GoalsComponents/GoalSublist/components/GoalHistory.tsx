import React from "react";
import { Breadcrumb } from "antd";
import { useRecoilValue } from "recoil";

import { darkModeState } from "@src/store";
import goalsIcon from "@assets/images/goalsIcon.svg";

import { ISubGoalHistory } from "@src/store/GoalsState";
import { useTranslation } from "react-i18next";

import "./GoalHistory.scss";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";

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

const BreadcrumbItem = ({ goal, isLast }: { goal: ISubGoalHistory; isLast: boolean }) => {
  const { t } = useTranslation();
  const { data: fetchedGoal } = useGetGoalById(goal.goalID);
  return (
    <span
      style={{
        ...breadcrumbStyle,
        border: `1px solid ${isLast ? fetchedGoal?.goalColor || "" : goal.goalColor}`,
        background: `${isLast ? fetchedGoal?.goalColor || "" : goal.goalColor}33`,
      }}
    >
      {t(isLast ? fetchedGoal?.title || "" : goal.goalTitle)}
    </span>
  );
};

const GoalHistory = ({
  goalsHistory,
  showConfig,
  setShowConfig,
}: {
  goalsHistory: ISubGoalHistory[];
  showConfig: boolean;
  setShowConfig: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <button
      type="button"
      className="goal-history"
      aria-label="Goals history"
      onClick={() => {
        setShowConfig(!showConfig);
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
                title: <BreadcrumbItem goal={goal} isLast={index === goalsHistory.length - 1} />,
                onClick: () => {
                  if (index === goalsHistory.length - 1) {
                    setShowConfig(!showConfig);
                    return;
                  }
                  window.history.go(index + 1 - goalsHistory.length);
                },
              }))
            : [
                ...goalsHistory.slice(0, 2).map((goal: ISubGoalHistory, index: number) => ({
                  title: <BreadcrumbItem goal={goal} isLast={false} />,
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
                  title: <BreadcrumbItem goal={goal} isLast />,
                  onClick: () => {
                    const count = index + 1 - goalsHistory.length;
                    if (-count === goalsHistory.length - 1) {
                      setShowConfig(!showConfig);
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
