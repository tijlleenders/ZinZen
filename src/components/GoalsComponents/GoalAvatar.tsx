import React from "react";
import Icon from "@src/common/Icon";
import { GoalItem } from "@src/models/GoalItem";
import { getSvgForGoalPps } from "@src/utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const GoalAvatar = ({ goal }: { goal: GoalItem }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { partnerId } = useParams();

  const { goalColor } = goal;
  const participantsSvg = getSvgForGoalPps(goal.participants.length);

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
          const prefix = `${partnerId ? `/partners/${partnerId}/` : "/"}goals`;
          navigate(`${prefix}/${goal.parentGoalId}/${goal.id}?showParticipants=true`, { state: location.state });
        }}
      >
        <Icon active title={participantsSvg} c1={goalColor} c2={goalColor} />
      </button>
    </div>
  );
};

export default GoalAvatar;
