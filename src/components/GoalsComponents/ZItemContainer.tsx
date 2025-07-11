import React, { ReactNode } from "react";
import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";

import "./ZItemContainer.scss";

export const ZItemContainer: React.FC<{
  id: string;
  shouldAnimate?: boolean;
  isGoalToBeMoved?: boolean;
  children: ReactNode;
  extraContent?: ReactNode;
  dataTestId?: string;
}> = ({ id, shouldAnimate = false, isGoalToBeMoved = false, children, extraContent, dataTestId }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <div
      key={id}
      id={id}
      data-testid={dataTestId}
      className={`user-goal${darkModeStatus ? "-dark" : ""} ${shouldAnimate ? "goal-glow" : ""} ${isGoalToBeMoved ? "goal-to-move-selected" : ""}`}
    >
      <div className="user-goal-main">{children}</div>
      {extraContent}
    </div>
  );
};
