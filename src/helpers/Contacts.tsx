import { GoalIcon } from "@components/GoalsComponents/MyGoal/components/GoalIcon";
import { ZItemContainer } from "@components/GoalsComponents/ZItemContainer";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import ContactItem from "@src/models/ContactItem";
import React from "react";
import { useNavigate } from "@tanstack/react-router";

const Contacts = ({ contact }: { contact: ContactItem }) => {
  const navigate = useNavigate();

  const setCurrentPartnerInLocalStorage = (partnerId: string) => {
    localStorage.setItem(LocalStorageKeys.CURRENT_PARTNER, partnerId);
  };

  return (
    <ZItemContainer id={`contact-${contact.id}`} dataTestId={`contact-${contact.name}`}>
      <div
        style={{ touchAction: "none" }}
        onClickCapture={(e) => {
          e.stopPropagation();
          navigate({ to: `/partners/${contact.id}/?showOptions=true` });
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
          navigate({ to: `/partners/${contact.id}/goals/root` });
        }}
      >
        {contact.name}
      </div>
    </ZItemContainer>
  );
};

export default Contacts;
