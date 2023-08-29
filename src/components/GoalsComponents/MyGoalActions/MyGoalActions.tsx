import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import correct from "@assets/images/correct.svg";
import share from "@assets/images/share.svg";
import deleteIcon from "@assets/images/deleteIcon.svg";
import archiveSound from "@assets/archive.mp3";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";
import { handshakeIcon } from "@src/assets";

import useGoalStore from "@src/hooks/useGoalStore";
import ConfirmationModal from "@src/common/ConfirmationModal";
import { GoalItem } from "@src/models/GoalItem";
import { confirmAction } from "@src/Interfaces/IPopupModals";
import { goalsHistory } from "@src/store/GoalsState";
import { archiveGoal, deleteGoal, deleteSharedGoal } from "@src/helpers/GoalController";
import { archiveSharedWMGoal, convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { darkModeState, displayToast, lastAction, openDevMode, displayConfirmation, openInbox } from "@src/store";
import { useTranslation } from "react-i18next";
import { Col, Modal, Row, Tooltip } from "antd";
import { themeState } from "@src/store/ThemeState";
import "./MyGoalActions.scss";

const MyGoalActions = ({ goal, open }: { open: boolean; goal: GoalItem }) => {
  const { t } = useTranslation();
  const mySound = new Audio(archiveSound);
  const pageCrumple = new Audio(pageCrumplingSound);
  const { handleShareGoal, handleConfirmation } = useGoalStore();
  const confirmActionCategory =
    goal.typeOfGoal === "collaboration" && goal.parentGoalId === "root" ? "collaboration" : "goal";

  const theme = useRecoilValue(themeState);
  const isInboxOpen = useRecoilValue(openInbox);
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const showConfirmation = useRecoilValue(displayConfirmation);

  const setDevMode = useSetRecoilState(openDevMode);
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);

  const [confirmationAction, setConfirmationAction] = useState<confirmAction | null>(null);

  const archiveThisGoal = async () => {
    if (isInboxOpen) {
      await archiveSharedWMGoal(goal);
    } else await archiveGoal(goal, subGoalsHistory.length);
    setLastAction("Archive");
  };

  const removeThisGoal = async () => {
    if (isInboxOpen) {
      await deleteSharedGoal(goal);
    } else {
      if (goal.title === "magic") {
        setDevMode(false);
      }
      await deleteGoal(goal, subGoalsHistory.length);
    }
    setLastAction("Delete");
  };

  const handleActionClick = async (action: string) => {
    // setConfirmationAction(null);
    if (action === "delete") {
      await pageCrumple.play();
      await removeThisGoal();
    } else if (action === "archive") {
      await mySound.play();
      await archiveThisGoal();
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
    <Modal
      open={open}
      closable={false}
      footer={null}
      centered
      width={200}
      onCancel={() => window.history.back()}
      className={`interactables-modal popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"
        }-theme${theme[darkModeStatus ? "dark" : "light"]}`}
    >
      <div style={{ textAlign: "left" }} className="header-title">
        <Tooltip placement="top" title={goal.title}>
          <p
            className="ordinary-element"
            id="title-field"
          // onChange={(e) => setTitle(e.target.value)}
          >
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
        <Row>
          <Col span={6}>
            <img
              alt="delete goal"
              src={deleteIcon}
              className={`${darkModeStatus ? "dark-svg" : ""}`}
              style={{ cursor: "pointer" }}
            />
          </Col>
          <Col span={18}>
            <p>{t("Delete")}</p>
          </Col>
        </Row>
      </div>

      {((isInboxOpen && goal.parentGoalId === "root") || !isInboxOpen) && (
        <div
          className="goal-action shareOptions-btn"
          onClickCapture={async (e) => {
            e.stopPropagation();
            if (!isInboxOpen) {
              if (goal.typeOfGoal !== "myGoal" && goal.parentGoalId !== "root") {
                setShowToast({
                  message: "Sorry, you are not allowed to share",
                  open: true,
                  extra: "Shared or Collaborated subgoals cannot be shared again ",
                });
              } else {
                handleShareGoal(goal.id);
              }
            } else {
              await openConfirmationPopUp({ actionCategory: "collaboration", actionName: "colabRequest" });
            }
          }}
        >
          <Row>
            <Col span={6}>
              <img
                alt="share goal"
                src={isInboxOpen ? handshakeIcon : share}
                className={`${darkModeStatus ? "dark-svg" : ""}`}
                style={{ cursor: "pointer", ...(isInboxOpen && !darkModeStatus ? { filter: "none" } : {}) }}
              />
            </Col>
            <Col span={18}>
              <p>{t(isInboxOpen ? "Collaborate" : "Share")}</p>
            </Col>
          </Row>
        </div>
      )}
      {!isInboxOpen && (
        <div
          className="goal-action shareOptions-btn"
          onClickCapture={async (e) => {
            e.stopPropagation();
            await openConfirmationPopUp({ actionCategory: confirmActionCategory, actionName: "archive" });
          }}
        >
          <Row>
            <Col span={6}>
              <img
                alt="archive Goal"
                src={correct}
                style={{ cursor: "Pointer" }}
                className={`${darkModeStatus ? "dark-svg" : ""}`}
              />{" "}
            </Col>
            <Col span={18}>
              <p>{t("Done")}</p>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );
};

export default MyGoalActions;
