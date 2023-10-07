import BottomNavLayout from "@src/layouts/BottomNavLayout";
import ContactItem from "@src/models/ContactItem";
import React from "react";

const ParticipantsNavbar = ({
  list,
  activePartner,
  setActivePartner,
}: {
  list: ContactItem[];
  activePartner: ContactItem;
  setActivePartner: React.Dispatch<React.SetStateAction<ContactItem>>;
}) => {
  return (
    <BottomNavLayout>
      {list.map((contact) => (
        <button
          key={contact.relId}
          type="button"
          onClick={() => {
            setActivePartner(contact);
          }}
          className={`bottom-nav-item ${activePartner.relId === contact.relId ? "active" : ""}`}
        >
          <p>{contact.name}</p>
        </button>
      ))}
    </BottomNavLayout>
  );
};

export default ParticipantsNavbar;
