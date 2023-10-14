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
import { typeOfChange } from "@src/models/InboxItem";

interface AcceptBtnProps {
  goal: GoalItem;
  acceptChanges: () => Promise<void>;
  typeAtPriority: typeOfChange | "none";
}

const AcceptBtn = ({ typeAtPriority, goal, acceptChanges }: AcceptBtnProps) => {
  const darkModeStatus = useRecoilValue(darkModeState);

  const handleClick = async () => {
    await acceptChanges();

    const inbox = await getInboxItem(goal.rootGoalId);
    // if (getTypeAtPriority(inbox.goalChanges).typeAtPriority === "none") {
    // changeNewUpdatesStatus(false, goal.rootGoalId)
    //   .then(() => {
    //     setLastAction("goalUpdates");
    //   })
    //   .catch((err) => console.log(err));
    // }
  };
  return (
    <button
      type="button"
      style={{ padding: "8px 15px", justifyContent: "flex-start" }}
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      onClick={async () => {
        await acceptChanges();
      }}
    >
      <img
        alt="add changes"
        src={typeAtPriority === "deleted" ? deleteIcon : plus}
        width={25}
        style={!darkModeStatus ? { filter: "brightness(0)" } : {}}
      />
      &nbsp;
      {typeAtPriority === "archived" && "Complete for me too"}
      {typeAtPriority === "deleted" && "Delete for me too"}
      {typeAtPriority === "subgoals" && "Add all checked"}
      {typeAtPriority === "modifiedGoals" && "Make all checked changes"}
    </button>
  );
};

export default AcceptBtn;
