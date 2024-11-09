import React, { ReactNode, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
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
import { useKeyPress } from "@src/hooks/useKeyPress";
import { moveGoalState } from "@src/store/moveGoalState";
import { moveGoalHierarchy } from "@src/helpers/GoalController";
import { displayToast, lastAction } from "@src/store";
import { useParentGoalContext } from "@src/contexts/parentGoal-context";

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
      <span className="goal-btn-circle place-middle fw-600">
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

  const setToastMessage = useSetRecoilState(displayToast);

  const setLastAction = useSetRecoilState(lastAction);

  const {
    parentData: { parentGoal = { id: "root" } },
  } = useParentGoalContext();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const themeSelection = useRecoilValue(themeSelectionMode);
  const isAddingBudgetGoalAllowed = useRecoilValue(allowAddingBudgetGoal);
  const goalToMove = useRecoilValue(moveGoalState);
  const setGoalToMove = useSetRecoilState(moveGoalState);

  const enterPressed = useKeyPress("Enter");
  const plusPressed = useKeyPress("+");

  const handleAddGoal = async (type: TGoalCategory, replaceCurrentRoute = true) => {
    const navigateOptions = {
      state: {
        ...state,
        goalType: type,
      },
      replace: replaceCurrentRoute,
    };
    if (add === "myTime") {
      navigate(`?type=${type}&mode=add`, navigateOptions);
      return;
    }
    const prefix = `${isPartnerModeActive ? `/partners/${partnerId}/` : "/"}goals`;
    navigate(`${prefix}/${parentId || "root"}?type=${type}&mode=add`, navigateOptions);
  };
  const handleGlobalAddClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (themeSelection) {
      window.history.back();
    } else if (add === "myTime" || add === "myGoals" || isPartnerModeActive) {
      handleAddGoal("Standard", false);
    } else if (add === "myJournal") {
      handleAddFeeling();
    }
  };

  const handleLongPress = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (add === "myGoals" || isPartnerModeActive) {
      navigate(`/goals/${parentId}?addOptions=true`, { state });
    } else if (add === "myTime") {
      navigate("?addOptions=true", { state });
    }
  };
  const { handlers } = useLongPress({
    onLongPress: handleLongPress,
    onClick: handleGlobalAddClick,
    longPressTime: 200,
  });

  const { onClick, onMouseDown, onMouseUp, onTouchStart, onTouchEnd } = handlers;

  const handleMoveGoalHere = async () => {
    if (!goalToMove) return;
    await moveGoalHierarchy(goalToMove.id, parentId).then(() => {
      setToastMessage({ open: true, message: "Goal moved successfully", extra: "" });
    });
    setLastAction("goalMoved");
    setGoalToMove(null);
    window.history.back();
  };

  useEffect(() => {
    if ((plusPressed || enterPressed) && !state.goalType) {
      // @ts-ignore
      handleGlobalAddClick(new MouseEvent("click"));
    }
  }, [plusPressed, enterPressed]);

  const shouldRenderMoveButton =
    goalToMove && goalToMove.id !== parentGoal?.id && goalToMove.parentGoalId !== parentGoal?.id;

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
        {shouldRenderMoveButton && (
          <AddGoalOption handleClick={handleMoveGoalHere} bottom={214}>
            {t("Move Here")}
          </AddGoalOption>
        )}
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
