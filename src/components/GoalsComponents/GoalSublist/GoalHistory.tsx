import React from "react";
import { Breadcrumb } from "antd";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

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
  textAlign: "center"
};
const GoalHistory = () => {
  const subGoalHistory = useRecoilValue(goalsHistory);
  const navigate = useNavigate();

  return (
    <div>
      <Breadcrumb
        style={{ margin: "24px 0px" }}
        items={[
          {
            title: <img src={homeIcon} alt="my goals" />,
            onClick: () => { navigate("/MyGoals"); }
          },
          ...(subGoalHistory.length <= 3 ?
            subGoalHistory.map((goal: ISubGoalHistory, index) => ({
              title: <span style={{ ...breadcrumbStyle, background: goal.goalColor }}>{goal.goalTitle}</span>,
              onClick: () => { window.history.go((index + 1) - subGoalHistory.length); }
            })) :
            [
              ...subGoalHistory.slice(0, 2).map((goal: ISubGoalHistory, index) => ({
                title: <span style={{ ...breadcrumbStyle, background: goal.goalColor }}>{goal.goalTitle}</span>,
                onClick: () => { window.history.go((index + 1) - subGoalHistory.length); }
              })),
              {
                title: <span style={{ ...breadcrumbStyle, background: "#d9d9d9" }}>...</span>,
                onClick: () => { window.history.back(); }
              },
              ...subGoalHistory.slice(subGoalHistory.length - 1).map((goal: ISubGoalHistory, index) => ({
                title: <span style={{ ...breadcrumbStyle, background: goal.goalColor }}>{goal.goalTitle}</span>,
                onClick: () => { window.history.go((index + 1) - subGoalHistory.length); }
              })),
            ]
          )
        ]}
      />
    </div>
  );
};

export default GoalHistory;
