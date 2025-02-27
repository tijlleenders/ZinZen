import { GoalIcon } from "@components/GoalsComponents/MyGoal/components/GoalIcon";
import { ZItemContainer } from "@components/GoalsComponents/ZItemContainer";
import { usePartnerContext } from "@src/contexts/partner-context";
import ContactItem from "@src/models/ContactItem";
import React from "react";
import { useNavigate } from "react-router-dom";

const Contacts = ({ contact }: { contact: ContactItem }) => {
  const navigate = useNavigate();
  const { setCurrentPartnerInLocalStorage } = usePartnerContext();

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
      <div
        aria-hidden
        className="goal-tile"
        data-testid={`contact-${contact.name}`}
        onClick={() => {
          setCurrentPartnerInLocalStorage(contact.id);
          navigate(`/partners/${contact.id}/goals`);
        }}
      >
        {contact.name}
      </div>
    </ZItemContainer>
  );
};

export default Contacts;
