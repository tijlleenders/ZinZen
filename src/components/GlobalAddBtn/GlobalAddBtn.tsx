import React, { ReactNode, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useRouterState, useSearch } from "@tanstack/react-router";

import GlobalAddIcon from "@assets/images/globalAdd.svg";
import correct from "@assets/images/correct.svg";

import Backdrop from "@src/common/Backdrop";

import { themeSelectionMode } from "@src/store/ThemeState";

import "../index.scss";
import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import { allowAddingBudgetGoal } from "@src/store/GoalsState";
import useLongPress from "@src/hooks/useLongPress";
import { useKeyPress } from "@src/hooks/useKeyPress";
import { moveGoalState } from "@src/store/moveGoalState";
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { suggestChanges } from "@src/controllers/PartnerController";
import { TGoalConfigMode, TJournalConfigMode } from "@src/types";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { FloatButton } from "antd";
import "./GlobalAddBtn.scss";
import { useGoalMoveMutation } from "@src/hooks/api/Goals/mutations/useGoalMoveMutation";
import { PageTitle } from "@src/constants/pageTitle";

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

const usePartnerModeLogic = (partnerId: string | undefined, parentId: string) => {
  if (!partnerId) {
    return {
      isPartnerMode: false,
      parentGoal: undefined,
      rootGoalId: undefined,
      moveHerePartner: undefined,
    };
  }

  // Partner mode:
  const { data: parentGoal } = useGetGoalById(parentId, false);

  const rootGoalId = useRouterState({
    select: (s) => s.location.state.rootGoalId,
  });

  const moveHerePartner = async (goalToMove: GoalItem) => {
    let rootGoal = goalToMove;
    if (rootGoalId) {
      rootGoal = (await getSharedWMGoalById(rootGoalId)) || goalToMove;
    }

    suggestChanges(rootGoal, { ...goalToMove, parentGoalId: parentId }, parentGoal?.depth || 0);
  };

  return {
    isPartnerMode: true,
    parentGoal,
    rootGoalId,
    moveHerePartner,
  };
};

const GlobalAddBtn = ({ add }: { add: string }) => {
  const { t } = useTranslation();
  const { type, addOptions } = useSearch({ strict: false }) as {
    type?: TGoalCategory;
    mode?: TJournalConfigMode | TGoalConfigMode;
    addOptions?: boolean;
  };

  const { parentId = "root", partnerId } = useParams({ strict: false }) as {
    parentId: string;
    partnerId?: string;
  };

  const navigate = useNavigate();

  const themeSelection = useRecoilValue(themeSelectionMode);
  const isAddingBudgetGoalAllowed = useRecoilValue(allowAddingBudgetGoal);

  const [goalToMove, setGoalToMove] = useRecoilState(moveGoalState);
  const { moveGoalMutation } = useGoalMoveMutation();

  const { isPartnerMode, moveHerePartner } = usePartnerModeLogic(partnerId, parentId);

  const handleMoveGoalHere = async () => {
    if (!goalToMove) return;

    if (isPartnerMode && moveHerePartner) {
      await moveHerePartner(goalToMove);
    } else {
      moveGoalMutation({
        goalId: goalToMove.id,
        newParentGoalId: parentId,
      });
    }
  };

  const shouldRenderMoveButton = goalToMove && goalToMove.id !== parentId && goalToMove.parentGoalId !== parentId;

  const handleAddGoal = (goalType: TGoalCategory, replaceCurrentRoute = true) => {
    if (add === PageTitle.MyTime) {
      navigate({
        to: "/",
        search: { type: goalType, mode: "add" },
        state: (state) => ({ ...state }),
        replace: replaceCurrentRoute,
      });
      return;
    }

    const prefix = `${isPartnerMode ? `/partners/${partnerId}/` : "/"}goals`;

    navigate({
      to: `${prefix}/${parentId || "root"}`,
      search: { type: goalType, mode: "add" },
      state: (state) => ({ ...state }),
      replace: replaceCurrentRoute,
    });
  };

  const handleGlobalAddClick = () => {
    if (goalToMove) {
      navigate({
        to: isPartnerMode
          ? `/partners/${partnerId}/goals/${parentId}?addOptions=true`
          : `/goals/${parentId}?addOptions=true`,
        state: (state) => ({ ...state }),
      });
      return;
    }

    if (themeSelection) {
      window.history.back();
      return;
    }

    if (add === PageTitle.MyJournal) {
      navigate({
        to: "/MyJournal",
        search: { mode: "addJournal" },
        state: (state) => ({ ...state }),
      });
      return;
    }

    if (add === PageTitle.MyTime || add === PageTitle.MyGoals || isPartnerMode) {
      handleAddGoal("Standard", false);
    }
  };

  const handleLongPress = () => {
    if (add === PageTitle.MyGoals) {
      navigate({ to: `/goals/${parentId}`, search: { addOptions: true }, state: (state) => ({ ...state }) });
    } else if (add === PageTitle.MyTime) {
      navigate({ to: "/", search: { addOptions: true }, state: (state) => ({ ...state }) });
    }
  };

  const { handlers } = useLongPress({
    onLongPress: handleLongPress,
    onClick: handleGlobalAddClick,
    longPressTime: 200,
  });

  const { onClick, onMouseDown, onMouseUp, onTouchStart, onTouchEnd } = handlers;

  const enterPressed = useKeyPress("Enter");
  const plusPressed = useKeyPress("+");

  useEffect(() => {
    if ((plusPressed || enterPressed) && !type) {
      handleGlobalAddClick();
    }
  }, [plusPressed, enterPressed]);

  if (addOptions) {
    return (
      <>
        <Backdrop opacity={0.5} onClick={() => window.history.back()} />

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
              handleClick={() => handleAddGoal("Budget")}
              disabled={!isAddingBudgetGoalAllowed}
              bottom={144}
            >
              {t("addBtnBudget")}
            </AddGoalOption>

            <AddGoalOption handleClick={() => handleAddGoal("Standard")} bottom={74}>
              {t("addBtnGoal")}
            </AddGoalOption>
          </>
        )}
      </>
    );
  }

  return (
    <FloatButton
      className="global-addBtn"
      icon={
        <img
          style={{ padding: "2px 0 0 0 !important", filter: "brightness(0) invert(1)" }}
          src={themeSelection ? correct : GlobalAddIcon}
          alt="add goal | add feeling | add group"
        />
      }
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
      style={{ background: "var(--selectionColor)" }}
    />
  );
};

export default GlobalAddBtn;
