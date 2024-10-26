import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import "./ShowChanges.scss";
import { InfoCircleOutlined } from "@ant-design/icons";

export const getMovedSubgoalsList = (
  goalUnderReview: GoalItem | undefined,
  oldParentTitle: string,
  newParentTitle: string,
) => {
  if (!goalUnderReview) return null;

  return (
    <div className="move-info-container">
      <div className="move-info-item">
        <span className="move-info-label">Goal Being Moved</span>
        <div className="move-info-value highlight-box">{goalUnderReview.title}</div>
      </div>

      <div className="move-direction-container">
        <div className="move-info-item">
          <span className="move-info-label">From</span>
          <div className="move-info-value">{oldParentTitle}</div>
        </div>

        <div className="arrow">→</div>

        <div className="move-info-item">
          <span className="move-info-label">To</span>
          <div className="move-info-value">{newParentTitle}</div>
        </div>
      </div>

      {newParentTitle === "Non-shared goal" && (
        <div className="warning-message">
          <InfoCircleOutlined />
          <span>The new parent goal is not shared. The goal will be deleted for you.</span>
        </div>
      )}
    </div>
  );
};
