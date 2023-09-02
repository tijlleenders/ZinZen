import React from "react";
import { Breadcrumb } from "antd";
import { useRecoilValue } from "recoil";

import { darkModeState } from "@src/store";
import { homeIcon } from "@src/assets";

import { ISubGoalHistory, goalsHistory } from "@src/store/GoalsState";

const breadcrumbStyle: React.CSSProperties = {
  fontWeight: 500,
  borderRadius: 5,
  padding: 6,
  display: "block",
  width: 100,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  textAlign: "center",
};
const GoalHistory = () => {
  const subGoalHistory = useRecoilValue(goalsHistory);
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div style={{ padding: "0 12px" }}>
      <Breadcrumb
        style={{ margin: "24px 0px" }}
        separator={<span style={{ color: darkModeStatus ? "rgba(255, 255, 255, 0.45)" : "inherit" }}>/</span>}
        items={[
          {
            title: <img src={homeIcon} className={`${darkModeStatus ? "dark-svg" : ""}`} alt="my goals" />,
            onClick: () => {
              window.history.go(-subGoalHistory.length);
            },
          },
          ...(subGoalHistory.length <= 3
            ? subGoalHistory.map((goal: ISubGoalHistory, index) => ({
                title: <span style={{ ...breadcrumbStyle, background: goal.goalColor }}>{goal.goalTitle}</span>,
                onClick: () => {
                  window.history.go(index + 1 - subGoalHistory.length);
                },
              }))
            : [
                ...subGoalHistory.slice(0, 2).map((goal: ISubGoalHistory, index) => ({
                  title: <span style={{ ...breadcrumbStyle, background: goal.goalColor }}>{goal.goalTitle}</span>,
                  onClick: () => {
                    window.history.go(index + 1 - subGoalHistory.length);
                  },
                })),
                {
                  title: <span style={{ ...breadcrumbStyle, background: "#d9d9d9" }}>...</span>,
                  onClick: () => {
                    window.history.back();
                  },
                },
                ...subGoalHistory.slice(subGoalHistory.length - 1).map((goal: ISubGoalHistory, index) => ({
                  title: <span style={{ ...breadcrumbStyle, background: goal.goalColor }}>{goal.goalTitle}</span>,
                  onClick: () => {
                    window.history.go(index + 1 - subGoalHistory.length);
                  },
                })),
              ]),
        ]}
      />
    </div>
  );
};

export default GoalHistory;
