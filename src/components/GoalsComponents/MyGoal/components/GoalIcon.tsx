import React, { ReactNode } from "react";

interface GoalIconProps {
  color: string;
  showDottedBorder: boolean;
  children: ReactNode;
}

export const GoalIcon: React.FC<GoalIconProps> = ({ color, showDottedBorder, children }) => {
  const outerBackground = `radial-gradient(50% 50% at 50% 50%, ${color}33 89.585%, ${
    showDottedBorder ? "transparent" : color
  } 100%)`;

  const outerBorderStyle = showDottedBorder ? `2px dashed ${color}` : `1px solid ${color}`;

  return (
    <div className="d-flex f-col gap-4">
      <div
        className="goal-dropdown goal-dd-outer"
        style={{
          background: outerBackground,
          border: outerBorderStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};
