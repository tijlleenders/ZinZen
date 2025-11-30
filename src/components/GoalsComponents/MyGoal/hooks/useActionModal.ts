import { useNavigate, useParams } from "@tanstack/react-router";
import { ImpossibleGoal } from "@src/Interfaces";
import { ActionModal } from "../types";

export const useActionModal = (goal: ImpossibleGoal, actionModal: ActionModal = ActionModal.ACTIVE) => {
  const { parentId = "root", partnerId } = useParams({ strict: false });
  const isPartnerModeActive = !!partnerId;
  const navigate = useNavigate();

  const showActionModal = (actionModalType: ActionModal = actionModal) => {
    const prefix = `${isPartnerModeActive ? `/partners/${partnerId}/` : "/"}goals`;
    const searchparam = goal.newUpdates ? "showNewChanges" : "showOptions";
    navigate({
      to: `${prefix}/${parentId}/${goal.id}?${searchparam}=${actionModalType}`,
      state: (prev) => ({ ...prev, actionModalType }),
    });
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    showActionModal(actionModal);
  };

  return { handleIconClick };
};
