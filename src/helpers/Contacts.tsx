import GoalIcon from "@components/GoalsComponents/MyGoal/components/GoalIcon";
import GoalTitle from "@components/GoalsComponents/MyGoal/components/GoalTitle";
import { GoalContainer } from "@components/GoalsComponents/ZItemContainer";
import Icon from "@src/common/Icon";
import ContactItem from "@src/models/ContactItem";
import React, { useState } from "react";

const Contacts = ({ contact }: { contact: ContactItem }) => {
  const [expandGoalId, setExpandGoalId] = useState("root");

  const [isAnimating, setIsAnimating] = useState(true);

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
        <div aria-hidden className="goal-tile" onClick={() => {}}>
          {contact.name}
        </div>
      </div>
    </GoalContainer>
  );
};

export default Contacts;
