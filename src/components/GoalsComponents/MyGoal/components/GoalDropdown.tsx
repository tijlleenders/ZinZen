import React from "react";
import NotificationSymbol from "@src/common/NotificationSymbol";
import { GoalItem } from "@src/models/GoalItem";
import youtubeLogo from "@assets/images/youtube.svg";

interface GoalDropdownProps {
  goal: GoalItem;
}

const GoalDropdown: React.FC<GoalDropdownProps> = ({ goal }) => {
  const { sublist, goalColor, timeBudget, newUpdates } = goal;
  const hasSubGoals = sublist.length > 0;

  const outerBackground = `radial-gradient(50% 50% at 50% 50%, ${goalColor}33 89.585%, ${
    timeBudget?.perDay != null ? "transparent" : goalColor
  } 100%)`;

  const innerBorderColor = hasSubGoals ? goalColor : "transparent";
  const outerBorderStyle = timeBudget?.perDay == null ? `1px solid ${goalColor}` : `2px dashed ${goalColor}`;

  return (
    <div className="d-flex f-col gap-4">
      <div
        className="goal-dropdown goal-dd-outer"
        style={{
          background: outerBackground,
          border: outerBorderStyle,
        }}
      >
        <div className="goal-dd-inner" style={{ borderColor: innerBorderColor }}>
          {newUpdates && <NotificationSymbol color={goalColor} />}
          {goal.title.includes("youtube") && <img src={youtubeLogo} />}
        </div>
      </div>
    </div>
  );
};

export default GoalDropdown;
