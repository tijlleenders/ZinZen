import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";

import useGoalStore from "@src/hooks/useGoalStore";
import ConfirmationModal from "@src/common/ConfirmationModal";
import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import { unarchiveIcon } from "@src/assets";
import ZModal from "@src/common/ZModal";

import {
  displayToast,
  lastAction,
  openDevMode,
  displayConfirmation,
  displayPartnerMode,
  darkModeState,
} from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { goalsHistory } from "@src/store/GoalsState";
import { confirmAction } from "@src/Interfaces/IPopupModals";
import { convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { archiveThisGoal, removeThisGoal } from "@src/helpers/GoalActionHelper";

import ActionDiv from "./ActionDiv";
import "./MyGoalActions.scss";

const MyGoalActions = ({ goal, open }: { open: boolean; goal: GoalItem }) => {
  const { t } = useTranslation();
  const { handleUpdateGoal, handleShareGoal, handleConfirmation } = useGoalStore();
  const confirmActionCategory = goal.typeOfGoal === "shared" && goal.parentGoalId === "root" ? "collaboration" : "goal";

  const subGoalsHistory = useRecoilValue(goalsHistory);
  const showConfirmation = useRecoilValue(displayConfirmation);
  const isPartnerGoal = useRecoilValue(displayPartnerMode);
  const setDevMode = useSetRecoilState(openDevMode);
  const setShowToast = useSetRecoilState(displayToast);
  const darkModeStatus = useRecoilValue(darkModeState);
  const setLastAction = useSetRecoilState(lastAction);
  const ancestors = subGoalsHistory.map((ele) => ele.goalID);

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
      await unarchiveUserGoal(goal);
      setLastAction("goalUnarchived");
    } else if (action === "colabRequest") {
      await convertSharedWMGoalToColab(goal);
      window.history.back();
    } else {
      return;
    }
    window.history.go(confirmationAction ? -2 : -1);
  };

  const openConfirmationPopUp = async (action: confirmAction) => {
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

  const isGoalArchived = goal.archived;

  return (
    <ZModal open={open} width={400} onCancel={() => window.history.back()} type="interactables-modal">
      <div
        style={{ textAlign: "left" }}
        className="header-title"
        onClickCapture={() => {
          handleUpdateGoal(goal.id, !!goal.timeBudget?.perDay);
        }}
      >
        <p className="ordinary-element" id="title-field">
          {t(`${goal.title}`)}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {confirmationAction && <ConfirmationModal action={confirmationAction} handleClick={handleActionClick} />}
        {isGoalArchived === "true" ? (
          <>
            <div
              className="goal-action-archive shareOptions-btn"
              onClickCapture={async (e) => {
                e.stopPropagation();
                await openConfirmationPopUp({ actionCategory: confirmActionCategory, actionName: "restore" });
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
                  await openConfirmationPopUp({ actionCategory: confirmActionCategory, actionName: "delete" });
                }}
              >
                <ActionDiv label={t("Delete")} icon="Delete" />
              </div>
            )}
          </>
        ) : (
          <>
            <div
              className="goal-action shareOptions-btn"
              onClickCapture={async (e) => {
                e.stopPropagation();
                await openConfirmationPopUp({ actionCategory: confirmActionCategory, actionName: "delete" });
              }}
            >
              <ActionDiv label={t("Delete")} icon="Delete" />
            </div>
            {!isPartnerGoal && (
              <div
                className="goal-action shareOptions-btn"
                onClickCapture={async (e) => {
                  e.stopPropagation();
                  await openConfirmationPopUp({ actionCategory: confirmActionCategory, actionName: "archive" });
                }}
              >
                <ActionDiv label={t("Done")} icon="Correct" />
              </div>
            )}
            {((isPartnerGoal && goal.parentGoalId === "root") || !isPartnerGoal) && (
              <div
                className="goal-action shareOptions-btn"
                onClickCapture={async (e) => {
                  e.stopPropagation();
                  if (!isPartnerGoal) {
                    handleShareGoal(goal);
                  } else {
                    await openConfirmationPopUp({ actionCategory: "collaboration", actionName: "colabRequest" });
                  }
                }}
              >
                <ActionDiv
                  label={t(isPartnerGoal ? "Collaborate" : "Share")}
                  icon={isPartnerGoal ? "Collaborate" : "SingleAvatar"}
                />
              </div>
            )}
            <div
              className="goal-action shareOptions-btn"
              onClickCapture={() => {
                handleUpdateGoal(goal.id, !!goal.timeBudget?.perDay);
              }}
            >
              <ActionDiv label={t("Edit")} icon="Edit" />
            </div>
          </>
        )}
      </div>
    </ZModal>
  );
};

export default MyGoalActions;
