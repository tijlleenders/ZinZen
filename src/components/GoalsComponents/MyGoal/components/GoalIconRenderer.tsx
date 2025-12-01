/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactNode } from "react";
import { ImpossibleGoal } from "@src/Interfaces";
import { isGoalCode } from "@src/utils/patterns";
import NotificationSymbol from "@src/common/NotificationSymbol";
import TriangleIcon from "@src/assets/TriangleIcon";
import { CopyIcon } from "@src/assets/CopyIcon";
import { GoalIcon } from "./GoalIcon";
import { ActionModal } from "../types";
import { useActionModal } from "../hooks/useActionModal";

interface InnerCircleProps {
  color: string;
  children: ReactNode;
}

const InnerCircle: React.FC<InnerCircleProps> = ({ color, children }) => {
  return (
    <div className="goal-dd-inner" style={{ borderColor: color }}>
      {children}
    </div>
  );
};

interface GoalIconRendererProps {
  goal: ImpossibleGoal;
  innerBorderColor: string;
  dragAttributes?: any;
  dragListeners?: any;
  actionModal?: ActionModal;
}

export const GoalIconRenderer: React.FC<GoalIconRendererProps> = ({
  goal,
  innerBorderColor,
  dragAttributes,
  dragListeners,
  actionModal = ActionModal.ACTIVE,
}) => {
  const { handleIconClick } = useActionModal(goal, actionModal);
  const titleContainsVideoLink =
    goal.title.includes("youtube") || goal.title.includes("peertube") || goal.title.includes("youtu");
  const titleIsCode = isGoalCode(goal.title);

  const iconContent = titleIsCode ? (
    <CopyIcon color={goal.goalColor} size={37} borderWidth={4} borderColor={innerBorderColor} />
  ) : titleContainsVideoLink ? (
    <TriangleIcon color={goal.goalColor} size={37} borderWidth={4} borderColor={goal.goalColor} />
  ) : (
    <GoalIcon color={goal.goalColor} showDottedBorder={!(goal.timeBudget?.perDay == null)}>
      <InnerCircle color={innerBorderColor}>
        {goal.newUpdates && <NotificationSymbol color={goal.goalColor} dataTestId={`notification-dot-${goal.title}`} />}
      </InnerCircle>
    </GoalIcon>
  );

  return (
    <div style={{ touchAction: "none" }} onClickCapture={handleIconClick} {...dragAttributes} {...dragListeners}>
      {iconContent}
    </div>
  );
};
