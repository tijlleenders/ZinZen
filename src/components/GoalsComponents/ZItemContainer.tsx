import React, { ReactNode } from "react";
import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";

export const ZItemContainer: React.FC<{
  id: string;
  expandGoalId?: string;
  isAnimating?: boolean;
  children: ReactNode;
  extraContent?: ReactNode;
}> = ({ id, expandGoalId = "root", isAnimating = false, children, extraContent }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <div
      key={id}
      id={id}
      className={`user-goal${darkModeStatus ? "-dark" : ""} ${expandGoalId === id && isAnimating ? "goal-glow" : ""}`}
    >
      <div className="user-goal-main">{children}</div>
      {extraContent}
    </div>
  );
};
