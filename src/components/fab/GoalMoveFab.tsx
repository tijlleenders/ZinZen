import React, { useCallback, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "@tanstack/react-router";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import { moveGoalState } from "@src/store/moveGoalState";
import { useGoalMoveMutation } from "@src/hooks/api/Goals/mutations/useGoalMoveMutation";
import GlobalFab from "./GlobalFab";
import { FabMenuOption } from "./FabOptionsMenu/FabOptionsMenu.types";
import { useFabMenu } from "./FabOptionsMenu/useFabMenu";

const GoalMoveFab: React.FC = () => {
  const goalToMove = useRecoilValue(moveGoalState);
  const setGoalToMove = useSetRecoilState(moveGoalState);
  const { moveGoalMutation } = useGoalMoveMutation();

  const { parentId = "root" } = useParams({ strict: false }) as {
    parentId: string;
  };
  const { openMenu, open } = useFabMenu();

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

  const options: FabMenuOption[] = useMemo(() => {
    return [
      {
        label: "Move here",
        onClick: handleMoveGoalHere,
        disabled: !shouldRenderMoveButton,
      },
      {
        label: "Cancel",
        onClick: handleCancel,
      },
    ];
  }, [handleMoveGoalHere, handleCancel, shouldRenderMoveButton]);

  return (
    <GlobalFab
      icon={<img src={GlobalAddIcon} alt="move goal" />}
      onClick={handleMoveGoalHere}
      menu={{
        show: open,
        onLongPress: openMenu,
        options,
      }}
    />
  );
};

export default GoalMoveFab;
