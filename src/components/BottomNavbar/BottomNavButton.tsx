import React from "react";

type BottomNavButtonProps = {
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  testId?: string;
};

export const BottomNavButton = ({ active, onClick, children, style, testId }: BottomNavButtonProps) => (
  <button
    type="button"
    data-testid={testId}
    onClick={onClick}
    className={`bottom-nav-item ${active ? "active" : ""}`}
    style={style}
  >
    {children}
  </button>
);
