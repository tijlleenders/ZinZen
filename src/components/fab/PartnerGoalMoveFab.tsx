import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useParams, useRouterState } from "@tanstack/react-router";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import { moveGoalState } from "@src/store/moveGoalState";
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { suggestChanges } from "@src/controllers/PartnerController";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { GoalItem } from "@src/models/GoalItem";
import GlobalFab from "./GlobalFab";
import { FabMenuOption } from "./FabOptionsMenu/FabOptionsMenu.types";
import { useFabMenu } from "./FabOptionsMenu/useFabMenu";

const PartnerGoalMoveFab: React.FC = () => {
  const { t } = useTranslation();

  const { parentId = "root" } = useParams({ strict: false }) as {
    parentId: string;
    partnerId: string;
  };

  const { openMenu, open } = useFabMenu();
  const goalToMove = useRecoilValue(moveGoalState);
  const setGoalToMove = useSetRecoilState(moveGoalState);

  const { data: parentGoal } = useGetGoalById(parentId, false);

  const rootGoalId = useRouterState({
    select: (s) => s.location.state?.rootGoalId,
  });

  const moveHerePartner = useCallback(
    async (goal: GoalItem) => {
      let rootGoal = goal;
      if (rootGoalId) {
        rootGoal = (await getSharedWMGoalById(rootGoalId)) || goal;
      }

      suggestChanges(rootGoal, { ...goal, parentGoalId: parentId }, parentGoal?.depth || 0);
    },
    [rootGoalId, parentId, parentGoal?.depth],
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
        label: t("Move here"),
        onClick: handleMoveGoalHere,
        disabled: !shouldRenderMoveButton,
      },
      {
        label: t("Cancel"),
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
