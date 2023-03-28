import React, { useState } from "react";
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import correct from "@assets/images/correct.svg";
import pencil from "@assets/images/pencil.svg";
import share from "@assets/images/share.svg";
import deleteIcon from "@assets/images/deleteIcon.svg";
import collaborateSvg from "@assets/images/collaborate.svg";
import archiveSound from "@assets/archive.mp3";

import { colorPalleteList } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";
import ConfirmationModal from "@src/common/ConfirmationModal";
import { confirmAction } from "@src/Interfaces/IPopupModals";
import { archiveSharedWMGoal, convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { archiveGoal, deleteGoal, deleteSharedGoal } from "@src/helpers/GoalController";
import { darkModeState, displayInbox, displayToast, lastAction, showConfirmation } from "@src/store";
import { addInGoalsHistory, displayAddGoal, goalsHistory, selectedColorIndex } from "@src/store/GoalsState";

const eyeSvg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nO2WvUoDQRSFPwsjoomk8wHEUpNgL9aKnVjYii/hT2FEIwgS8hBKgp1gY6ddYpGHWPNjKRKrRAZuYBj3zu5iRIs9cJs7557D3Duzs5AixT/AGlAGHoEOMJDoSO4UKE3ScBt4AUYxowls/cRwGXhIYOjGPbCU1HQX+AgR6wGHQAGYkygCR7Lm8t+BnTiGU8A5MAwRqQNZT61Za4TUGa0z0VZNa0rb6r5CRyPMfARUNY0rpaAXsVMXOaCvaF265APPITEztZERgVcgACqSs3Hs0dsfk1aBTw/RrNuohHBMzkbRozcAVgypFXEt3DYHIRyTs5GN0GwZUvsXjHMRmm1D2lCuzzgKMVp9kaDVQ2B9TKx6iObjYCMj5oHncJ149K5dsecJXacF4E3RegKm3YK8Z96NBB+QO89c81rhorwumnkuYqeaaVO0vZgFbhWBvnwczLs7L1GSmWrtvRHNWDAt21OuTtwIRCPOiL4hKy+LthutK+WEB1LFDLApr5c5/V3r16cruZpwDDdFCv4MXw/YJO5+W1zLAAAAAElFTkSuQmCC";
interface MyGoalActionsProps {
  goal: GoalItem,
  setShowShareModal: React.Dispatch<React.SetStateAction<string>>,
  setShowUpdateGoal: SetterOrUpdater<{
      open: boolean;
      goalId: string;
  } | null>,
}

const MyGoalActions: React.FC<MyGoalActionsProps> = ({ goal, setShowShareModal, setShowUpdateGoal }) => {
  const mySound = new Audio(archiveSound);
  const confirmActionCategory = goal.typeOfGoal === "collaboration" && goal.parentGoalId === "root" ? "collaboration" : "goal";
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);
  const setShowAddGoal = useSetRecoilState(displayAddGoal);
  const setColorIndex = useSetRecoilState(selectedColorIndex);
  const [confirmationAction, setConfirmationAction] = useState<confirmAction | null>(null);

  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [displayConfirmation, setDisplayConfirmation] = useRecoilState(showConfirmation);

  const archiveThisGoal = async () => {
    if (openInbox) { await archiveSharedWMGoal(goal); } else await archiveGoal(goal, subGoalsHistory.length);
    setLastAction("Archive");
  };

  const removeThisGoal = async () => {
    if (openInbox) {
      await deleteSharedGoal(goal);
    } else { await deleteGoal(goal, subGoalsHistory.length); }
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
      setOpenInbox(false);
    }
    setConfirmationAction(null);
  };

  const openConfirmationPopUp = async (action: confirmAction) => {
    const { actionCategory, actionName } = action;
    if (actionCategory === "collaboration" && displayConfirmation.collaboration[actionName]) {
      setConfirmationAction({ ...action });
      setDisplayConfirmation({ ...displayConfirmation, open: true });
    } else if (actionCategory === "goal" && displayConfirmation.goal[action.actionName]) {
      setConfirmationAction({ ...action });
      setDisplayConfirmation({ ...displayConfirmation, open: true, });
    } else {
      await handleActionClick(actionName);
    }
  };

  return (
    <div className={`interactables${darkModeStatus ? "-dark" : ""}`}>
      { confirmationAction && <ConfirmationModal action={confirmationAction} handleClick={handleActionClick} /> }
      {!openInbox && (
        <div
          className="goal-action"
          onClickCapture={() => {
            setColorIndex(colorPalleteList.indexOf(goal.goalColor));
            // @ts-ignore
            addInHistory(goal);
            setShowAddGoal({ open: true, goalId: goal.id });
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

      { ((openInbox && goal.parentGoalId === "root") || !openInbox) && (
        <div
          className="goal-action"
          onClickCapture={async (e) => {
            e.stopPropagation();
            if (!openInbox) {
              if (goal.typeOfGoal !== "myGoal" && goal.parentGoalId !== "root") {
                setShowToast({ message: "Sorry, you are not allowed to share", open: true, extra: "Shared or Collaborated subgoals cannot be shared again " });
              } else { setShowShareModal(goal.id); }
            } else {
              await openConfirmationPopUp({ actionCategory: "collaboration", actionName: "colabRequest" });
            }
          }}
        >
          <img
            alt="share goal"
            src={openInbox ? collaborateSvg : share}
            className={`${darkModeStatus ? "dark" : "light"}-svg`}
            style={{ cursor: "pointer", ...(openInbox && !darkModeStatus ? { filter: "none" } : {}) }}

          />
          <p>{openInbox ? "Collaborate" : "Share"}</p>
        </div>
      )}
      <div
        className="goal-action"
        onClickCapture={() => {
          setColorIndex(colorPalleteList.indexOf(goal.goalColor));
          setShowUpdateGoal({ open: true, goalId: goal.id });
        }}
      >
        <img
          alt="Update Goal"
          src={openInbox ? eyeSvg : pencil}
          style={{ cursor: "pointer" }}
          className={`${darkModeStatus ? "dark" : `${openInbox ? "light" : ""}`}-svg`}

        />
        <p>{openInbox ? "View" : "Edit"}</p>
      </div>

      { !openInbox && (
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
          className={`${darkModeStatus ? "dark" : "light"}-svg`}
        />
        <p>Complete</p>
      </div>
      ) }
    </div>
  );
};

export default MyGoalActions;
