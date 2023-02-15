import React from "react";
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import correct from "@assets/images/correct.svg";
import pencil from "@assets/images/pencil.svg";
import share from "@assets/images/share.svg";
import deleteIcon from "@assets/images/deleteIcon.svg";
import collaborateSvg from "@assets/images/collaborate.svg";

import { GoalItem } from "@src/models/GoalItem";
import { darkModeState, displayInbox, displayToast, lastAction } from "@src/store";
import { archiveSharedWMGoal, convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { archiveGoal, deleteGoal, deleteSharedGoal } from "@src/helpers/GoalController";
import { addInGoalsHistory, displayAddGoalOptions, goalsHistory } from "@src/store/GoalsState";

const eyeSvg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nO2WvUoDQRSFPwsjoomk8wHEUpNgL9aKnVjYii/hT2FEIwgS8hBKgp1gY6ddYpGHWPNjKRKrRAZuYBj3zu5iRIs9cJs7557D3Duzs5AixT/AGlAGHoEOMJDoSO4UKE3ScBt4AUYxowls/cRwGXhIYOjGPbCU1HQX+AgR6wGHQAGYkygCR7Lm8t+BnTiGU8A5MAwRqQNZT61Za4TUGa0z0VZNa0rb6r5CRyPMfARUNY0rpaAXsVMXOaCvaF265APPITEztZERgVcgACqSs3Hs0dsfk1aBTw/RrNuohHBMzkbRozcAVgypFXEt3DYHIRyTs5GN0GwZUvsXjHMRmm1D2lCuzzgKMVp9kaDVQ2B9TKx6iObjYCMj5oHncJ149K5dsecJXacF4E3RegKm3YK8Z96NBB+QO89c81rhorwumnkuYqeaaVO0vZgFbhWBvnwczLs7L1GSmWrtvRHNWDAt21OuTtwIRCPOiL4hKy+LthutK+WEB1LFDLApr5c5/V3r16cruZpwDDdFCv4MXw/YJO5+W1zLAAAAAElFTkSuQmCC";
const envelope = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABRElEQVR4nO3TPyuFYRgG8B+LwYBisChhwGJQBllkQPkESvI9lOQLGK1GmzIoBhmUwSSDFCKlzmbxp/zprfutp9N5nXM4YnDVvTz3dV/X0/1cD38IA9jBPoYbKdyKFTzhPeoF62j7jnAzlnAfoq/YiHqNs/vgZNy6MIqj5MbHGEv6IzhM+icYr0W4u+yGd1hAUwF/DtfBfcMWeorEZ/EQ5Eesxf6roTW4jzGbacxUIl4FYRu96kdvzGYal5UI+T7PMfkFg3GcJjqFBvk+N9FZg3B7RDZ/t6oGq3hOYjj/ifh8EuPnmK1qkKEfe8nZAQYTbh92k34W2aEKOoUGIpqLKCXJWo7KE1MKThrjmg1ydMTfeCvbcZb5rjp0ihuBCZzhAlOK8WWDDC1RfsqgFvyewW3ZI36nbioZzESjEeLTDdjEPzQGH5tWnsH1/ab+AAAAAElFTkSuQmCC";
interface MyGoalActionsProps {
  goal: GoalItem,
  setShowShareModal: React.Dispatch<React.SetStateAction<string>>,
  setShowUpdateGoal: SetterOrUpdater<{
      open: boolean;
      goalId: string;
  } | null>,
}
const MyGoalActions: React.FC<MyGoalActionsProps> = ({ goal, setShowShareModal, setShowUpdateGoal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const setShowAddGoalOptions = useSetRecoilState(displayAddGoalOptions);
  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);

  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);

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

  return (
    <div className={`interactables${darkModeStatus ? "-dark" : ""}`}>
      {!openInbox && (
      <img
        alt="add subgoal"
        src={plus}
        style={{ cursor: "pointer" }}
        className={`${darkModeStatus ? "dark-svg" : ""}`}
        onClickCapture={() => {
          // @ts-ignore
          addInHistory(goal);
          setShowAddGoalOptions(true);
        }}
      />
      )}
      <img
        alt="delete goal"
        src={deleteIcon}
        className={`${darkModeStatus ? "dark-svg" : ""}`}
        style={{ cursor: "pointer" }}
        onClickCapture={async (e) => {
          e.stopPropagation();
          await removeThisGoal();
        }}
      />

      { ((openInbox && goal.parentGoalId === "root") || !openInbox) && (
        <img
          alt="share goal"
          src={openInbox ? collaborateSvg : share}
          className={`${darkModeStatus ? "dark" : "light"}-svg`}
          style={{ cursor: "pointer", ...(openInbox && !darkModeStatus ? { filter: "none" } : {}) }}
          onClickCapture={async (e) => {
            e.stopPropagation();
            if (!openInbox) {
              if (goal.typeOfGoal !== "myGoal" && goal.parentGoalId !== "root") {
                setShowToast({ message: "Sorry, you are not allowed to share", open: true, extra: "Shared or Collaborated subgoals cannot be shared again " });
              } else { setShowShareModal(goal.id); }
            } else {
              await convertSharedWMGoalToColab(goal);
              setOpenInbox(false);
            }
          }}
        />
      )}

      <img
        alt="Update Goal"
        src={openInbox ? eyeSvg : pencil}
        style={{ cursor: "pointer", height: "35px" }}
        className={`${darkModeStatus ? "dark" : `${openInbox ? "light" : ""}`}-svg`}
        onClickCapture={() => { setShowUpdateGoal({ open: true, goalId: goal.id }); }}
      />

      { !openInbox && (
      <img
        alt="archive Goal"
        src={openInbox ? envelope : correct}
        onClickCapture={async () => { await archiveThisGoal(); }}
        style={{ cursor: "Pointer" }}
        className={`${darkModeStatus ? "dark" : "light"}-svg`}

      />
      ) }
    </div>
  );
};

export default MyGoalActions;
