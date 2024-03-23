import React from "react";
import { useRecoilValue } from "recoil";

import deleteIcon from "@assets/images/deleteIcon.svg";
import plus from "@assets/images/plus.svg";

import { darkModeState } from "@src/store";
import { typeOfChange } from "@src/models/InboxItem";

interface AcceptBtnProps {
  acceptChanges: () => Promise<void>;
  typeAtPriority: typeOfChange | "none";
}

const AcceptBtn = ({ typeAtPriority, acceptChanges }: AcceptBtnProps) => {
  const darkModeStatus = useRecoilValue(darkModeState);
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
      {typeAtPriority === "restored" && "Restore for me too"}
      {typeAtPriority === "deleted" && "Delete for me too"}
      {typeAtPriority === "subgoals" && "Add all checked"}
      {typeAtPriority === "modifiedGoals" && "Make all checked changes"}
    </button>
  );
};

export default AcceptBtn;
