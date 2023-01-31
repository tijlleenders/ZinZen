import React from "react";
import { useRecoilValue } from "recoil";

import collaborateSvg from "@assets/images/collaborate.svg";
import trash from "@assets/images/trash.svg";

import { GoalItem } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";
import { darkModeState } from "@src/store";
import { convertSharedGoalToColab } from "@src/api/GoalsAPI";

interface AcceptBtnProps {
    goal: GoalItem,
    changeType: typeOfChange | "none",
    setShowChangesModal: React.Dispatch<React.SetStateAction<GoalItem | null>>
}

const AcceptBtn = ({ changeType, goal, setShowChangesModal } : AcceptBtnProps) => {
  const { conversionRequests } = goal.shared;
  const darkModeStatus = useRecoilValue(darkModeState);

  const handleClick = async () => {
    if (conversionRequests) {
      await convertSharedGoalToColab(goal.id);
      setShowChangesModal(null);
    } else {

    }
  };
  return (
    <button
      type="button"
      style={{ width: "100%", justifyContent: "flex-start" }}
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      onClick={handleClick}
    >
      <img
        alt="add changes"
        src={conversionRequests ? collaborateSvg : (changeType === "deleted" ? trash : plus)}
        width={25}
        style={conversionRequests ? { filter: "brightness(0)" } : {}}
      />&nbsp;
      {conversionRequests ? `Collaborate with ${goal.shared.contacts[0].name}` : (
        <>{ changeType === "archived" && "Complete for me too" }
          { changeType === "deleted" && "Delete for me too" }
          { changeType === "subgoals" && "Add all checked" }
          { changeType === "modifiedGoals" && "Make all checked changes" }
        </>
      )}
    </button>
  );
};

export default AcceptBtn;
