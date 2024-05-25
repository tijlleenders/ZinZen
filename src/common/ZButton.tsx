import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";

interface ZButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ZButton: React.FC<ZButtonProps> = ({ children, onClick, className }) => {
  const darkModeStatus = useRecoilValue(darkModeState);

  const combinedClassName = `${className} default-btn${darkModeStatus ? "-dark" : ""}`;

  return (
    <button type="button" className={combinedClassName} onClick={onClick}>
      {children}
    </button>
  );
};

export default ZButton;
