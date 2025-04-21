import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import useGoalStore from "@src/hooks/useGoalStore";
import ConfirmationModal from "@src/common/ConfirmationModal";
import ZModal from "@src/common/ZModal";
import archiveSound from "@assets/archive.mp3";

import { lastAction, displayConfirmation, displayToast } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { TConfirmAction } from "@src/Interfaces/IPopupModals";
import useGoalActions from "@src/hooks/useGoalActions";

import { ILocationState } from "@src/Interfaces";
import { convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { archiveThisGoal } from "@src/helpers/GoalActionHelper";

import { GoalActions } from "@src/constants/actions";
import { updateTimestamp } from "@src/api/GoalsAPI";
import ActionDiv from "./ActionDiv";

import "./MyGoalActions.scss";
import GoalItemSummary from "../../../common/GoalItemSummary/GoalItemSummary";

const doneSound = new Audio(archiveSound);

const RegularGoalActions = ({ goal }: { goal: GoalItem }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { partnerId } = useParams();
  const { openEditMode, handleMove } = useGoalStore();
  const { state, pathname }: { state: ILocationState; pathname: string } = useLocation();
  const { deleteGoalAction } = useGoalActions();
  const isPartnerModeActive = !!partnerId;

  const confirmActionCategory = goal.typeOfGoal === "shared" && goal.parentGoalId === "root" ? "collaboration" : "goal";

  const showConfirmation = useRecoilValue(displayConfirmation);
  const setLastAction = useSetRecoilState(lastAction);
  const ancestors = (state?.goalsHistory || []).map((ele) => ele.goalID);

  const setShowToast = useSetRecoilState(displayToast);

  const [confirmationAction, setConfirmationAction] = useState<TConfirmAction | null>(null);

  const showMessage = (message: string, extra = "") => {
    setShowToast({
      open: true,
      message,
      extra,
    });
  };

  const handleArchiveGoal = async (goalToArchive: GoalItem, goalAncestors: string[]) => {
    await updateTimestamp(goalToArchive.id);
    await archiveThisGoal(goalToArchive, goalAncestors);
    setLastAction(GoalActions.GOAL_ARCHIVED);
    const goalTitleElement = document.querySelector(`#goal-${goalToArchive.id} .goal-title`) as HTMLElement;
    if (goalTitleElement) {
      goalTitleElement.style.textDecoration = "line-through";
      goalTitleElement.style.textDecorationColor = goalToArchive.goalColor;
      goalTitleElement.style.textDecorationThickness = "4px";
    }
    await doneSound.play();
  };

  const handleActionClick = async (action: string) => {
    if (action === "delete") {
      await deleteGoalAction(goal);
      setLastAction(GoalActions.GOAL_DELETED);
      showMessage("Moved to trash!", "We'll delete it in 7 days.");
    } else if (action === "archive") {
      await handleArchiveGoal(goal, ancestors);
    } else if (action === "colabRequest") {
      const res = await convertSharedWMGoalToColab(goal);
      if (res) {
        setShowToast({
          open: true,
          message: `Goal ${res.convertedGoal?.title} has been added into ${res.parentGoalName}!`,
          extra: "",
        });
      }
      setLastAction(GoalActions.GOAL_COLAB_REQUEST);
    } else if (action === "move") {
      await handleMove(goal);
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
            await handleActionClick("delete");
          }}
        >
          <ActionDiv label={t("Delete")} icon="Delete" />
        </div>
        {!isPartnerModeActive && (
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
        {((isPartnerModeActive && goal.parentGoalId === "root") || !isPartnerModeActive) && (
          <div
            className="goal-action shareOptions-btn"
            onClickCapture={async (e) => {
              e.stopPropagation();
              if (!isPartnerModeActive) {
                navigate(`${pathname}?share=true`, { state, replace: true });
              } else {
                await openConfirmationPopUp({ actionCategory: "collaboration", actionName: "colabRequest" });
              }
            }}
          >
            <ActionDiv
              label={t(isPartnerModeActive ? "Collaborate" : "Share")}
              icon={isPartnerModeActive ? "Collaborate" : "SingleAvatar"}
              dataTestId={isPartnerModeActive ? "collaborate-action" : "share-action"}
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
        <div
          className="goal-action shareOptions-btn"
          onClickCapture={async (e) => {
            e.stopPropagation();
            await openConfirmationPopUp({ actionCategory: "goal", actionName: "move" });
          }}
        >
          <ActionDiv label={t("Move")} icon="Move" dataTestId="move-action" />
        </div>
      </div>
    </ZModal>
  );
};

export default RegularGoalActions;
