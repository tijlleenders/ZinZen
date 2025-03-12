import React, { ReactNode } from "react";
import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";

import "./ZItemContainer.scss";

export const ZItemContainer: React.FC<{
  id: string;
  expandGoalId?: string;
  isAnimating?: boolean;
  isGoalToBeMoved?: boolean;
  children: ReactNode;
  extraContent?: ReactNode;
}> = ({ id, expandGoalId = "root", isAnimating = false, isGoalToBeMoved = false, children, extraContent }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <div
      key={id}
      id={id}
      className={`user-goal${darkModeStatus ? "-dark" : ""} ${expandGoalId === id && isAnimating ? "goal-glow" : ""} ${isGoalToBeMoved ? "goal-to-move-selected" : ""}`}
    >
      <div className="user-goal-main">{children}</div>
      {extraContent}
    </div>
  );
};
