import { GoalIcon } from "@components/GoalsComponents/MyGoal/components/GoalIcon";
import { ZItemContainer } from "@components/GoalsComponents/ZItemContainer";
import ContactItem from "@src/models/ContactItem";
import React from "react";
import { Link } from "@tanstack/react-router";
import { setCurrentPartnerInLocalStorage } from "@src/utils/partnerStorage";

const Contacts = ({ contact }: { contact: ContactItem }) => {
  return (
    <ZItemContainer id={`contact-${contact.id}`} dataTestId={`contact-${contact.name}`}>
      <Link
        style={{ touchAction: "none", textDecoration: "none" }}
        params={{ partnerId: contact.id }}
        to="/partners/$partnerId"
        search={{ showOptions: "contactOptions" }}
      >
        <GoalIcon color="#007bff" showDottedBorder={false}>
          {contact.name[0]}
        </GoalIcon>
      </Link>
      <Link
        style={{ textDecoration: "none" }}
        className="goal-title"
        data-testid={`contact-${contact.name}`}
        params={{ partnerId: contact.id, parentId: "root" }}
        to="/partners/$partnerId/goals/$parentId"
        onClick={() => {
          setCurrentPartnerInLocalStorage(contact.id);
        }}
      >
        {contact.name}
      </Link>
    </ZItemContainer>
  );
};

export default Contacts;
