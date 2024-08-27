import React from "react";
import NotificationSymbol from "@src/common/NotificationSymbol";
import { GoalItem } from "@src/models/GoalItem";
import TriangleIcon from "../../../../assets/TriangleIcon";

interface GoalDropdownProps {
  goal: GoalItem;
}

const GoalDropdown: React.FC<GoalDropdownProps> = ({ goal, onClick, dragAttributes, dragListeners }) => {
  const { sublist, goalColor, timeBudget, newUpdates, title } = goal;
  const hasSubGoals = sublist.length > 0;
  const titleContainsVideoLink = title.includes("youtube") || title.includes("peertube") || title.includes("youtu");

  const outerBackground = `radial-gradient(50% 50% at 50% 50%, ${goalColor}33 89.585%, ${
    timeBudget?.perDay != null ? "transparent" : goalColor
  } 100%)`;

  const innerBorderColor = hasSubGoals ? goalColor : "transparent";
  const outerBorderStyle = timeBudget?.perDay == null ? `1px solid ${goalColor}` : `2px dashed ${goalColor}`;

  return (
    <div className="d-flex f-col gap-4">
      {titleContainsVideoLink ? (
        <TriangleIcon color={goalColor} size={37} borderWidth={4} borderColor={goalColor} />
      ) : (
        <button
          className="goal-dropdown goal-dd-outer simple"
          style={{
            background: outerBackground,
            border: outerBorderStyle,
          }}
          type="button"
          onClick={onClick}
          {...dragAttributes}
          {...dragListeners}
        >
          <div className="goal-dd-inner" style={{ borderColor: innerBorderColor }}>
            {newUpdates && <NotificationSymbol color={goalColor} />}
          </div>
        </button>
      )}
    </div>
  );
};

export default GoalDropdown;
