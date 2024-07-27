import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import ZModal from "@src/common/ZModal";
import useGoalStore from "@src/hooks/useGoalStore";
import ConfirmationModal from "@src/common/ConfirmationModal";

import { GoalItem } from "@src/models/GoalItem";
import { confirmAction } from "@src/Interfaces/IPopupModals";
import { unarchiveIcon } from "@src/assets";
import { lastAction, displayConfirmation, darkModeState } from "@src/store";
import { addHintGoaltoMyGoals } from "@src/api/GoalsAPI";
import { deleteGoalHint } from "@src/api/HintsAPI";

import ActionDiv from "./ActionDiv";
import "./MyGoalActions.scss";

const HintsAccordionActions = ({ goal, open }: { open: boolean; goal: GoalItem }) => {
  const { t } = useTranslation();
  const { openEditMode, handleConfirmation } = useGoalStore();
  const confirmActionCategory = "goal";

  const showConfirmation = useRecoilValue(displayConfirmation);
  const darkModeStatus = useRecoilValue(darkModeState);
  const setLastAction = useSetRecoilState(lastAction);

  const [confirmationAction, setConfirmationAction] = useState<confirmAction | null>(null);

  const handleActionClick = async (action: string) => {
    if (action === "deleteHint") {
      await deleteGoalHint(goal.parentGoalId, goal.id);
      setLastAction("goalHintDeleted");
    } else if (action === "addHint") {
      await addHintGoaltoMyGoals(goal);
      setLastAction("goalHintAdded");
    } else if (action === "report") {
      setLastAction("goalHintReported");
    } else {
      return;
    }
    window.history.go(confirmationAction ? -2 : -1);
  };

  const openConfirmationPopUp = async (action: TConfirmAction) => {
    const { actionCategory, actionName } = action;
    if (actionCategory === "goal" && showConfirmation.goal[action.actionName]) {
      handleConfirmation();
      setConfirmationAction({ ...action });
    } else {
      await handleActionClick(actionName);
    }
  };

  return (
    <ZModal open={open} width={400} onCancel={() => window.history.back()} type="interactables-modal">
      <div
        style={{ textAlign: "left" }}
        className="header-title"
        onClickCapture={() => {
          openEditMode(goal);
        }}
      >
        <p className="ordinary-element" id="title-field">
          {t(`${goal.title}`)}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {confirmationAction && <ConfirmationModal action={confirmationAction} handleClick={handleActionClick} />}

        <div
          className="goal-action-archive shareOptions-btn"
          onClickCapture={async (e) => {
            e.stopPropagation();
            await openConfirmationPopUp({ actionCategory: TConfirmActionCategory, actionName: "addHint" });
          }}
        >
          <ActionDiv label={t("Add Hint")} icon="Add" />
        </div>

        <div
          className="goal-action-archive shareOptions-btn"
          onClickCapture={async (e) => {
            e.stopPropagation();
            await openConfirmationPopUp({ actionCategory: TConfirmActionCategory, actionName: "deleteHint" });
          }}
        >
          <ActionDiv label={t("Delete Hint")} icon="Delete" />
        </div>

        <div
          className="goal-action-archive shareOptions-btn"
          onClickCapture={async (e) => {
            e.stopPropagation();
            await openConfirmationPopUp({ actionCategory: TConfirmActionCategory, actionName: "restore" });
          }}
        >
          <ActionDiv
            label={t("Report Hint")}
            icon={
              <img
                alt="archived goal"
                src={unarchiveIcon}
                style={{ width: 24, height: 25, filter: darkModeStatus ? "invert(1)" : "none" }}
              />
            }
          />
        </div>
      </div>
    </ZModal>
  );
};

export default HintsAccordionActions;
