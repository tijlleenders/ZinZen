import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import ZModal from "@src/common/ZModal";
import useGoalStore from "@src/hooks/useGoalStore";
import ConfirmationModal from "@src/common/ConfirmationModal";

import { GoalItem } from "@src/models/GoalItem";
import { restoreGoal } from "@src/helpers/GoalController";
import { confirmAction } from "@src/Interfaces/IPopupModals";
import { unarchiveIcon } from "@src/assets";
import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import { TAction, goalsHistory } from "@src/store/GoalsState";
import { archiveThisGoal, removeThisGoal } from "@src/helpers/GoalActionHelper";
import { lastAction, openDevMode, displayConfirmation, displayPartnerMode, darkModeState } from "@src/store";

import ActionDiv from "./ActionDiv";
import "./MyGoalActions.scss";

const AccordionActions = ({ actionType, goal, open }: { actionType: TAction; open: boolean; goal: GoalItem }) => {
  const { t } = useTranslation();
  const { openEditMode, handleConfirmation } = useGoalStore();
  const confirmActionCategory = goal.typeOfGoal === "shared" && goal.parentGoalId === "root" ? "collaboration" : "goal";

  const subGoalsHistory = useRecoilValue(goalsHistory);
  const ancestors = subGoalsHistory.map((ele) => ele.goalID);
  const showConfirmation = useRecoilValue(displayConfirmation);
  const isPartnerGoal = useRecoilValue(displayPartnerMode);
  const setDevMode = useSetRecoilState(openDevMode);
  const darkModeStatus = useRecoilValue(darkModeState);
  const setLastAction = useSetRecoilState(lastAction);

  const [confirmationAction, setConfirmationAction] = useState<confirmAction | null>(null);

  const handleActionClick = async (action: string) => {
    if (action === "delete") {
      if (goal.title === "magic") {
        setDevMode(false);
      }
      await removeThisGoal(goal, ancestors, isPartnerGoal);
      setLastAction("goalDeleted");
    } else if (action === "archive") {
      await archiveThisGoal(goal, ancestors);
      setLastAction("goalArchived");
    } else if (action === "restore") {
      if (actionType === "archived") {
        await unarchiveUserGoal(goal);
      } else if (actionType === "deleted") {
        await restoreGoal(goal, ancestors);
      }
      setLastAction("goalUnarchived");
    } else {
      return;
    }
    window.history.go(confirmationAction ? -2 : -1);
  };

  const openConfirmationPopUp = async (action: TConfirmAction) => {
    const { actionCategory, actionName } = action;
    if (actionCategory === "collaboration" && showConfirmation.collaboration[actionName]) {
      handleConfirmation();
      setConfirmationAction({ ...action });
    } else if (actionCategory === "goal" && showConfirmation.goal[action.actionName]) {
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
            await openConfirmationPopUp({ actionCategory: TConfirmActionCategory, actionName: "restore" });
          }}
        >
          <ActionDiv
            label={t("Restore")}
            icon={
              <img
                alt="archived goal"
                src={unarchiveIcon}
                style={{ width: 24, height: 25, filter: darkModeStatus ? "invert(1)" : "none" }}
              />
            }
          />
        </div>
        {!isPartnerGoal && (
          <div
            className="goal-action-archive shareOptions-btn"
            onClickCapture={async (e) => {
              e.stopPropagation();
              await openConfirmationPopUp({ actionCategory: TConfirmActionCategory, actionName: "delete" });
            }}
          >
            <ActionDiv label={t("Delete")} icon="Delete" />
          </div>
        )}
      </div>
    </ZModal>
  );
};

export default AccordionActions;
