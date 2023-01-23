import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { joinPublicGroup } from "@api/PublicGroupsAPI";
import { RetrievePublicGroupGoalItem } from "@src/models/RetrievePublicGroupGoalItem";

interface MyGroupActionsProps {
  group: RetrievePublicGroupGoalItem;
}

const MyGroupActions: React.FC<MyGroupActionsProps> = ({ group }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const joinGroup = async (groupName) => {
    await joinPublicGroup(groupName);
  };

  return (
    <div className={`group-interactables${darkModeStatus ? "-dark" : ""}`}>
      <button
        type="button"
        className="join-group-button"
        onClickCapture={() => {
          joinGroup(group.title);
        }}
      >
        {" "}
        Join group
      </button>
    </div>
  );
};

export default MyGroupActions;
