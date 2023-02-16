import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import joinGroup from "@assets/images/joinGroup.svg";
import leaveGroup from "@assets/images/leaveGroup.svg";

import { darkModeState, displayToast, lastAction } from "@src/store";
import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { displayExploreGroups, displayGroup } from "@src/store/GroupsState";
import { addPublicGroup, deleteGroup, getPublicGroup } from "@src/api/PublicGroupsAPI";

interface MyGroupProps {
  group: PublicGroupItem,
}
const MyGroup = ({ group }: MyGroupProps) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const openExploreGroups = useRecoilValue(displayExploreGroups);

  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);
  const setSelectedGroup = useSetRecoilState(displayGroup);
  return (
    <div
      key={String(`goal-${group.id}`)}
      className={`user-goal${darkModeStatus ? "-dark" : ""}`}
    >
      <div className="goal-dropdown">
        { group.polls.length > 0 && (
          <div
            className="goal-dd-outer"
            style={{ borderColor: group.groupColor }}
          />
        )}
        <div
          className="goal-dd-inner"
          style={{
            height: "80%",
            background: `radial-gradient(50% 50% at 50% 50%, ${group.groupColor}33 79.17%, ${group.groupColor} 100%)`
          }}
        />
      </div>
      <button
        type="button"
        className="user-goal-main"
        onClick={async () => {
          if (group.polls.length === 0) { setShowToast({ open: true, extra: "Tip: Share a goal in this group", message: "Group has no activities to display" }); } else {
            setSelectedGroup({ ...(openExploreGroups ? group : await getPublicGroup(group.id)) });
          }
        }}
      >
        <div
          aria-hidden
          className="goal-title"
          suppressContentEditableWarning
        >
          <div>{group.title}</div>&nbsp;
        </div>
        <button
          type="button"
          className="contact-button"
          style={{
            background: "transparent",
            border: "none",
            top: "18px"
          }}
          onClickCapture={async (e) => {
            e.stopPropagation();
            await (openExploreGroups ? addPublicGroup(group) : deleteGroup(group.id));
            setLastAction(openExploreGroups ? "groupDeleted" : "groupAdded");
          }}
        >
          { openExploreGroups ?
            <img alt="join public group" src={joinGroup} className={darkModeStatus ? "dark-svg" : ""} />
            : <img alt="leave public group" src={leaveGroup} className={darkModeStatus ? "dark-svg" : ""} /> }
        </button>

      </button>
    </div>
  );
};

export default MyGroup;
