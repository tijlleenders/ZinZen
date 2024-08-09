import React, { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import GlobalAddIcon from "@assets/images/globalAdd.svg";
import correct from "@assets/images/correct.svg";

import Backdrop from "@src/common/Backdrop";
import useFeelingStore from "@src/hooks/useFeelingStore";

import { ILocationState } from "@src/Interfaces";
import { themeSelectionMode } from "@src/store/ThemeState";

import "./index.scss";
import { TGoalCategory } from "@src/models/GoalItem";
import { allowAddingBudgetGoal } from "@src/store/GoalsState";
import useLongPress from "@src/hooks/useLongPress";

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
      className={`add-goal-pill-btn ${disabled ? "disabled" : ""}`}
      style={{ bottom }}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
    >
      <span className="button-text">{children}</span>
      <span className="goal-btn-circle">
        <img className="add-icon" src={GlobalAddIcon} alt="add goal" />
      </span>
    </button>
  );
};

const GlobalAddBtn = ({ add }: { add: string }) => {
  const { t } = useTranslation();
  const { parentId = "root", partnerId } = useParams();
  const { state }: { state: ILocationState } = useLocation();
  const { handleAddFeeling } = useFeelingStore();
  const isPartnerModeActive = !!partnerId;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const themeSelection = useRecoilValue(themeSelectionMode);
  const isAddingBudgetGoalAllowed = useRecoilValue(allowAddingBudgetGoal);

  const handleAddGoal = async (type: TGoalCategory, replaceCurrentRoute = true) => {
    const prefix = `${isPartnerModeActive ? `/partners/${partnerId}/` : "/"}goals`;
    navigate(`${prefix}/${parentId || "root"}?type=${type}&mode=add`, {
      state: {
        ...state,
        goalType: type,
      },
      replace: replaceCurrentRoute,
    });
  };
  const handleGlobalAddClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (themeSelection) {
      window.history.back();
    } else if (add === "myGoals" || isPartnerModeActive) {
      handleAddGoal("Standard", false);
    } else if (add === "myJournal") {
      handleAddFeeling();
    }
  };

  const handleLongPress = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (add === "myGoals" || isPartnerModeActive) {
      navigate(`/goals/${parentId}?addOptions=true`, { state });
    }
  };
  const { handlers } = useLongPress({
    onLongPress: handleLongPress,
    onClick: handleGlobalAddClick,
    longPressTime: 200,
  });

  const { onClick, onMouseDown, onMouseUp, onTouchStart, onTouchEnd } = handlers;

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
          disabled={!isAddingBudgetGoalAllowed}
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
      className="global-addBtn"
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
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
