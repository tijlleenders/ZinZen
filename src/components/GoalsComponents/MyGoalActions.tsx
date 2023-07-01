import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import correct from "@assets/images/correct.svg";
import pencil from "@assets/images/pencil.svg";
import share from "@assets/images/share.svg";
import deleteIcon from "@assets/images/deleteIcon.svg";
import archiveSound from "@assets/archive.mp3";
import { handshakeIcon } from "@src/assets";

import useGoalStore from "@src/hooks/useGoalStore";
import ConfirmationModal from "@src/common/ConfirmationModal";
import { GoalItem } from "@src/models/GoalItem";
import { confirmAction } from "@src/Interfaces/IPopupModals";
import { colorPalleteList } from "@src/utils";
import { goalsHistory, selectedColorIndex } from "@src/store/GoalsState";
import { archiveGoal, deleteGoal, deleteSharedGoal } from "@src/helpers/GoalController";
import { archiveSharedWMGoal, convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { darkModeState, displayToast, lastAction, openDevMode, displayConfirmation, openInbox } from "@src/store";

const eyeSvg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC7klEQVR4nO2YSWhUQRCGv6gRERVXXBA8GRcIincFQQ8akoMIgjGQHPUgLgcJguPJZLp6JglxIZi4gIh4EKMRTcSroBIQUfAoSJR4iFnPkZKOPB8vTr/JSybg+6GgZ6ar6q/q6q7ugRQpUqRIkeJ/h8AWA8ct5AWeCXwUGBAYdaLjDwZ6LFgLx5phc0lJZ2GTwAWBNwITRcprgfOtsH7OiLfADgt3XGYnEpJhA50WKmaNuIW1Bq4JjEUQGBLoFmgUONQC21pg5UNYmIFFOtbABaoMXNRSEvgZYUeT0toEq5ImXyPwNcKhlk/dVVgW12YbrLBQL9AftmvgSxYOz5i4Zk83XQTx5znYP2MHwCSUWTgo0Bf2Y6FZV7Eow5pVt9RBowMGTjALmIQygQaB7yGfjzOwNJaxLCy38Cpk6NFcnBZ52GjgSch3b8a3TDOw2J3lwZps91lKnaP7RU8UgfcCP5zo+KZAdQYWeJbujVAQ3R1QXjAAgeshxUafwAX2CbwrdGQaeJuHvZ4ldSmk3/pPJe2QIWdXPMmfitkXRgyc9LFtwYR0j0ZO1Pp2LX9q4lOfsrFQW2wDs1BfyL5y0I0cPEjaYF1UFm8HDH/S5uNBvmKahuQrQ1nYWshPDlYLfA5URmd4QqWB8UAANYWMuqAfJHCNuO/p60hAR28DO4M/3gtE98LHoIEN01wr4sqY7/EcanZ3/5y7uqkc+XEDuz2NNSRAfsJ3LyiysCegN/w7cANn4mbfBdCUVAACTTH89gb0TusXLwOZqPU15JpVUgF0xQigLqDXh+uU+mGkHdb4GnKvr6RKKO/rVzlOlbyFQc1kxsCgdj1fIy6AcwmuwNk4vgUu2yI4/4Uc7EoqgBxUUgpEPUaKkP6SkHcBVCcQQBWlhIFbxZI34StBKZCBJeH3gyf5HtVlPkAfGu7a63OlHtW3rj5amG9wf510CXyLID7g/vvZznxHB5TrbdHAARUdez0HU6RIkSJFihQpmFP8Akw1EIG66+t0AAAAAElFTkSuQmCC";

const MyGoalActions = ({ goal }: { goal: GoalItem }) => {
  const mySound = new Audio(archiveSound);
  const { handleAddGoal, handleShareGoal, handleUpdateGoal, handleConfirmation } = useGoalStore();
  const confirmActionCategory = goal.typeOfGoal === "collaboration" && goal.parentGoalId === "root" ? "collaboration" : "goal";

  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const showConfirmation = useRecoilValue(displayConfirmation);

  const setDevMode = useSetRecoilState(openDevMode);
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const setColorIndex = useSetRecoilState(selectedColorIndex);

  const [isInboxOpen, setIsInboxOpen] = useRecoilState(openInbox);
  const [confirmationAction, setConfirmationAction] = useState<confirmAction | null>(null);

  const archiveThisGoal = async () => {
    if (isInboxOpen) { await archiveSharedWMGoal(goal); } else await archiveGoal(goal, subGoalsHistory.length);
    setLastAction("Archive");
  };

  const removeThisGoal = async () => {
    if (isInboxOpen) {
      await deleteSharedGoal(goal);
    } else {
      if (goal.title === "magic") { setDevMode(false); }
      await deleteGoal(goal, subGoalsHistory.length);
    }
    setLastAction("Delete");
  };

  const handleActionClick = async (action: string) => {
    if (action === "delete") {
      await removeThisGoal();
    } else if (action === "archive") {
      await mySound.play();
      await archiveThisGoal();
    } else if (action === "colabRequest") {
      await convertSharedWMGoalToColab(goal);
      setIsInboxOpen(false);
    }
    setConfirmationAction(null);
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
    <div className={`interactables${darkModeStatus ? "-dark" : ""}`}>
      {confirmationAction && <ConfirmationModal action={confirmationAction} handleClick={handleActionClick} />}
      {!isInboxOpen && (
        <div
          className="goal-action"
          onClickCapture={() => {
            setColorIndex(colorPalleteList.indexOf(goal.goalColor));
            handleAddGoal(goal);
          }}
        >
          <img
            alt="add subgoal"
            src={plus}
            style={{ cursor: "pointer" }}
            className={`${darkModeStatus ? "dark-svg" : ""}`}
          />
          <p>Add</p>
        </div>
      )}
      <div
        className="goal-action"
        onClickCapture={async (e) => {
          e.stopPropagation();
          await openConfirmationPopUp({ actionCategory: confirmActionCategory, actionName: "delete" });
        }}
      >
        <img
          alt="delete goal"
          src={deleteIcon}
          className={`${darkModeStatus ? "dark-svg" : ""}`}
          style={{ cursor: "pointer" }}
        />
        <p>Delete</p>
      </div>

      {((isInboxOpen && goal.parentGoalId === "root") || !isInboxOpen) && (
        <div
          className="goal-action"
          onClickCapture={async (e) => {
            e.stopPropagation();
            if (!isInboxOpen) {
              if (goal.typeOfGoal !== "myGoal" && goal.parentGoalId !== "root") {
                setShowToast({ message: "Sorry, you are not allowed to share", open: true, extra: "Shared or Collaborated subgoals cannot be shared again " });
              } else { handleShareGoal(goal.id); }
            } else {
              await openConfirmationPopUp({ actionCategory: "collaboration", actionName: "colabRequest" });
            }
          }}
        >
          <img
            alt="share goal"
            src={isInboxOpen ? handshakeIcon : share}
            className={`${darkModeStatus ? "dark-svg" : ""}`}
            style={{ cursor: "pointer", ...(isInboxOpen && !darkModeStatus ? { filter: "none" } : {}) }}

          />
          <p>{isInboxOpen ? "Collaborate" : "Share"}</p>
        </div>
      )}
      <div
        className="goal-action"
        onClickCapture={() => { handleUpdateGoal(goal.id); }}
      >
        <img
          alt="Update Goal"
          src={isInboxOpen ? eyeSvg : pencil}
          style={{ cursor: "pointer" }}
          className={`${darkModeStatus ? "dark-svg" : ""}`}
        />
        <p>{isInboxOpen ? "View" : "Edit"}</p>
      </div>

      {!isInboxOpen && (
        <div
          className="goal-action"
          onClickCapture={async (e) => {
            e.stopPropagation();
            await openConfirmationPopUp({ actionCategory: confirmActionCategory, actionName: "archive" });
          }}
        >
          <img
            alt="archive Goal"
            src={correct}
            style={{ cursor: "Pointer" }}
            className={`${darkModeStatus ? "dark-svg" : ""}`}
          />
          <p>Done</p>
        </div>
      )}
    </div>
  );
};

export default MyGoalActions;
