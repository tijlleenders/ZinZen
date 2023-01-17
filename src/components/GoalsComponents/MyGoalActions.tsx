import React from "react";
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import correct from "@assets/images/correct.svg";
import pencil from "@assets/images/pencil.svg";
import share from "@assets/images/share.svg";
import trash from "@assets/images/trash.svg";

import { darkModeState } from "@src/store";
import { archiveGoal, deleteGoal } from "@src/helpers/GoalController";
import { GoalItem } from "@src/models/GoalItem";
import { addInGoalsHistory, displayAddGoalOptions } from "@src/store/GoalsState";

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
  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const setShowAddGoalOptions = useSetRecoilState(displayAddGoalOptions);

  const archiveThisGoal = async () => {
    await archiveGoal(goal);
    setLastAction("Archive");
  };

  const removeThisGoal = async () => {
    await deleteGoal(goal);
    setLastAction("Delete");
  };

  return (
    <div className={`interactables${darkModeStatus ? "-dark" : ""}`}>
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
      <img
        alt="delete goal"
        src={trash}
        style={{ cursor: "pointer" }}
        onClickCapture={async (e) => {
          e.stopPropagation();
          await removeThisGoal();
        }}
      />
      <img
        alt="share goal"
        src={share}
        style={{ cursor: "pointer" }}
        onClickCapture={(e) => {
          e.stopPropagation();
          setShowShareModal(goal.id);
        }}
      />
      <img
        alt="Update Goal"
        src={pencil}
        style={{ cursor: "pointer" }}
        onClickCapture={() => { setShowUpdateGoal({ open: true, goalId: goal.id }); }}
      />
      <img
        alt="archive Goal"
        src={correct}
        onClickCapture={async () => { await archiveThisGoal(); }}
        style={{ cursor: "Pointer" }}
      />
    </div>
  );
};

export default MyGoalActions;
