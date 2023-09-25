import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import collaborateSvg from "@assets/images/collaborate.svg";
import deleteIcon from "@assets/images/deleteIcon.svg";
import plus from "@assets/images/plus.svg";

import { darkModeState, lastAction } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { getTypeAtPriority } from "@src/helpers/GoalProcessor";
import { deleteGoalChangesInID, getInboxItem } from "@src/api/InboxAPI";
import { IDisplayChangesModal } from "@src/Interfaces/IDisplayChangesModal";
import { changeNewUpdatesStatus, convertSharedGoalToColab } from "@src/api/GoalsAPI";

interface AcceptBtnProps {
  goal: GoalItem;
  acceptChanges: () => Promise<void>;
  showChangesModal: IDisplayChangesModal;
  setShowChangesModal: React.Dispatch<React.SetStateAction<IDisplayChangesModal | null>>;
}

const AcceptBtn = ({ showChangesModal, goal, acceptChanges, setShowChangesModal }: AcceptBtnProps) => {
  const { typeAtPriority } = showChangesModal;
  const isConversionRequest = typeAtPriority === "conversionRequest";
  const darkModeStatus = useRecoilValue(darkModeState);
  const setLastAction = useSetRecoilState(lastAction);

  const handleClick = async () => {
    if (isConversionRequest) {
      // await convertTypeOfSub(goal.rootGoalId, goal.shared.contacts[0].relId, "collaboration");
      await convertSharedGoalToColab(goal.id);
      setShowChangesModal(null);
    } else {
      await acceptChanges();
      const removeChanges =
        typeAtPriority === "subgoals" ? showChangesModal.goals.map((ele) => ele.id) : [showChangesModal.goals[0].id];
      if (typeAtPriority !== "none") {
        await deleteGoalChangesInID(goal.rootGoalId, typeAtPriority, removeChanges);
      }
    }
    const inbox = await getInboxItem(goal.rootGoalId);
    if (getTypeAtPriority(inbox.goalChanges).typeAtPriority === "none") {
      changeNewUpdatesStatus(false, goal.rootGoalId)
        .then(() => {
          setLastAction("goalUpdates");
        })
        .catch((err) => console.log(err));
    }
    setShowChangesModal(null);
  };
  return (
    <button
      type="button"
      style={{ width: "100%", padding: "8px 15px", justifyContent: "flex-start" }}
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      onClick={handleClick}
    >
      <img
        alt="add changes"
        src={isConversionRequest ? collaborateSvg : typeAtPriority === "deleted" ? deleteIcon : plus}
        width={25}
        style={!darkModeStatus ? { filter: "brightness(0)" } : {}}
      />
      &nbsp;
      {isConversionRequest ? (
        `Collaborate with ${goal.shared.contacts[0].name}`
      ) : (
        <>
          {typeAtPriority === "archived" && "Complete for me too"}
          {typeAtPriority === "deleted" && "Delete for me too"}
          {typeAtPriority === "subgoals" && "Add all checked"}
          {typeAtPriority === "modifiedGoals" && "Make all checked changes"}
        </>
      )}
    </button>
  );
};

export default AcceptBtn;
