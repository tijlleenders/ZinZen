import React from "react";

import ignore from "@assets/images/ignore.svg";

import { GoalItem } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";
import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";
import { convertSharedGoalToColab } from "@src/api/GoalsAPI";

interface IgnoreBtnProps {
    goal: GoalItem,
    changeType: typeOfChange | "none",
    setShowChangesModal: React.Dispatch<React.SetStateAction<GoalItem | null>>

}
const IgnoreBtn = ({ changeType, goal, setShowChangesModal }: IgnoreBtnProps) => {
  const { conversionRequests } = goal.shared;
  const darkModeStatus = useRecoilValue(darkModeState);

  const handleClick = async () => {
    if (conversionRequests) {
      convertSharedGoalToColab(goal.id, false);
      setShowChangesModal(null);
    } else {

    }
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
      />&nbsp;{ conversionRequests ? "Keep separate" : `Ignore ${changeType !== "archived" && "all"}`}
    </button>
  );
};

export default IgnoreBtn;
