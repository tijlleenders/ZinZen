import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

interface DefaultButtonProps {
  customStyle?: React.CSSProperties;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.SyntheticEvent) => void | Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
}

const DefaultButton: React.FC<DefaultButtonProps> = ({ children, customStyle, id, onClick, disabled = false }) => {
  const isDarkMode = useRecoilValue(darkModeState);

  return (
    <button
      type="button"
      id={id}
      className={`default-btn${isDarkMode ? "-dark" : ""} ${disabled ? "" : "pointer"}`}
      style={customStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default DefaultButton;
