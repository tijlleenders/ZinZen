import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate, useParams, useRouterState, useSearch } from "@tanstack/react-router";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import { GoalItem } from "@src/models/GoalItem";
import { moveGoalState } from "@src/store/moveGoalState";
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { suggestChanges } from "@src/controllers/PartnerController";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";
import FabButton from "./FabButton";
import FabOptionsMenu, { FabOption } from "./FabOptionsMenu";

const PartnerGoalMoveFab: React.FC = () => {
  const { t } = useTranslation();
  const { addOptions } = useSearch({ strict: false }) as {
    type?: TGoalCategory;
    mode?: TGoalConfigMode;
    addOptions?: boolean;
  };

  const { parentId = "root", partnerId } = useParams({ strict: false }) as {
    parentId: string;
    partnerId: string;
  };

  const navigate = useNavigate();
  const goalToMove = useRecoilValue(moveGoalState);
  const setGoalToMove = useSetRecoilState(moveGoalState);

  const { data: parentGoal } = useGetGoalById(parentId, false);

  const rootGoalId = useRouterState({
    select: (s) => s.location.state?.rootGoalId,
  });

  const handleClick = () => {
    navigate({
      to: `/partners/${partnerId}/goals/${parentId}?addOptions=true`,
      state: (state) => ({ ...state }),
    });
  };

  const moveHerePartner = useCallback(
    async (goalToMove: GoalItem) => {
      let rootGoal = goalToMove;
      if (rootGoalId) {
        rootGoal = (await getSharedWMGoalById(rootGoalId)) || goalToMove;
      }

      suggestChanges(rootGoal, { ...goalToMove, parentGoalId: parentId }, parentGoal?.depth || 0);
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

export default PartnerGoalMoveFab;
