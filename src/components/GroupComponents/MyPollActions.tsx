import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import peopleIcon from "@assets/images/peopleIcon.svg";
import correct from "@assets/images/correct.svg";
import vote from "@assets/images/vote.svg";

import { darkModeState } from "@src/store";
import { PollActionType, IPoll } from "@src/models/PublicGroupItem";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface MyGoalActionsProps {
  poll: IPoll,
  handleClick: (typeOfAction: PollActionType) => Promise<void>
}

const MyPollActions: React.FC<MyGoalActionsProps> = ({ poll, handleClick }) => {
  const darkModeStatus = useRecoilValue(darkModeState);

  const getHelperText = (type: PollActionType) => {
    if (type === "upVotes") { return "People who liked it"; }
    if (type === "downVotes") { return "People who disliked it"; }
    if (type === "inMyGoals") { return "People who added to their My Goals"; }
    if (type === "completed") { return "People who completed this goal"; }
    return "";
  };
  const getActionImg = (typeOfAction: PollActionType, imgSrc: string, definition: string, exceptional = false, customStyle = {}) => (
    <OverlayTrigger
      trigger={typeOfAction.includes("Votes") ? "hover" : "click"}
      placement="top"
      overlay={<Tooltip id="poll-metrics"> { getHelperText(typeOfAction) } </Tooltip>}
    >
      <button
        type="button"
        onClick={async () => { if (typeOfAction.includes("Votes")) await handleClick(typeOfAction); }}
        style={{ background: "transparent", border: "none", color: "inherit" }}
      >
        <img
          alt={definition}
          src={imgSrc}
          className={exceptional ? `exceptional${darkModeStatus ? "-dark" : ""}-img` : ""}
          style={{ cursor: "pointer", ...customStyle }}
        />&nbsp;&nbsp;&nbsp;{`${poll.metrics[typeOfAction]}`}
      </button>
    </OverlayTrigger>
  );
  return (
    <div className={`interactables${darkModeStatus ? "-dark" : ""}`}>
      {getActionImg("upVotes", vote, "up vote", darkModeStatus, { rotate: "180deg" })}
      {getActionImg("downVotes", vote, "down vote", darkModeStatus)}
      {getActionImg("inMyGoals", peopleIcon, "People added to my goals", darkModeStatus)}
      {getActionImg("completed", correct, "People Completed Goal", true)}
    </div>
  );
};

export default MyPollActions;
