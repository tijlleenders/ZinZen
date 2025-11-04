import React, { ReactNode, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams, useSearch } from "@tanstack/react-router";

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
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { suggestChanges } from "@src/controllers/PartnerController";
import { useGoalMoveMutation } from "../hooks/api/Goals/mutations/useGoalMoveMutation";

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
  const { type, addOptions } = useSearch({ strict: false }) as { type?: TGoalCategory; addOptions?: boolean };
  const { parentId = "root", partnerId } = useParams({ strict: false }) as { parentId: string; partnerId: string };
  const { state }: { state: ILocationState } = useLocation();
  const { handleAddFeeling } = useFeelingStore();
  const isPartnerModeActive = !!partnerId;

  const subGoalsHistory = state?.goalsHistory || [];

  const navigate = useNavigate();
  const themeSelection = useRecoilValue(themeSelectionMode);
  const isAddingBudgetGoalAllowed = useRecoilValue(allowAddingBudgetGoal);
  const [goalToMove, setGoalToMove] = useRecoilState(moveGoalState);

  const enterPressed = useKeyPress("Enter");
  const plusPressed = useKeyPress("+");

  const handleAddGoal = async (goalType: TGoalCategory, replaceCurrentRoute = true) => {
    if (add === "myTime") {
      navigate({ to: "/", search: { type: goalType, mode: "add" }, replace: replaceCurrentRoute });
      return;
    }
    const prefix = `${isPartnerModeActive ? `/partners/${partnerId}/` : "/"}goals`;
    navigate({
      to: `${prefix}/${parentId || "root"}`,
      search: { type: goalType, mode: "add" },
      replace: replaceCurrentRoute,
    });
  };

  const handleGlobalAddClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (goalToMove) {
      if (add === "myGoals" || isPartnerModeActive) {
        navigate({
          to: isPartnerModeActive
            ? `/partners/${partnerId}/goals/${parentId}?addOptions=true`
            : `/goals/${parentId}?addOptions=true`,
          state,
        });
      }
      return;
    }

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
      navigate({ to: `/goals/${parentId}`, search: { addOptions: true }, state });
    } else if (add === "myTime") {
      navigate({ to: "/", search: { addOptions: true }, state });
    }
  };
  const { handlers } = useLongPress({
    onLongPress: handleLongPress,
    onClick: handleGlobalAddClick,
    longPressTime: 200,
  });

  const { onClick, onMouseDown, onMouseUp, onTouchStart, onTouchEnd } = handlers;

  const { moveGoalMutation } = useGoalMoveMutation();

  const handleMoveGoalHere = async () => {
    if (!goalToMove) return;
    // TODO: try to simplify this logic later
    if (isPartnerModeActive) {
      let rootGoal = goalToMove;
      if (state?.goalsHistory && state?.goalsHistory?.length > 0) {
        // TODO: understand this later
        const rootGoalId = state.goalsHistory[0].goalID;
        rootGoal = (await getSharedWMGoalById(rootGoalId)) || goalToMove;
      }
      suggestChanges(
        rootGoal,
        { ...goalToMove, parentGoalId: parentId || goalToMove.parentGoalId },
        subGoalsHistory.length,
      );
    } else {
      moveGoalMutation({ goalId: goalToMove.id, newParentGoalId: parentId });
    }
  };

  useEffect(() => {
    if ((plusPressed || enterPressed) && !type) {
      // @ts-ignore
      handleGlobalAddClick(new MouseEvent("click"));
    }
  }, [plusPressed, enterPressed]);

  const shouldRenderMoveButton = goalToMove && goalToMove.id !== parentId && goalToMove.parentGoalId !== parentId;

  if (addOptions) {
    return (
      <>
        <Backdrop
          opacity={0.5}
          onClick={(e) => {
            e.stopPropagation();
            window.history.back();
          }}
        />
        {goalToMove ? (
          <>
            <AddGoalOption handleClick={handleMoveGoalHere} bottom={144} disabled={!shouldRenderMoveButton}>
              {t("Move here")}
            </AddGoalOption>
            <AddGoalOption
              handleClick={() => {
                setGoalToMove(null);
                window.history.back();
              }}
              bottom={74}
            >
              {t("Cancel")}
            </AddGoalOption>
          </>
        ) : (
          <>
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
        )}
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
