import Icon from "@src/common/Icon";
import { GoalItem } from "@src/models/GoalItem";
import { openInbox } from "@src/store";
import { getSvgForGoalPps } from "@src/utils";
import { Tooltip } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

const Avatar = ({ goal }: { goal: GoalItem }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { participants, goalColor } = goal;
  const participantsSvg = getSvgForGoalPps(participants.length);

  return (
    <div className="contact-button" style={goal.archived ? { right: "78px" } : {}}>
      <button
        type="button"
        className="contact-icon pps-icon"
        style={{
          cursor: "pointer",
          background: `radial-gradient(50% 50% at 50% 50%, ${goalColor}33 20% 79.17%, ${goalColor} 100%)`,
        }}
        onClick={() => {
          navigate("/MyGoals", {
            state: {
              ...location.state,
              displayParticipants: goal.participants,
            },
          });
        }}
      >
        <Icon active title={participantsSvg} c1={goalColor} c2={goalColor} />
      </button>
    </div>
  );
};

const GoalAvatar = ({ goal }: { goal: GoalItem }) => {
  const isInboxOpen = useRecoilValue(openInbox);

  return isInboxOpen ? (
    <Tooltip placement="top" title={goal.participants[0].name}>
      <div className="contact-button" style={goal.archived ? { right: "78px" } : {}}>
        <button
          type="button"
          className="contact-icon"
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 20% 79.17%, ${goal.goalColor} 100%)`,
          }}
        >
          {goal.participants[0].name.charAt(0)}
        </button>
      </div>
    </Tooltip>
  ) : (
    <Avatar goal={goal} />
  );
};

export default GoalAvatar;
