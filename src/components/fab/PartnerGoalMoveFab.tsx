import React, { useCallback, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useParams, useRouterState } from "@tanstack/react-router";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import { moveGoalState } from "@src/store/moveGoalState";
import { getSharedWMGoalById, calculateSharedGoalDepth } from "@src/api/SharedWMAPI";
import { suggestChanges } from "@src/controllers/PartnerController";
import { GoalItem } from "@src/models/GoalItem";
import GlobalFab from "./GlobalFab";
import { FabMenuOption } from "./FabOptionsMenu/FabOptionsMenu.types";
import { useFabMenu } from "./FabOptionsMenu/useFabMenu";

const PartnerGoalMoveFab: React.FC = () => {
  const { parentId = "root" } = useParams({ strict: false }) as {
    parentId: string;
    partnerId: string;
  };

  const { openMenu, open } = useFabMenu();
  const goalToMove = useRecoilValue(moveGoalState);
  const setGoalToMove = useSetRecoilState(moveGoalState);

  const rootGoalId = useRouterState({
    select: (s) => s.location.state?.rootGoalId,
  });

  const moveHerePartner = useCallback(
    async (goal: GoalItem) => {
      let rootGoal = goal;
      if (rootGoalId) {
        rootGoal = (await getSharedWMGoalById(rootGoalId)) || goal;
      }

      const depth = await calculateSharedGoalDepth(parentId);
      suggestChanges(rootGoal, { ...goal, parentGoalId: parentId }, depth);
    },
    [rootGoalId, parentId],
  );

  const handleMoveGoalHere = useCallback(async () => {
    if (!goalToMove) return;

    await moveHerePartner(goalToMove);
    setGoalToMove(null);
    window.history.back();
  }, [goalToMove, moveHerePartner, setGoalToMove]);

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

export default PartnerGoalMoveFab;
