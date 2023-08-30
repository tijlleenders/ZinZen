import React from "react";
import { useRecoilValue } from "recoil";

import ignore from "@assets/images/ignore.svg";

import { darkModeState } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { getTypeAtPriority } from "@src/helpers/GoalProcessor";
import { deleteGoalChangesInID, getInboxItem, removeGoalInbox } from "@src/api/InboxAPI";
import { IDisplayChangesModal } from "@src/Interfaces/IDisplayChangesModal";
import { changeNewUpdatesStatus, convertSharedGoalToColab } from "@src/api/GoalsAPI";

interface IgnoreBtnProps {
  goal: GoalItem;
  showChangesModal: IDisplayChangesModal;
  setShowChangesModal: React.Dispatch<React.SetStateAction<IDisplayChangesModal | null>>;
}
const IgnoreBtn = ({ showChangesModal, goal, setShowChangesModal }: IgnoreBtnProps) => {
  const { typeAtPriority } = showChangesModal;
  const isConversionRequest = typeAtPriority === "conversionRequest";
  const darkModeStatus = useRecoilValue(darkModeState);

  const handleClick = async () => {
    let deleteInbox = false;
    if (isConversionRequest) {
      deleteInbox = true;
      convertSharedGoalToColab(goal.id, false);
    } else {
      const removeChanges = showChangesModal.goals.map((colabGoal: GoalItem) => colabGoal.id);
      if (typeAtPriority !== "none") {
        await deleteGoalChangesInID(goal.rootGoalId, typeAtPriority, removeChanges);
      }
    }
    const inbox = await getInboxItem(goal.rootGoalId);
    if (deleteInbox || getTypeAtPriority(inbox.goalChanges).typeAtPriority === "none") {
      await changeNewUpdatesStatus(false, goal.rootGoalId).catch((err) => console.log(err));
      removeGoalInbox(goal.rootGoalId);
    }
    setShowChangesModal(null);
  };
  return (
    <button
      type="button"
      style={{
        padding: "8px 15px",
        backgroundColor: "rgba(115, 115, 115, 0.6)",
        width: "100%",
        justifyContent: "flex-start",
      }}
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      onClick={handleClick}
    >
      <img alt="add changes" src={ignore} width={25} />
      &nbsp;{isConversionRequest ? "Keep separate" : "Ignore all"}
    </button>
  );
};

export default IgnoreBtn;
