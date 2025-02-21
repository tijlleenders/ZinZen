import { GoalIcon } from "@components/GoalsComponents/MyGoal/components/GoalIcon";
import { ZItemContainer } from "@components/GoalsComponents/ZItemContainer";
import ContactItem from "@src/models/ContactItem";
import React from "react";
import { useNavigate } from "react-router-dom";

const Contacts = ({ contact }: { contact: ContactItem }) => {
  const navigate = useNavigate();

  return (
    <ZItemContainer id={`goal-${contact.id}`}>
      <div
        style={{ touchAction: "none" }}
        onClickCapture={(e) => {
          e.stopPropagation();
          navigate(`/partners/${contact.id}/?showOptions=true`);
        }}
      >
        <GoalIcon color="#007bff" showDottedBorder={false}>
          {contact.name[0]}
        </GoalIcon>
      </div>
      <div aria-hidden className="goal-tile" onClick={() => navigate(`/partners/${contact.id}/goals`)}>
        {contact.name}
      </div>
    </ZItemContainer>
  );
};

export default Contacts;
