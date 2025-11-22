import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import { moveGoalState } from "@src/store/moveGoalState";
import { useGoalMoveMutation } from "@src/hooks/api/Goals/mutations/useGoalMoveMutation";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";
import FabButton from "./FabButton";
import FabOptionsMenu, { FabOption } from "./FabOptionsMenu";

const GoalMoveFab: React.FC = () => {
  const { t } = useTranslation();
  const { addOptions } = useSearch({ strict: false }) as {
    type?: TGoalCategory;
    mode?: TGoalConfigMode;
    addOptions?: boolean;
  };

  const { parentId = "root" } = useParams({ strict: false }) as {
    parentId: string;
  };

  const navigate = useNavigate();
  const goalToMove = useRecoilValue(moveGoalState);
  const setGoalToMove = useSetRecoilState(moveGoalState);
  const { moveGoalMutation } = useGoalMoveMutation();

  const handleClick = () => {
    navigate({
      to: `/goals/${parentId}?addOptions=true`,
      state: (state) => ({ ...state }),
    });
  };

  const handleMoveGoalHere = useCallback(() => {
    if (!goalToMove) return;

    moveGoalMutation({
      goalId: goalToMove.id,
      newParentGoalId: parentId,
    });
  }, [goalToMove, moveGoalMutation, parentId]);

  const shouldRenderMoveButton = Boolean(
    goalToMove && goalToMove.id !== parentId && goalToMove.parentGoalId !== parentId,
  );

  const handleCancel = useCallback(() => {
    setGoalToMove(null);
    window.history.back();
  }, [setGoalToMove]);

  const handleCloseMenu = () => {
    window.history.back();
  };

  if (addOptions) {
    const options: FabOption[] = [
      {
        label: t("Move here"),
        onClick: handleMoveGoalHere,
        disabled: !shouldRenderMoveButton,
      },
      {
        label: t("Cancel"),
        onClick: handleCancel,
      },
    ];

    return <FabOptionsMenu options={options} onClose={handleCloseMenu} />;
  }

  return <FabButton icon={<img src={GlobalAddIcon} alt="move goal" />} onClick={handleClick} />;
};

export default GoalMoveFab;
