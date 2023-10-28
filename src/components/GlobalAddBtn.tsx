import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import GlobalAddIcon from "@assets/images/globalAdd.svg";
import correct from "@assets/images/correct.svg";

import { themeSelectionMode } from "@src/store/ThemeState";

import useGoalStore from "@src/hooks/useGoalStore";
import useFeelingStore from "@src/hooks/useFeelingStore";
import Backdrop from "@src/common/Backdrop";

const style: React.CSSProperties = {
  position: "fixed",
  borderRadius: "50%",
  border: "none",
  background: "var(--selection-color)",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
  width: 56,
  height: 56,
  right: 34,
  bottom: 74,
  color: "white",
  fontWeight: 600,
};

const AddGoalOptions = () => {
  const { handleAddGoal } = useGoalStore();

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleAddGoal("Budget");
        }}
        style={{ ...style, bottom: 144, fontSize: "0.875em" }}
      >
        Budget
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleAddGoal("Goal");
        }}
        style={{ ...style, fontSize: "0.875em" }}
      >
        Goal
      </button>
    </>
  );
};

const GlobalAddBtn = ({ add }: { add: string }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { handleAddFeeling } = useFeelingStore();

  const themeSelection = useRecoilValue(themeSelectionMode);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (themeSelection) {
      window.history.back();
    } else if (add === "myGoals" || state.displayPartnerMode) {
      navigate("/MyGoals", { state: { ...state, displayAddGoalOptions: true } });
    } else if (add === "myJournal") {
      handleAddFeeling();
    }
  };
  if (state.displayAddGoalOptions) {
    return (
      <>
        <Backdrop
          opacity={0.5}
          onClick={() => {
            window.history.back();
          }}
        />
        <AddGoalOptions />
      </>
    );
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        handleClick(e);
      }}
      style={style}
    >
      <img
        className="global-addBtn-img"
        src={themeSelection ? correct : GlobalAddIcon}
        alt="add goal | add feeling | add group"
      />
    </button>
  );
};

export default GlobalAddBtn;
