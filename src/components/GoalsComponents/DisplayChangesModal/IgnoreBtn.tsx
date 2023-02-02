import React from "react";

import ignore from "@assets/images/ignore.svg";

import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";
import { changeNewUpdatesStatus, convertSharedGoalToColab } from "@src/api/GoalsAPI";
import { IDisplayChangesModal } from "@src/Interfaces/IDisplayChangesModal";
import { deleteGoalChangesInID, getInboxItem } from "@src/api/InboxAPI";
import { getTypeAtPriority } from "@src/helpers/GoalProcessor";

interface IgnoreBtnProps {
    goal: GoalItem,
    showChangesModal: IDisplayChangesModal,
    setShowChangesModal: React.Dispatch<React.SetStateAction<IDisplayChangesModal | null>>
}
const IgnoreBtn = ({ showChangesModal, goal, setShowChangesModal }: IgnoreBtnProps) => {
  const { typeAtPriority } = showChangesModal;
  const isConversionRequest = typeAtPriority === "conversionRequest";
  const darkModeStatus = useRecoilValue(darkModeState);

  const handleClick = async () => {
    if (isConversionRequest) {
      convertSharedGoalToColab(goal.id, false);
      setShowChangesModal(null);
    } else {
      const removeChanges = showChangesModal.goals.map((colabGoal: GoalItem) => colabGoal.id);
      if (typeAtPriority !== "none") { await deleteGoalChangesInID(goal.rootGoalId, typeAtPriority, removeChanges); }
    }
    const inbox = await getInboxItem(goal.rootGoalId);
    if (getTypeAtPriority(inbox.goalChanges).typeAtPriority === "none") {
      changeNewUpdatesStatus(false, goal.rootGoalId).catch((err) => console.log(err));
    }
    setShowChangesModal(null);
  };
  return (

    <button
      type="button"
      style={{ backgroundColor: "rgba(115, 115, 115, 0.6)", width: "100%", justifyContent: "flex-start" }}
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      onClick={handleClick}
    >
      <img
        alt="add changes"
        src={ignore}
        width={25}
      />&nbsp;{ isConversionRequest ? "Keep separate" : `Ignore${typeAtPriority === "subgoals" ? " all" : ""}`}
    </button>
  );
};

export default IgnoreBtn;
