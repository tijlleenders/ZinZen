import React from "react";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import "../FabOptionsMenu/FabOptionsMenu.scss";
import { useTranslation } from "react-i18next";

interface FabOptionProps {
  text: string;
  bottom: number;
  disabled?: boolean;
  handleClick: () => void;
}

const FabOption: React.FC<FabOptionProps> = ({ text, bottom, disabled, handleClick }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={`fab-option-btn ${disabled ? "disabled" : ""}`}
      style={{ bottom }}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
    >
      <span className="button-text">{t(text)}</span>
      <span className="goal-btn-circle place-middle fw-600">
        <img className="add-icon" src={GlobalAddIcon} alt="add goal" />
      </span>
    </button>
  );
};

export default FabOption;
