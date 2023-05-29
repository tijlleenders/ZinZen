import React from "react";

import GlobalAddIcon from "@assets/images/globalAdd.svg";
import correct from "@assets/images/correct.svg";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState } from "@src/store";
import { displayAddPublicGroup } from "@src/store/GroupsState";
import { displayAddFeeling } from "@src/store/FeelingsState";
import { themeSelectionMode } from "@src/store/ThemeState";
import useGoalStore from "@src/hooks/useGoalStore";

const GlobalAddBtn = ({ add }: { add: string }) => {
  const { handleAddGoal } = useGoalStore();

  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowAddFeelingsModal = useSetRecoilState(displayAddFeeling);

  const [themeSelection, setThemeSelection] = useRecoilState(themeSelectionMode);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (themeSelection) { setThemeSelection(false); return; }
    if (add === "My Goals") {
      await handleAddGoal();
    } else if (add === "My Journal") {
      setShowAddFeelingsModal(true);
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
