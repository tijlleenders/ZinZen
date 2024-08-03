import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import useGoalStore from "@src/hooks/useGoalStore";
import ConfirmationModal from "@src/common/ConfirmationModal";
import ZModal from "@src/common/ZModal";
import archiveSound from "@assets/archive.mp3";

import { lastAction, openDevMode, displayConfirmation, displayPartnerMode } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { TConfirmAction } from "@src/Interfaces/IPopupModals";
import useGoalActions from "@src/hooks/useGoalActions";
import { goalsHistory, justCompletedGoalsState } from "@src/store/GoalsState";
import { convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { archiveThisGoal } from "@src/helpers/GoalActionHelper";

import ActionDiv from "./ActionDiv";

import "./MyGoalActions.scss";
import GoalItemSummary from "../../../common/GoalItemSummary/GoalItemSummary";

const doneSound = new Audio(archiveSound);

const RegularGoalActions = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { openEditMode } = useGoalStore();
  const { deleteGoalAction } = useGoalActions();
  const confirmActionCategory = goal.typeOfGoal === "shared" && goal.parentGoalId === "root" ? "collaboration" : "goal";

  const isPartnerGoal = useRecoilValue(displayPartnerMode);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const showConfirmation = useRecoilValue(displayConfirmation);
  const setDevMode = useSetRecoilState(openDevMode);
  const setJustCompletedGoals = useSetRecoilState(justCompletedGoalsState);
  const setLastAction = useSetRecoilState(lastAction);
  const ancestors = subGoalsHistory.map((ele) => ele.goalID);

  const [confirmationAction, setConfirmationAction] = useState<TConfirmAction | null>(null);
  console.log("🚀 ~ RegularGoalActions ~ confirmationAction:", confirmationAction);

  const handleActionClick = async (action: string) => {
    if (action === "delete") {
      await deleteGoalAction(goal);
      setLastAction("goalDeleted");
    } else if (action === "archive") {
      await archiveThisGoal(goal, ancestors);
      setLastAction("goalArchived");
      setJustCompletedGoals((prev) => [...prev, goal.id]);
      await doneSound.play();
    } else if (action === "colabRequest") {
      await convertSharedWMGoalToColab(goal);
    }
    window.history.back();
  };

  const openConfirmationPopUp = async (action: TConfirmAction) => {
    const { actionCategory, actionName } = action;
    if (actionCategory === "collaboration" && showConfirmation.collaboration[actionName]) {
      setConfirmationAction({ ...action });
    } else if (actionCategory === "goal" && showConfirmation.goal[action.actionName]) {
      setConfirmationAction({ ...action });
    } else {
      await handleActionClick(actionName);
    }
  };

  return (
    <ZModal open width={400} type="interactables-modal">
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
        <GoalItemSummary goal={goal} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {confirmationAction && (
          <ConfirmationModal
            action={confirmationAction}
            handleClick={handleActionClick}
            handleClose={() => {
              setConfirmationAction(null);
            }}
          />
        )}
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
                navigate(`${pathname}?share=true`, { state, replace: true });
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
            openEditMode(goal);
          }}
        >
          <ActionDiv label={t("Edit")} icon="Edit" />
        </div>
      </div>
    </ZModal>
  );
};

export default RegularGoalActions;
