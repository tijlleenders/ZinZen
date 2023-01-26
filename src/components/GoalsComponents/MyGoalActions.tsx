import React from "react";
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import correct from "@assets/images/correct.svg";
import pencil from "@assets/images/pencil.svg";
import share from "@assets/images/share.svg";
import trash from "@assets/images/trash.svg";
import collaborateSvg from "@assets/images/collaborate.svg";

import { darkModeState, displayInbox } from "@src/store";
import { archiveGoal, deleteGoal, deleteSharedGoal } from "@src/helpers/GoalController";
import { GoalItem } from "@src/models/GoalItem";
import { addInGoalsHistory, displayAddGoalOptions } from "@src/store/GoalsState";
import { archiveSharedWMGoal, removeSharedWMChildrenGoals, removeSharedWMGoal, transferToMyGoals } from "@src/api/SharedWMAPI";

const eyeSvg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nO2WvUoDQRSFPwsjoomk8wHEUpNgL9aKnVjYii/hT2FEIwgS8hBKgp1gY6ddYpGHWPNjKRKrRAZuYBj3zu5iRIs9cJs7557D3Duzs5AixT/AGlAGHoEOMJDoSO4UKE3ScBt4AUYxowls/cRwGXhIYOjGPbCU1HQX+AgR6wGHQAGYkygCR7Lm8t+BnTiGU8A5MAwRqQNZT61Za4TUGa0z0VZNa0rb6r5CRyPMfARUNY0rpaAXsVMXOaCvaF265APPITEztZERgVcgACqSs3Hs0dsfk1aBTw/RrNuohHBMzkbRozcAVgypFXEt3DYHIRyTs5GN0GwZUvsXjHMRmm1D2lCuzzgKMVp9kaDVQ2B9TKx6iObjYCMj5oHncJ149K5dsecJXacF4E3RegKm3YK8Z96NBB+QO89c81rhorwumnkuYqeaaVO0vZgFbhWBvnwczLs7L1GSmWrtvRHNWDAt21OuTtwIRCPOiL4hKy+LthutK+WEB1LFDLApr5c5/V3r16cruZpwDDdFCv4MXw/YJO5+W1zLAAAAAElFTkSuQmCC";
const envelope = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABRElEQVR4nO3TPyuFYRgG8B+LwYBisChhwGJQBllkQPkESvI9lOQLGK1GmzIoBhmUwSSDFCKlzmbxp/zprfutp9N5nXM4YnDVvTz3dV/X0/1cD38IA9jBPoYbKdyKFTzhPeoF62j7jnAzlnAfoq/YiHqNs/vgZNy6MIqj5MbHGEv6IzhM+icYr0W4u+yGd1hAUwF/DtfBfcMWeorEZ/EQ5Eesxf6roTW4jzGbacxUIl4FYRu96kdvzGYal5UI+T7PMfkFg3GcJjqFBvk+N9FZg3B7RDZ/t6oGq3hOYjj/ifh8EuPnmK1qkKEfe8nZAQYTbh92k34W2aEKOoUGIpqLKCXJWo7KE1MKThrjmg1ydMTfeCvbcZb5rjp0ihuBCZzhAlOK8WWDDC1RfsqgFvyewW3ZI36nbioZzESjEeLTDdjEPzQGH5tWnsH1/ab+AAAAAElFTkSuQmCC";
interface MyGoalActionsProps {
  goal: GoalItem,
  setShowShareModal: React.Dispatch<React.SetStateAction<string>>,
  setShowUpdateGoal: SetterOrUpdater<{
      open: boolean;
      goalId: string;
  } | null>,
  setLastAction: React.Dispatch<React.SetStateAction<string>>
}
const MyGoalActions: React.FC<MyGoalActionsProps> = ({ goal, setShowShareModal, setShowUpdateGoal, setLastAction }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const openInbox = useRecoilValue(displayInbox);
  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const setShowAddGoalOptions = useSetRecoilState(displayAddGoalOptions);

  const archiveThisGoal = async () => {
    if (openInbox) { await archiveSharedWMGoal(goal); } else await archiveGoal(goal);
    setLastAction("Archive");
  };

  const removeThisGoal = async () => {
    if (openInbox) {
      await deleteSharedGoal(goal);
    } else { await deleteGoal(goal); }
    setLastAction("Delete");
  };

  return (
    <div className={`interactables${darkModeStatus ? "-dark" : ""}`}>
      {!openInbox && (
      <img
        alt="add subgoal"
        src={plus}
        style={{ cursor: "pointer" }}
        onClickCapture={() => {
          // @ts-ignore
          addInHistory(goal);
          setShowAddGoalOptions(true);
        }}
      />
      )}
      <img
        alt="delete goal"
        src={trash}
        style={{ cursor: "pointer" }}
        onClickCapture={async (e) => {
          e.stopPropagation();
          await removeThisGoal();
        }}
      />
      { !openInbox && (
        <img
          alt="share goal"
          src={openInbox ? collaborateSvg : share}
          style={{ cursor: "pointer", ...(openInbox && !darkModeStatus ? { filter: "none" } : {}) }}
          onClickCapture={async (e) => {
            e.stopPropagation();
            setShowShareModal(goal.id);
          }}
        />
      )}

      <img
        alt="Update Goal"
        src={openInbox ? eyeSvg : pencil}
        style={{ cursor: "pointer" }}
        onClickCapture={() => { setShowUpdateGoal({ open: true, goalId: goal.id }); }}
      />

      { !openInbox && (
      <img
        alt="archive Goal"
        src={openInbox ? envelope : correct}
        onClickCapture={async () => { await archiveThisGoal(); }}
        style={{ cursor: "Pointer" }}
      />
      ) }
    </div>
  );
};

export default MyGoalActions;
