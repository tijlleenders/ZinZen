import React from "react";

import GlobalAddIcon from "@assets/images/globalAdd.svg";
import correct from "@assets/images/correct.svg";

import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";
import { themeSelectionMode } from "@src/store/ThemeState";
import useGoalStore from "@src/hooks/useGoalStore";
import useFeelingStore from "@src/hooks/useFeelingStore";

const GlobalAddBtn = ({ add }: { add: string }) => {
  const { handleAddGoal } = useGoalStore();
  const { handleAddFeeling } = useFeelingStore();
  const darkModeStatus = useRecoilValue(darkModeState);

  const themeSelection = useRecoilValue(themeSelectionMode);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (themeSelection) {
      window.history.back();
    } else if (add === "mygoals") {
      await handleAddGoal();
    } else if (add === "My Journal") {
      handleAddFeeling();
    }
  };

  return (
    <button
      type="button"
      id="global-addBtn"
      onClick={(e) => { handleClick(e); }}
      style={{
        position: "fixed",
        borderRadius: "50%",
        border: "none",
        background: "var(--primary-background)",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        width: 56,
        height: 56,
        right: 34,
        bottom: 74
      }}
    > <img className={`global-addBtn-img ${themeSelection && !darkModeStatus ? "theme-selector-option" : ""}`} src={themeSelection ? correct : GlobalAddIcon} alt="add goal | add feeling | add group" />
    </button>
  );
};

export default GlobalAddBtn;
