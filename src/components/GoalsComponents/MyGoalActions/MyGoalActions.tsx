import { Modal, Tooltip } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import useGoalStore from "@src/hooks/useGoalStore";
import ConfirmationModal from "@src/common/ConfirmationModal";

import {
  darkModeState,
  displayToast,
  lastAction,
  openDevMode,
  displayConfirmation,
  openInbox,
  displayPartnerMode,
} from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { themeState } from "@src/store/ThemeState";
import { goalsHistory } from "@src/store/GoalsState";
import { confirmAction } from "@src/Interfaces/IPopupModals";
// import { convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { archiveThisGoal, removeThisGoal } from "@src/helpers/GoalActionHelper";

import ActionDiv from "./ActionDiv";
import "./MyGoalActions.scss";

const MyGoalActions = ({ goal, open }: { open: boolean; goal: GoalItem }) => {
  const { t } = useTranslation();
  const { handleShareGoal, handleConfirmation } = useGoalStore();
  const confirmActionCategory = goal.typeOfGoal === "shared" && goal.parentGoalId === "root" ? "collaboration" : "goal";

  const theme = useRecoilValue(themeState);
  const isInboxOpen = useRecoilValue(openInbox);
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const showConfirmation = useRecoilValue(displayConfirmation);
  const showPartnerMode = useRecoilValue(displayPartnerMode);
  const setDevMode = useSetRecoilState(openDevMode);
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const ancestors = subGoalsHistory.map((ele) => ele.goalID);

  const [confirmationAction, setConfirmationAction] = useState<confirmAction | null>(null);

  const isSharedGoal = isInboxOpen || showPartnerMode;

  const handleActionClick = async (action: string) => {
    if (action === "delete") {
      if (goal.title === "magic") {
        setDevMode(false);
      }
      await removeThisGoal(goal, ancestors, isInboxOpen, showPartnerMode);
      setLastAction("Delete");
    } else if (action === "archive") {
      await archiveThisGoal(goal, ancestors, isInboxOpen);
      setLastAction("Archive");
    } else if (action === "colabRequest") {
      // await convertSharedWMGoalToColab(goal);
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

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      centered
      width={200}
      onCancel={() => window.history.back()}
      className={`interactables-modal popupModal${darkModeStatus ? "-dark" : ""} ${
        darkModeStatus ? "dark" : "light"
      }-theme${theme[darkModeStatus ? "dark" : "light"]}`}
    >
      <div style={{ textAlign: "left" }} className="header-title">
        <Tooltip placement="top" title={goal.title}>
          <p className="ordinary-element" id="title-field">
            {goal.title}
          </p>
        </Tooltip>
      </div>
      {confirmationAction && <ConfirmationModal action={confirmationAction} handleClick={handleActionClick} />}
      <div
        className="goal-action shareOptions-btn"
        onClickCapture={async (e) => {
          e.stopPropagation();
          await openConfirmationPopUp({ actionCategory: confirmActionCategory, actionName: "delete" });
        }}
      >
        <ActionDiv label={t(isInboxOpen ? "Rmove From here" : "Delete")} icon="Delete" />
      </div>
      {((isSharedGoal && goal.parentGoalId === "root") || !isSharedGoal) && (
        <div
          className="goal-action shareOptions-btn"
          onClickCapture={async (e) => {
            e.stopPropagation();
            if (!isSharedGoal) {
              if (goal.typeOfGoal !== "myGoal" && goal.parentGoalId !== "root") {
                setShowToast({
                  message: "Sorry, you are not allowed to share",
                  open: true,
                  extra: "Shared or Collaborated subgoals cannot be shared again ",
                });
              } else {
                handleShareGoal(goal);
              }
            } else {
              await openConfirmationPopUp({ actionCategory: "collaboration", actionName: "colabRequest" });
            }
          }}
        >
          <ActionDiv
            label={t(isSharedGoal ? "Collaborate" : "Share")}
            icon={isSharedGoal ? "Collaborate" : "SingleAvatar"}
          />
        </div>
      )}
      {!isSharedGoal && (
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
    </Modal>
  );
};

export default MyGoalActions;
