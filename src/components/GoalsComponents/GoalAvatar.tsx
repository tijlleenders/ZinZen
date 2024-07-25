import React from "react";
import Icon from "@src/common/Icon";
import { GoalItem } from "@src/models/GoalItem";
import { getSvgForGoalPps } from "@src/utils";
import { useLocation, useNavigate } from "react-router-dom";

const GoalAvatar = ({ goal }: { goal: GoalItem }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, participants, goalColor } = goal;
  const participantsSvg = getSvgForGoalPps(participants.length);

  return (
    <div className="contact-button" style={goal.archived ? { right: 60 } : {}}>
      <button
        type="button"
        className="contact-icon pps-icon"
        aria-label="Navigate to participants"
        style={{
          cursor: "pointer",
          background: `radial-gradient(50% 50% at 50% 50%, ${goalColor}33 20% 79.17%, ${goalColor} 100%)`,
        }}
        onClick={() => {
          navigate("/goals", {
            state: {
              ...location.state,
              displayParticipants: id,
            },
          });
        }}
      >
        <Icon active title={participantsSvg} c1={goalColor} c2={goalColor} />
      </button>
    </div>
  );
};

export default GoalAvatar;
