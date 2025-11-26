import React from "react";
import "./HeaderBtn.scss";

interface HeaderBtnProps {
  path: string;
  alt: string;
  onClick?: () => void;
}

const HeaderBtn = ({ path, alt, onClick }: HeaderBtnProps) => {
  return (
    <div className="header-btn-wrapper">
      <img onClickCapture={onClick} className="theme-icon header-icon" src={path} alt={alt} />
    </div>
  );
};

export default HeaderBtn;
