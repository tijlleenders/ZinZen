import React from "react";
import NotificationSymbol from "@src/common/NotificationSymbol";
import { GoalItem } from "@src/models/GoalItem";

interface GoalDropdownProps {
  goal: GoalItem;
  isActionVisible: boolean;
}

const GoalDropdown: React.FC<GoalDropdownProps> = ({ goal, isActionVisible }) => {
  const { sublist, goalColor, timeBudget, newUpdates } = goal;
  const hasSubGoals = sublist.length > 0;
  const outerBackground = `radial-gradient(50% 50% at 50% 50%, ${goalColor}33 89.585%, ${
    timeBudget?.perDay != null ? "transparent" : goalColor
  } 100%)`;
  const outerBorderStyle = timeBudget?.perDay == null ? `1px solid ${goalColor}` : `2px dashed ${goalColor}`;

  const innerBorderColor = hasSubGoals ? goalColor : "transparent";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        paddingTop: isActionVisible ? "11px" : "",
      }}
    >
      <div
        className="goal-dropdown goal-dd-outer"
        style={{
          background: outerBackground,
          border: outerBorderStyle,
        }}
      >
        <div className="goal-dd-inner" style={{ borderColor: innerBorderColor }}>
          {newUpdates && <NotificationSymbol color={goalColor} />}
        </div>
      </div>
      {isActionVisible && (
        <div className="goal-menu-dots">
          <span style={{ backgroundColor: goalColor }} />
          <span style={{ backgroundColor: goalColor }} />
          <span style={{ backgroundColor: goalColor }} />
        </div>
      )}
    </div>
  );
};

export default GoalDropdown;
