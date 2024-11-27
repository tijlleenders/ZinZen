import GoalIcon from "@components/GoalsComponents/MyGoal/components/GoalIcon";
import { GoalContainer } from "@components/GoalsComponents/ZItemContainer";
import ContactItem from "@src/models/ContactItem";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contacts = ({ contact }: { contact: ContactItem }) => {
  const [expandGoalId, setExpandGoalId] = useState("root");

  const [isAnimating, setIsAnimating] = useState(true);

  const navigate = useNavigate();

  return (
    <GoalContainer id={`goal-${contact.id}`} expandGoalId={expandGoalId} isAnimating={isAnimating}>
      <div className="user-goal-main">
        <div
          style={{ touchAction: "none" }}
          onClickCapture={(e) => {
            e.stopPropagation();
            // redirect(location.state, true);
          }}
          //   {...dragAttributes}
          //   {...dragListeners}
        >
          <GoalIcon color="#007bff" showDottedBorder={false}>
            {contact.name[0]}
          </GoalIcon>
        </div>
        <div aria-hidden className="goal-tile" onClick={() => navigate(`/partners/${contact.id}`)}>
          {contact.name}
        </div>
      </div>
    </GoalContainer>
  );
};

export default Contacts;
