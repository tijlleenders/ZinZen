import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

interface DefaultButtonProps {
  customStyle?: React.CSSProperties;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.SyntheticEvent) => void | Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
}

const DefaultButton: React.FC<DefaultButtonProps> = ({
  children,
  customStyle,
  id,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
  className,
}) => {
  const isDarkMode = useRecoilValue(darkModeState);

  return (
    <button
      type={type === "submit" ? "submit" : "button"}
      id={id}
      className={`default-btn${isDarkMode ? "-dark" : ""} ${disabled ? "" : "pointer"} ${variant} ${className}`}
      style={{
        ...customStyle,
        background: variant === "secondary" ? "var(--secondary-background)" : "var(--selection-color)",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default DefaultButton;
