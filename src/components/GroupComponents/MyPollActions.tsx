import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import peopleIcon from "@assets/images/peopleIcon.svg";
import correct from "@assets/images/correct.svg";
import vote from "@assets/images/vote.svg";

import { darkModeState, lastAction } from "@src/store";
import { IPoll } from "@src/models/PublicGroupItem";
import { displayGroup } from "@src/store/GroupsState";
import { sendReactionOnPoll } from "@src/services/group.service";
import { updateMyMetric } from "@src/api/PublicGroupsAPI";

interface MyGoalActionsProps {
  poll: IPoll,
}
type actionType = "upVotes" | "downVotes" | "inMyGoals" | "completed"

const MyPollActions: React.FC<MyGoalActionsProps> = ({ poll }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const selectedGroup = useRecoilValue(displayGroup);
  const setLastAction = useSetRecoilState(lastAction);
  const handleClick = async (typeOfAction: string) => {
    if (selectedGroup) {
      const newMetricsState = { ...poll.myMetrics };
      if (typeOfAction === "inMygoals") {
        newMetricsState.inMyGoals = true;
      } else if (typeOfAction === "completed") {
        newMetricsState.completed = true;
      } else {
        newMetricsState.voteScore = typeOfAction === "upVotes" ? 1 : -1;
      }
      await updateMyMetric(selectedGroup.id, poll.id, newMetricsState);
      await sendReactionOnPoll(selectedGroup.id, poll.id, newMetricsState);
      setLastAction("groupAction");
    }
  };
  const getActionImg = (typeOfAction: actionType, imgSrc: string, definition: string, exceptional = false, customStyle = {}) => (
    <button
      type="button"
      onClick={async () => { await handleClick(typeOfAction); }}
      style={{ background: "transparent", border: "none", color: "inherit" }}
    >
      <img
        alt={definition}
        src={imgSrc}
        className={exceptional ? `exceptional${darkModeStatus ? "-dark" : ""}-img` : ""}
        style={{ cursor: "pointer", ...customStyle }}
      />&nbsp;&nbsp;&nbsp;{poll.metrics[typeOfAction]}
    </button>
  );
  return (
    <div className={`interactables${darkModeStatus ? "-dark" : ""}`}>
      {getActionImg("upVotes", vote, "upvote", darkModeStatus, { rotate: "180deg" })}
      {getActionImg("downVotes", vote, "downvote", darkModeStatus)}
      {getActionImg("inMyGoals", peopleIcon, "People added to my goals", darkModeStatus)}
      {getActionImg("completed", correct, "People Completed Goal", true)}
    </div>
  );
};

export default MyPollActions;
