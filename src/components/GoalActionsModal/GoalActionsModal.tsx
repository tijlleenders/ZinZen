import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import ZModal from "@src/common/ZModal";
import ConfirmationModal from "@src/common/ConfirmationModal";
import ModalActionButton from "@components/Buttons/ModalActionButton";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import GoalItemSummary from "@components/GoalItemSummary/GoalItemSummary";
import { displayConfirmation } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { TrashItem } from "@src/models/TrashItem";
import { TConfirmAction } from "@src/Interfaces/IPopupModals";

export interface Action {
  label: string;
  icon: string | ReactNode;
  onClick: () => Promise<void> | void;
  show?: boolean;
  requiresConfirmation?: boolean;
  confirmationCategory?: "goal" | "collaboration";
  confirmationAction?: string;
  loading?: boolean;
  dataTestId?: string;
}

interface GoalActionsModalProps {
  goal: GoalItem | TrashItem;
  actions: Action[];
  showSummary?: boolean;
  onHeaderClick?: () => void;
  onCancel?: () => void;
}

const GoalActionsModal: React.FC<GoalActionsModalProps> = ({
  goal,
  actions,
  showSummary = false,
  onHeaderClick,
  onCancel,
}) => {
  const { t } = useTranslation();
  const showConfirmation = useRecoilValue(displayConfirmation);
  const [confirmationAction, setConfirmationAction] = useState<{
    action: TConfirmAction;
    callback: () => Promise<void> | void;
  } | null>(null);

  const shouldShowConfirmation = (action: Action): boolean => {
    if (!action.requiresConfirmation || !action.confirmationCategory || !action.confirmationAction) {
      return false;
    }

    const category = action.confirmationCategory;
    const actionName = action.confirmationAction;

    if (category === "collaboration") {
      return showConfirmation.collaboration[actionName as keyof typeof showConfirmation.collaboration] ?? false;
    }
    if (category === "goal") {
      return showConfirmation.goal[actionName as keyof typeof showConfirmation.goal] ?? false;
    }

    return false;
  };

  const handleActionClick = async (action: Action) => {
    if (action.requiresConfirmation && shouldShowConfirmation(action)) {
      setConfirmationAction({
        action: {
          actionCategory: action.confirmationCategory!,
          actionName: action.confirmationAction!,
        } as TConfirmAction,
        callback: action.onClick,
      });
    } else {
      await action.onClick();
    }
  };

  const handleConfirmationClick = async (actionName: string) => {
    if (confirmationAction && actionName !== "cancel") {
      await confirmationAction.callback();
    }
    setConfirmationAction(null);
  };

  const visibleActions = actions.filter((action) => action.show !== false);

  return (
    <ZModal open width={400} type="interactables-modal" onCancel={onCancel}>
      <div style={{ textAlign: "left" }} className="header-title" onClickCapture={onHeaderClick}>
        <p className="ordinary-element" id="title-field">
          {t(`${goal.title}`)}
        </p>
        {showSummary && "parentGoalId" in goal && <GoalItemSummary goal={goal} variant="modal" />}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {confirmationAction && (
          <ConfirmationModal
            action={confirmationAction.action}
            handleClick={handleConfirmationClick}
            handleClose={() => setConfirmationAction(null)}
          />
        )}
        {visibleActions.map((action) => (
          <ModalActionButton key={action.label} loading={action.loading} onClick={() => handleActionClick(action)}>
            <ActionDiv label={t(action.label)} icon={action.icon} dataTestId={action.dataTestId} />
          </ModalActionButton>
        ))}
      </div>
    </ZModal>
  );
};

export default GoalActionsModal;
