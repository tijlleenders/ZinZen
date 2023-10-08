import BottomNavLayout from "@src/layouts/BottomNavLayout";
import ContactItem from "@src/models/ContactItem";
import React from "react";

const ParticipantsNavbar = ({
  list,
  activePartner,
  handleActivePartner,
}: {
  list: ContactItem[];
  activePartner: ContactItem;
  handleActivePartner: (partner: ContactItem) => void;
}) => {
  return (
    <BottomNavLayout>
      {list.map((contact) => (
        <button
          key={contact.relId}
          type="button"
          onClick={() => {
            handleActivePartner(contact);
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
