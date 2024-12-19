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
    <div className="move-info-container d-flex f-col gap-20 bordered br-12 bg-sec">
      <div className="move-info-item d-flex f-col gap-8">
        <span className="move-info-label text-sm fw-600">Goal Being Moved</span>
        <div className="move-info-value bg-primary  br-8 bordered">{goalUnderReview.title}</div>
      </div>

      <div className="move-direction-container br-12 gap-8 bordered br-12">
        <div className="move-info-item">
          <span className="move-info-label">From</span>
          <div className="move-info-value  br-8 bordered">{oldParentTitle}</div>
        </div>

        <div className="arrow place-middle text-sm bg-sec">→</div>

        <div className="move-info-item">
          <span className="move-info-label">To</span>
          <div className="move-info-value br-8 bordered">{newParentTitle}</div>
        </div>
      </div>

      {newParentTitle === "Non-shared goal" && (
        <div className="warning-message place-middle gap-8 text-sm br-8">
          <InfoCircleOutlined />
          <span>The new parent goal is not shared. The goal will be moved to the root.</span>
        </div>
      )}
    </div>
  );
};
