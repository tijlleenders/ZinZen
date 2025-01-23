import { GoalIcon } from "@components/GoalsComponents/MyGoal/components/GoalIcon";
import { GoalContainer } from "@components/GoalsComponents/ZItemContainer";
import ContactItem from "@src/models/ContactItem";
import React, { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

const Contacts = ({
  contact,
  setSelectedContact,
}: {
  contact: ContactItem;
  setSelectedContact: Dispatch<SetStateAction<ContactItem | null>>;
}) => {
  const navigate = useNavigate();

  const redirect = () => {
    const searchparam = "showOptions";
    navigate(`/partners/${contact.id}/?${searchparam}=true`);
  };

  return (
    <GoalContainer id={`goal-${contact.id}`}>
      <div
        style={{ touchAction: "none" }}
        onClickCapture={(e) => {
          e.stopPropagation();
          redirect();
          setSelectedContact(contact);
        }}
        //   {...dragAttributes}
        //   {...dragListeners}
      >
        <GoalIcon color="#007bff" showDottedBorder={false}>
          {contact.name[0]}
        </GoalIcon>
      </div>
      <div aria-hidden className="goal-tile" onClick={() => navigate(`/partners/${contact.id}/goals`)}>
        {contact.name}
      </div>
    </GoalContainer>
  );
};

export default Contacts;
