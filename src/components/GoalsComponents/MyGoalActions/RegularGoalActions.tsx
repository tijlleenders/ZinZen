import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import useGoalStore from "@src/hooks/useGoalStore";
import ConfirmationModal from "@src/common/ConfirmationModal";
import ZModal from "@src/common/ZModal";

import { lastAction, openDevMode, displayConfirmation, displayPartnerMode } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { goalsHistory } from "@src/store/GoalsState";
import { confirmAction } from "@src/Interfaces/IPopupModals";
import { convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { archiveThisGoal, removeThisGoal } from "@src/helpers/GoalActionHelper";

import ActionDiv from "./ActionDiv";
import "./MyGoalActions.scss";
import GoalItemSummary from "../MyGoal/GoalItemSummary/GoalItemSummary";

const RegularGoalActions = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const { handleUpdateGoal, handleShareGoal, handleConfirmation } = useGoalStore();
  const confirmActionCategory = goal.typeOfGoal === "shared" && goal.parentGoalId === "root" ? "collaboration" : "goal";

  const subGoalsHistory = useRecoilValue(goalsHistory);
  const showConfirmation = useRecoilValue(displayConfirmation);
  const isPartnerGoal = useRecoilValue(displayPartnerMode);
  const setDevMode = useSetRecoilState(openDevMode);
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

  return (
    <ZModal open width={400} onCancel={() => window.history.back()} type="interactables-modal">
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
        <GoalItemSummary goal={goal} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {confirmationAction && <ConfirmationModal action={confirmationAction} handleClick={handleActionClick} />}
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
      </div>
    </ZModal>
  );
};

export default RegularGoalActions;
