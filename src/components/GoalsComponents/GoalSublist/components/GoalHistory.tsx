import React from "react";
import { Breadcrumb } from "antd";
import { useRecoilValue } from "recoil";

import { darkModeState } from "@src/store";
import goalsIcon from "@assets/images/goalsIcon.svg";

import { ISubGoalHistory, goalsHistory } from "@src/store/GoalsState";
import { useTranslation } from "react-i18next";

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
  const subGoalHistory = useRecoilValue(goalsHistory);
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div style={{ padding: "0 23px" }}>
      <Breadcrumb
        style={{
          margin: "24px 0px",
        }}
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
              window.history.go(-subGoalHistory.length);
            },
          },
          ...(subGoalHistory.length <= 3
            ? subGoalHistory.map((goal: ISubGoalHistory, index) => ({
                title: <BreadcrumbItem goal={goal} />,
                onClick: () => {
                  if (index === subGoalHistory.length - 1) {
                    return;
                  }
                  window.history.go(index + 1 - subGoalHistory.length);
                },
              }))
            : [
                ...subGoalHistory.slice(0, 2).map((goal: ISubGoalHistory, index) => ({
                  title: <BreadcrumbItem goal={goal} />,
                  onClick: () => {
                    window.history.go(index + 1 - subGoalHistory.length);
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
                ...subGoalHistory.slice(subGoalHistory.length - 1).map((goal: ISubGoalHistory, index) => ({
                  title: <BreadcrumbItem goal={goal} />,
                  onClick: () => {
                    const count = index + 1 - subGoalHistory.length;
                    if (-count === subGoalHistory.length - 1) {
                      return;
                    }
                    window.history.go(count);
                  },
                })),
              ]),
        ]}
      />
    </div>
  );
};

export default GoalHistory;
