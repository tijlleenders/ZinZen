import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import GlobalAddIcon from "@assets/images/globalAdd.svg";
import correct from "@assets/images/correct.svg";

import { themeSelectionMode } from "@src/store/ThemeState";

import useGoalStore from "@src/hooks/useGoalStore";
import useFeelingStore from "@src/hooks/useFeelingStore";
import Backdrop from "@src/common/Backdrop";

import "./index.scss";

const AddGoalOptions = () => {
  const { handleAddGoal } = useGoalStore();

  return (
    <>
      <button
        type="button"
        className="add-goal-pill-btn"
        style={{ right: 34, bottom: 144 }}
        onClick={(e) => {
          e.stopPropagation();
          handleAddGoal("Budget");
        }}
      >
        <span style={{ paddingLeft: 5 }}>Budget</span>
        <span className="goal-btn-circle">
          <img className="global-addBtn-img" src={GlobalAddIcon} alt="add goal" />
        </span>
      </button>

      <button
        type="button"
        className="add-goal-pill-btn"
        style={{ right: 34, bottom: 74 }}
        onClick={(e) => {
          e.stopPropagation();
          handleAddGoal("Goal");
        }}
      >
        <span style={{ paddingLeft: 5 }}>Goal</span>
        <span className="goal-btn-circle">
          <img className="global-addBtn-img" src={GlobalAddIcon} alt="add goal" />
        </span>
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
      className="global-addBtn"
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
