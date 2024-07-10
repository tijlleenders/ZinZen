import React, { ReactNode } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import GlobalAddIcon from "@assets/images/globalAdd.svg";
import correct from "@assets/images/correct.svg";
import { themeSelectionMode } from "@src/store/ThemeState";

import useGoalStore from "@src/hooks/useGoalStore";
import useFeelingStore from "@src/hooks/useFeelingStore";
import Backdrop from "@src/common/Backdrop";

import "./index.scss";
import { useTranslation } from "react-i18next";
import { ILocationState } from "@src/Interfaces";

interface AddGoalOptionProps {
  children: ReactNode;
  bottom: number;
  disabled?: boolean;
  handleClick: () => void;
}

const AddGoalOption: React.FC<AddGoalOptionProps> = ({ children, bottom, disabled, handleClick }) => {
  return (
    <button
      type="button"
      className="add-goal-pill-btn"
      style={{ right: 35, bottom, ...(disabled ? { opacity: 0.25, pointerEvents: "none" } : {}) }}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
    >
      <span style={{ paddingLeft: 5 }}>{children}</span>
      <span className="goal-btn-circle">
        <img
          style={{ padding: "2px 0 0 0 !important", filter: "brightness(0) invert(1)" }}
          src={GlobalAddIcon}
          alt="add goal"
        />
      </span>
    </button>
  );
};

const GlobalAddBtn = ({ add }: { add: string }) => {
  const { t } = useTranslation();
  const { handleAddFeeling } = useFeelingStore();
  const { handleAddGoal } = useGoalStore();

  const { state }: { state: ILocationState } = useLocation();

  const { parentId = "root" } = useParams();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const themeSelection = useRecoilValue(themeSelectionMode);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (themeSelection) {
      window.history.back();
    } else if (add === "myGoals" || state.displayPartnerMode) {
      navigate(`/MyGoals/${parentId}?addOptions=true`, { state: { ...state, displayAddGoalOptions: true } });
    } else if (add === "myJournal") {
      handleAddFeeling();
    }
  };
  if (searchParams?.get("addOptions")) {
    return (
      <>
        <Backdrop
          opacity={0.5}
          onClick={(e) => {
            e.stopPropagation();
            window.history.back();
          }}
        />
        <AddGoalOption
          handleClick={() => {
            handleAddGoal("Budget");
          }}
          disabled={state.allowAddingBudgetGoal === false}
          bottom={144}
        >
          {t("addBtnBudget")}
        </AddGoalOption>
        <AddGoalOption
          handleClick={() => {
            handleAddGoal("Standard");
          }}
          bottom={74}
        >
          {t("addBtnGoal")}
        </AddGoalOption>
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
        style={{ padding: "2px 0 0 0 !important", filter: "brightness(0) invert(1)" }}
        src={themeSelection ? correct : GlobalAddIcon}
        alt="add goal | add feeling | add group"
      />
    </button>
  );
};

export default GlobalAddBtn;
